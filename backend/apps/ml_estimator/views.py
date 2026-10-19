from decimal import Decimal
from django.db.models import Avg, Count, FloatField, Q, Value
from django.db.models.functions import Coalesce
from drf_spectacular.utils import extend_schema
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from apps.providers.models import ProviderProfile, ProviderService
from .pipeline import get_estimator_model
from .serializers import JobEstimateRequestSerializer, JobEstimateResponseSerializer


@extend_schema(
    tags=["Machine Learning"],
    summary="AI Job Diagnostic & Fair-Price Estimator",
    description="Analyzes free-form natural language problem descriptions using TF-IDF NLP and Regression/Classification models to predict service category, fair cost range, repair duration, complexity, required parts, and returns top matched verified providers.",
    request=JobEstimateRequestSerializer,
    responses={200: JobEstimateResponseSerializer},
)
@api_view(["POST"])
@permission_classes([AllowAny])
def estimate_job_cost(request):
    serializer = JobEstimateRequestSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    description = serializer.validated_data["problem_description"]
    area = serializer.validated_data.get("area", "").strip()

    # 1. Run ML Pipeline inference
    estimator = get_estimator_model()
    prediction = estimator.predict(description)

    predicted_cat = prediction["predicted_category"]
    price_est = prediction["price_estimate"]

    # 2. Match active providers in database
    providers_qs = (
        ProviderProfile.objects.filter(is_active=True, user__is_active=True)
        .select_related("user")
        .prefetch_related("services")
        .annotate(
            avg_rating=Coalesce(Avg("provider_reviews__rating"), Value(4.8), output_field=FloatField()),
            rev_count=Count("provider_reviews", distinct=True),
        )
    )

    scored_providers = []
    user_area_norm = area.lower() if area else ""

    for provider in providers_qs:
        score = 0

        # Category match
        if provider.category.lower() == predicted_cat.lower():
            score += 50
        elif predicted_cat.lower() in provider.category.lower() or provider.category.lower() in predicted_cat.lower():
            score += 35

        # Area proximity match
        prov_area_norm = provider.area.lower()
        if user_area_norm:
            if user_area_norm in prov_area_norm or prov_area_norm in user_area_norm:
                score += 25
            elif any(part in prov_area_norm for part in user_area_norm.split() if len(part) > 3):
                score += 15

        # Rating score
        rating_val = float(provider.avg_rating or 4.5)
        score += int((rating_val / 5.0) * 15)

        # Verified badge
        if provider.identity_verified:
            score += 10

        # Price proximity to ML estimated fair price
        try:
            start_price = float(provider.starting_price)
            if price_est > 0:
                price_ratio = min(start_price, price_est) / max(start_price, price_est)
                score += int(price_ratio * 10)
        except (ValueError, TypeError):
            pass

        # Pick best service of provider
        services = list(provider.services.all())
        best_service = None
        for svc in services:
            if svc.name.lower() in prediction["service_label"].lower() or prediction["service_label"].lower() in svc.name.lower():
                best_service = svc
                break
        if not best_service and services:
            best_service = services[0]

        scored_providers.append({
            "id": provider.id,
            "name": provider.display_name,
            "category": provider.category,
            "area": provider.area,
            "rating": round(rating_val, 1),
            "review_count": provider.rev_count,
            "starting_price": provider.starting_price,
            "image_url": provider.image_url or "/images/providers/default.jpg",
            "identity_verified": provider.identity_verified,
            "response_time": provider.response_time or "Replies in 15 mins",
            "years_experience": provider.years_experience or 5,
            "match_score": min(99, max(60, score)),
            "service_id": best_service.id if best_service else None,
            "service_name": best_service.name if best_service else f"{provider.category} Standard Diagnostic",
            "service_price": best_service.price if best_service else provider.starting_price,
        })

    # Sort matched providers by score descending
    scored_providers.sort(key=lambda p: p["match_score"], reverse=True)
    top_matched = scored_providers[:3]

    response_data = {
        **prediction,
        "matched_providers": top_matched,
    }
    return Response(response_data, status=status.HTTP_200_OK)
