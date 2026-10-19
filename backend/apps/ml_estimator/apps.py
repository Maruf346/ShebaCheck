from django.apps import AppConfig


class MlEstimatorConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "apps.ml_estimator"
    verbose_name = "ML Job Diagnostic & Fair-Price Estimator"
