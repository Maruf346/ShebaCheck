from django.conf import settings
from django.core.validators import MinValueValidator
from django.db import models

from apps.providers.models import ProviderProfile, ProviderService


class Booking(models.Model):
    class Status(models.TextChoices):
        REQUESTED = "requested", "Requested"
        CONFIRMED = "confirmed", "Confirmed"
        RESCHEDULE_REQUESTED = "reschedule_requested", "Reschedule requested"
        COMPLETED = "completed", "Completed"
        CANCELLED = "cancelled", "Cancelled"
        DECLINED = "declined", "Declined"
        DISPUTE_OPEN = "dispute_open", "Dispute open"

    customer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name="customer_bookings")
    provider = models.ForeignKey(ProviderProfile, on_delete=models.PROTECT, related_name="provider_bookings")
    service = models.ForeignKey(ProviderService, on_delete=models.PROTECT, related_name="bookings", null=True, blank=True)
    service_name = models.CharField(max_length=160)
    description = models.TextField()
    address = models.CharField(max_length=240)
    area = models.CharField(max_length=120, db_index=True)
    appointment_at = models.DateTimeField(db_index=True)
    phone = models.CharField(max_length=20)
    access_instructions = models.CharField(max_length=500, blank=True)
    price_estimate = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    status = models.CharField(max_length=24, choices=Status.choices, default=Status.REQUESTED, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ("-created_at",)
        indexes = [models.Index(fields=("customer", "status")), models.Index(fields=("provider", "status"))]

    def __str__(self) -> str:
        return f"{self.service_name} · {self.customer} · {self.status}"
