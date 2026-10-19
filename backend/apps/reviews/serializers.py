from rest_framework import serializers

from .models import Review


class ReviewSerializer(serializers.ModelSerializer):
    customer_name = serializers.SerializerMethodField()
    provider_name = serializers.CharField(source="provider.display_name", read_only=True)

    class Meta:
        model = Review
        fields = ("id", "booking", "customer", "customer_name", "provider", "provider_name", "rating", "body", "provider_reply", "created_at", "updated_at")
        read_only_fields = ("id", "customer", "customer_name", "provider", "provider_name", "provider_reply", "created_at", "updated_at")

    def get_customer_name(self, obj: Review) -> str:
        return " ".join(part for part in (obj.customer.first_name, obj.customer.last_name) if part).strip() or "Customer"

    def validate_booking(self, booking):
        request = self.context["request"]
        if booking.customer_id != request.user.id:
            raise serializers.ValidationError("You can only review your own booking.")
        if booking.status != "completed":
            raise serializers.ValidationError("Only completed bookings may be reviewed.")
        if Review.objects.filter(booking=booking).exists():
            raise serializers.ValidationError("This booking already has a review.")
        return booking

    def create(self, validated_data):
        booking = validated_data["booking"]
        return Review.objects.create(customer=self.context["request"].user, provider=booking.provider, **validated_data)


class ProviderReplySerializer(serializers.Serializer):
    provider_reply = serializers.CharField(max_length=2000, allow_blank=False)
