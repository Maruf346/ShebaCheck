from django.conf import settings
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models

from apps.bookings.models import Booking
from apps.providers.models import ProviderProfile


class Review(models.Model):
    booking = models.OneToOneField(Booking, on_delete=models.PROTECT, related_name="review")
    customer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name="reviews_written")
    provider = models.ForeignKey(ProviderProfile, on_delete=models.PROTECT, related_name="provider_reviews")
    rating = models.PositiveSmallIntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    body = models.TextField(max_length=2000)
    provider_reply = models.TextField(blank=True, max_length=2000)
    is_published = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ("-created_at",)

    def __str__(self) -> str:
        return f"{self.rating}/5 review for {self.provider}"
