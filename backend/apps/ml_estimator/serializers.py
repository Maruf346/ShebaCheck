from rest_framework import serializers


class JobEstimateRequestSerializer(serializers.Serializer):
    problem_description = serializers.CharField(
        min_length=5,
        max_length=1500,
        help_text="Natural language description of the repair or maintenance problem.",
    )
    area = serializers.CharField(
        required=False,
        allow_blank=True,
        default="",
        max_length=100,
        help_text="Customer area/zone in Dhaka (e.g., Gulshan 2, Dhanmondi, Banani, Mirpur).",
    )


class MatchedProviderSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField()
    category = serializers.CharField()
    area = serializers.CharField()
    rating = serializers.FloatField()
    review_count = serializers.IntegerField()
    starting_price = serializers.DecimalField(max_digits=10, decimal_places=2)
    image_url = serializers.CharField()
    identity_verified = serializers.BooleanField()
    response_time = serializers.CharField()
    years_experience = serializers.IntegerField()
    match_score = serializers.IntegerField()
    service_id = serializers.IntegerField(allow_null=True)
    service_name = serializers.CharField()
    service_price = serializers.DecimalField(max_digits=10, decimal_places=2, allow_null=True)


class JobEstimateResponseSerializer(serializers.Serializer):
    query = serializers.CharField()
    predicted_category = serializers.CharField()
    confidence = serializers.FloatField()
    category_probabilities = serializers.DictField(child=serializers.FloatField())
    service_label = serializers.CharField()
    diagnostic_summary = serializers.CharField()
    price_estimate = serializers.IntegerField()
    price_min = serializers.IntegerField()
    price_max = serializers.IntegerField()
    duration_minutes = serializers.IntegerField()
    complexity = serializers.CharField()
    recommended_parts = serializers.ListField(child=serializers.CharField())
    similarity_score = serializers.FloatField()
    matched_providers = MatchedProviderSerializer(many=True)
