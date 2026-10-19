import os
import re
from pathlib import Path
import numpy as np

MODEL_DIR = Path(__file__).resolve().parent / "artifacts"
MODEL_PATH = MODEL_DIR / "estimator_pipeline.joblib"


class JobEstimatorPipeline:
    """
    NLP & Scikit-Learn Regression/Classifier Pipeline for ShebaCheck.
    Extracts TF-IDF features from raw problem descriptions, classifies the
    home service category, and predicts continuous fair price ranges, estimated
    repair duration, complexity level, and recommended replacement parts.
    """

    def __init__(self):
        from sklearn.feature_extraction.text import TfidfVectorizer
        from sklearn.linear_model import LogisticRegression, Ridge

        self.vectorizer = TfidfVectorizer(
            ngram_range=(1, 2),
            sublinear_tf=True,
            strip_accents="unicode",
            lowercase=True,
        )
        self.category_classifier = LogisticRegression(
            C=3.5,
            max_iter=1000,
            class_weight="balanced",
            random_state=42,
        )
        self.price_regressor = Ridge(alpha=1.2, random_state=42)
        self.duration_regressor = Ridge(alpha=1.0, random_state=42)
        self.categories_ = []
        self.dataset_records = []
        self.is_trained = False

    def train(self, dataset=None):
        if dataset is None:
            from .dataset import TRAINING_DATA
            dataset = TRAINING_DATA

        self.dataset_records = dataset
        texts = [row["text"] for row in dataset]
        categories = [row["category"] for row in dataset]
        prices = np.array([row["base_price"] for row in dataset], dtype=float)
        durations = np.array([row["duration_minutes"] for row in dataset], dtype=float)

        X = self.vectorizer.fit_transform(texts)
        self.category_classifier.fit(X, categories)
        self.price_regressor.fit(X, prices)
        self.duration_regressor.fit(X, durations)
        self.categories_ = list(self.category_classifier.classes_)
        self.is_trained = True

    def predict(self, query_text: str):
        if not self.is_trained:
            self.train()

        clean_text = query_text.strip()
        X_test = self.vectorizer.transform([clean_text])

        # Category prediction and probabilities
        predicted_category = str(self.category_classifier.predict(X_test)[0])
        probs = self.category_classifier.predict_proba(X_test)[0]
        category_confidences = {
            str(cls_name): round(float(prob), 3)
            for cls_name, prob in zip(self.category_classifier.classes_, probs)
        }
        confidence = float(np.max(probs))

        # Regression predictions for price and duration
        pred_price = float(self.price_regressor.predict(X_test)[0])
        pred_duration = float(self.duration_regressor.predict(X_test)[0])

        # Fallback bounds based on dataset
        category_rows = [r for r in self.dataset_records if r["category"] == predicted_category]
        if not category_rows:
            category_rows = self.dataset_records

        avg_cat_price = float(np.mean([r["base_price"] for r in category_rows]))
        # Smooth with category average for out-of-distribution texts
        pred_price = max(350.0, 0.7 * pred_price + 0.3 * avg_cat_price)
        pred_price = round(pred_price / 50.0) * 50.0  # round to nearest 50 BDT

        price_min = round(pred_price * 0.82 / 50.0) * 50.0
        price_max = round(pred_price * 1.28 / 50.0) * 50.0

        est_duration = max(30, int(round(pred_duration / 5.0) * 5))

        # Find closest reference diagnostic in dataset using cosine similarity
        from sklearn.metrics.pairwise import cosine_similarity
        X_all = self.vectorizer.transform([r["text"] for r in self.dataset_records])
        similarities = cosine_similarity(X_test, X_all)[0]
        best_idx = int(np.argmax(similarities))
        best_match = self.dataset_records[best_idx]

        # Use best match parts and complexity or infer
        parts = [str(p) for p in best_match.get("parts", [])]
        diagnostic_summary = str(best_match.get("diagnostic_summary", ""))
        service_label = str(best_match.get("service_name", f"{predicted_category} Diagnostic & Service"))
        complexity = str(best_match.get("complexity", "Medium" if pred_price > 900 else "Low"))

        return {
            "query": str(query_text),
            "predicted_category": str(predicted_category),
            "confidence": round(float(confidence), 2),
            "category_probabilities": category_confidences,
            "service_label": service_label,
            "diagnostic_summary": diagnostic_summary,
            "price_estimate": int(pred_price),
            "price_min": int(price_min),
            "price_max": int(price_max),
            "duration_minutes": int(est_duration),
            "complexity": complexity,
            "recommended_parts": parts,
            "similarity_score": round(float(similarities[best_idx]), 2),
        }

    def save(self, filepath=None):
        import joblib
        dest = Path(filepath) if filepath else MODEL_PATH
        dest.parent.mkdir(parents=True, exist_ok=True)
        joblib.dump(self, dest)

    @classmethod
    def load(cls, filepath=None):
        import joblib
        src = Path(filepath) if filepath else MODEL_PATH
        if src.exists():
            return joblib.load(src)
        return None


_MODEL_INSTANCE = None


def get_estimator_model():
    """Returns singleton loaded or newly trained model instance."""
    global _MODEL_INSTANCE
    if _MODEL_INSTANCE is not None:
        return _MODEL_INSTANCE

    # Try loading from disk
    if MODEL_PATH.exists():
        try:
            _MODEL_INSTANCE = JobEstimatorPipeline.load()
            if _MODEL_INSTANCE is not None and _MODEL_INSTANCE.is_trained:
                return _MODEL_INSTANCE
        except Exception:
            pass

    # Otherwise train fresh and save
    pipeline = JobEstimatorPipeline()
    pipeline.train()
    try:
        pipeline.save()
    except Exception:
        pass
    _MODEL_INSTANCE = pipeline
    return _MODEL_INSTANCE
