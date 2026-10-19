from rest_framework import serializers

from .models import AvailabilityBlock, PortfolioItem, ProviderProfile, ProviderService


class ProviderServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProviderService
        fields = ("id", "name", "description", "price", "is_active", "created_at")
        read_only_fields = ("id", "is_active", "created_at")


class PortfolioItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = PortfolioItem
        fields = ("id", "title", "description", "image_url", "completed_at", "is_published", "created_at")
        read_only_fields = ("id", "is_published", "created_at")


class PublicProviderSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source="display_name", read_only=True)
    verified_identity = serializers.BooleanField(source="identity_verified", read_only=True)
    image = serializers.URLField(source="image_url", read_only=True)
    starting_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    rating = serializers.SerializerMethodField()
    reviews = serializers.SerializerMethodField()
    completed_jobs = serializers.SerializerMethodField()
    services = ProviderServiceSerializer(many=True, read_only=True)
    portfolio = serializers.SerializerMethodField()
    unavailable_dates = serializers.SerializerMethodField()

    class Meta:
        model = ProviderProfile
        fields = (
            "id", "name", "category", "area", "rating", "reviews", "verified_identity",
            "completed_jobs", "cancellation_rate", "response_time", "starting_price", "image",
            "bio", "tags", "years_experience", "services", "portfolio", "unavailable_dates",
        )

    def get_rating(self, obj: ProviderProfile) -> float:
        return round(float(getattr(obj, "average_rating", 0) or 0), 1)

    def get_reviews(self, obj: ProviderProfile) -> int:
        return int(getattr(obj, "review_count", 0) or 0)

    def get_completed_jobs(self, obj: ProviderProfile) -> int:
        return int(getattr(obj, "completed_count", 0) or 0)

    def get_portfolio(self, obj: ProviderProfile) -> list[dict]:
        return PortfolioItemSerializer(obj.portfolio.filter(is_published=True), many=True).data

    def get_unavailable_dates(self, obj: ProviderProfile) -> list[str]:
        return [day.isoformat() for day in obj.availability_blocks.values_list("date", flat=True)]


class ProviderProfileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProviderProfile
        fields = (
            "display_name", "category", "area", "bio", "image_url", "years_experience",
            "starting_price", "response_time", "tags",
        )


class AvailabilityBlockSerializer(serializers.ModelSerializer):
    class Meta:
        model = AvailabilityBlock
        fields = ("id", "date", "reason", "created_at")
        read_only_fields = ("id", "created_at")
