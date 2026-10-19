from datetime import timedelta

from django.contrib.auth import get_user_model
from django.test import TestCase
from django.utils import timezone
from rest_framework.test import APIClient

from apps.bookings.models import Booking
from apps.providers.models import ProviderProfile
from .models import Dispute


User = get_user_model()


class DisputeApiTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.customer = User.objects.create_user("customer@example.com", "StrongPass!872", role=User.Role.CUSTOMER)
        self.admin = User.objects.create_superuser("admin@example.com", "StrongPass!872")
        provider_user = User.objects.create_user("provider@example.com", "StrongPass!872", role=User.Role.PROVIDER)
        self.provider = ProviderProfile.objects.create(user=provider_user, display_name="Service Pro")
        self.booking = Booking.objects.create(
            customer=self.customer,
            provider=self.provider,
            service_name="Repair",
            description="Detailed repair request",
            address="House 1",
            area="Mirpur",
            appointment_at=timezone.now() - timedelta(hours=1),
            phone="01712345678",
            price_estimate="500.00",
            status=Booking.Status.COMPLETED,
        )

    def test_customer_opens_dispute_and_admin_resolves(self):
        self.client.force_authenticate(self.customer)
        response = self.client.post("/api/v1/support/disputes/", {"booking_id": self.booking.id, "description": "The repair needs a follow-up visit."}, format="json")
        self.assertEqual(response.status_code, 201, response.data)
        dispute = Dispute.objects.get(pk=response.data["id"])
        self.booking.refresh_from_db()
        self.assertEqual(self.booking.status, Booking.Status.DISPUTE_OPEN)
        self.client.force_authenticate(self.admin)
        resolution = self.client.patch(f"/api/v1/support/disputes/{dispute.id}/resolve/", {"status": "resolved", "resolution_note": "Reviewed in demo."}, format="json")
        self.assertEqual(resolution.status_code, 200, resolution.data)
        self.booking.refresh_from_db()
        self.assertEqual(self.booking.status, Booking.Status.COMPLETED)

    def test_customer_cannot_open_dispute_for_someone_elses_booking(self):
        other = User.objects.create_user("other@example.com", "StrongPass!872", role=User.Role.CUSTOMER)
        self.client.force_authenticate(other)
        response = self.client.post("/api/v1/support/disputes/", {"booking_id": self.booking.id, "description": "Not my booking dispute."}, format="json")
        self.assertEqual(response.status_code, 400)