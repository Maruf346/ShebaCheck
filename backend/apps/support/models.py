from django.conf import settings
from django.db import models

from apps.bookings.models import Booking


class Dispute(models.Model):
    class Status(models.TextChoices):
        OPEN = "open", "Open"
        IN_REVIEW = "in_review", "In review"
        RESOLVED = "resolved", "Resolved"
        REJECTED = "rejected", "Rejected"

    booking = models.ForeignKey(Booking, on_delete=models.PROTECT, related_name="disputes")
    customer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name="disputes")
    provider = models.ForeignKey("providers.ProviderProfile", on_delete=models.PROTECT, related_name="disputes")
    description = models.TextField(max_length=4000)
    booking_previous_status = models.CharField(max_length=24, choices=Booking.Status.choices)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.OPEN, db_index=True)
    resolution_note = models.TextField(blank=True, max_length=4000)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ("-created_at",)

    def __str__(self) -> str:
        return f"Dispute for booking {self.booking_id} ({self.status})"
