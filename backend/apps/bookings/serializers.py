from django.utils import timezone
from rest_framework import serializers

from apps.providers.models import ProviderProfile, ProviderService
from .models import Booking


class BookingCreateSerializer(serializers.ModelSerializer):
    provider_id = serializers.PrimaryKeyRelatedField(source="provider", queryset=ProviderProfile.objects.filter(is_active=True), write_only=True)
    service_id = serializers.PrimaryKeyRelatedField(source="service", queryset=ProviderService.objects.filter(is_active=True), write_only=True, required=False, allow_null=True)

    class Meta:
        model = Booking
        fields = (
            "id", "provider_id", "service_id", "service_name", "description", "address", "area",
            "appointment_at", "phone", "access_instructions", "price_estimate",
        )
        read_only_fields = ("id",)

    def validate(self, attrs):
        provider = attrs["provider"]
        service = attrs.get("service")
        if service and service.provider_id != provider.id:
            raise serializers.ValidationError({"service_id": "The selected service does not belong to this provider."})
        appointment_at = attrs["appointment_at"]
        if appointment_at <= timezone.now():
            raise serializers.ValidationError({"appointment_at": "Choose a future appointment time."})
        if service:
            attrs["service_name"] = service.name
            attrs["price_estimate"] = service.price
        return attrs

    def create(self, validated_data):
        return Booking.objects.create(customer=self.context["request"].user, **validated_data)


class BookingSerializer(serializers.ModelSerializer):
    customer_name = serializers.SerializerMethodField()
    provider_name = serializers.CharField(source="provider.display_name", read_only=True)

    class Meta:
        model = Booking
        fields = (
            "id", "customer", "customer_name", "provider", "provider_name", "service", "service_name",
            "description", "address", "area", "appointment_at", "phone", "access_instructions",
            "price_estimate", "status", "created_at", "updated_at",
        )
        read_only_fields = fields

    def get_customer_name(self, obj: Booking) -> str:
        return " ".join(part for part in (obj.customer.first_name, obj.customer.last_name) if part).strip() or obj.customer.email


class BookingStatusSerializer(serializers.Serializer):
    status = serializers.ChoiceField(choices=Booking.Status.choices)

    def validate_status(self, value: str) -> str:
        allowed = {
            Booking.Status.REQUESTED: {Booking.Status.CONFIRMED, Booking.Status.DECLINED, Booking.Status.RESCHEDULE_REQUESTED, Booking.Status.CANCELLED},
            Booking.Status.CONFIRMED: {Booking.Status.COMPLETED, Booking.Status.CANCELLED, Booking.Status.RESCHEDULE_REQUESTED},
            Booking.Status.RESCHEDULE_REQUESTED: {Booking.Status.CONFIRMED, Booking.Status.CANCELLED},
            Booking.Status.COMPLETED: set(),
            Booking.Status.CANCELLED: set(),
            Booking.Status.DECLINED: set(),
            Booking.Status.DISPUTE_OPEN: set(),
        }
        booking = self.context["booking"]
        if value not in allowed[booking.status]:
            raise serializers.ValidationError(f"Cannot change booking from {booking.status} to {value}.")
        return value
