from rest_framework import serializers

from apps.bookings.models import Booking
from .models import Dispute


class DisputeCreateSerializer(serializers.ModelSerializer):
    booking_id = serializers.PrimaryKeyRelatedField(source="booking", queryset=Booking.objects.all(), write_only=True)

    class Meta:
        model = Dispute
        fields = ("id", "booking_id", "description", "created_at")
        read_only_fields = ("id", "created_at")

    def validate_booking_id(self, booking: Booking) -> Booking:
        request = self.context["request"]
        if booking.customer_id != request.user.id:
            raise serializers.ValidationError("You can only report a concern about your own booking.")
        if booking.status not in (Booking.Status.COMPLETED, Booking.Status.CONFIRMED):
            raise serializers.ValidationError("A dispute can only be opened for a confirmed or completed booking.")
        if booking.disputes.exclude(status__in=(Dispute.Status.REJECTED,)).exists():
            raise serializers.ValidationError("An active dispute already exists for this booking.")
        return booking

    def create(self, validated_data):
        booking = validated_data["booking"]
        previous_status = booking.status
        booking.status = Booking.Status.DISPUTE_OPEN
        booking.save(update_fields=("status", "updated_at"))
        return Dispute.objects.create(
            customer=self.context["request"].user,
            provider=booking.provider,
            booking_previous_status=previous_status,
            **validated_data,
        )


class DisputeSerializer(serializers.ModelSerializer):
    booking_id = serializers.IntegerField(read_only=True)
    provider_name = serializers.CharField(source="provider.display_name", read_only=True)

    class Meta:
        model = Dispute
        fields = ("id", "booking_id", "provider_name", "description", "status", "resolution_note", "created_at", "updated_at")
        read_only_fields = fields


class DisputeResolutionSerializer(serializers.Serializer):
    status = serializers.ChoiceField(choices=(Dispute.Status.IN_REVIEW, Dispute.Status.RESOLVED, Dispute.Status.REJECTED))
    resolution_note = serializers.CharField(max_length=4000, required=False, allow_blank=True)
