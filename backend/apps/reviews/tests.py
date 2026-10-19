from datetime import timedelta

from django.contrib.auth import get_user_model
from django.test import TestCase
from django.utils import timezone
from rest_framework.test import APIClient

from apps.bookings.models import Booking
from apps.providers.models import ProviderProfile
from .models import Review


User = get_user_model()


class ReviewApiTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.customer = User.objects.create_user("customer@example.com", "StrongPass!872", role=User.Role.CUSTOMER)
        self.provider_user = User.objects.create_user("provider@example.com", "StrongPass!872", role=User.Role.PROVIDER)
        self.provider = ProviderProfile.objects.create(user=self.provider_user, display_name="Service Pro")
        self.booking = Booking.objects.create(
            customer=self.customer,
            provider=self.provider,
            service_name="Repair",
            description="Detailed repair request",
            address="House 1",
            area="Mirpur",
            appointment_at=timezone.now() + timedelta(days=1),
            phone="01712345678",
            price_estimate="500.00",
            status=Booking.Status.COMPLETED,
        )

    def test_customer_can_review_only_completed_owned_booking_once(self):
        self.client.force_authenticate(self.customer)
        response = self.client.post("/api/v1/reviews/", {"booking": self.booking.id, "rating": 5, "body": "Excellent work and clear communication."}, format="json")
        self.assertEqual(response.status_code, 201, response.data)
        duplicate = self.client.post("/api/v1/reviews/", {"booking": self.booking.id, "rating": 5, "body": "A duplicate review."}, format="json")
        self.assertEqual(duplicate.status_code, 400)
        self.assertEqual(Review.objects.count(), 1)

    def test_provider_can_reply_to_review(self):
        review = Review.objects.create(booking=self.booking, customer=self.customer, provider=self.provider, rating=5, body="Excellent work.")
        self.client.force_authenticate(self.provider_user)
        response = self.client.patch(f"/api/v1/reviews/{review.id}/reply/", {"provider_reply": "Thank you for the feedback."}, format="json")
        self.assertEqual(response.status_code, 200, response.data)
        self.assertEqual(response.data["provider_reply"], "Thank you for the feedback.")