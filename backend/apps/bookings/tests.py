from datetime import timedelta

from django.contrib.auth import get_user_model
from django.test import TestCase
from django.utils import timezone
from rest_framework.test import APIClient

from apps.providers.models import ProviderProfile, ProviderService
from .models import Booking


User = get_user_model()


class BookingApiTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.customer = User.objects.create_user("customer@example.com", "StrongPass!872", role=User.Role.CUSTOMER)
        self.provider_user = User.objects.create_user("provider@example.com", "StrongPass!872", role=User.Role.PROVIDER)
        self.other_customer = User.objects.create_user("other@example.com", "StrongPass!872", role=User.Role.CUSTOMER)
        self.provider = ProviderProfile.objects.create(user=self.provider_user, display_name="Rafiq Electrician", area="Mirpur")
        self.service = ProviderService.objects.create(provider=self.provider, name="Inspection", price="650.00")

    def payload(self):
        return {
            "provider_id": self.provider.id,
            "service_id": self.service.id,
            "service_name": "Ignored client value",
            "description": "A detailed electrical inspection is needed.",
            "address": "House 12, Road 4",
            "area": "Mirpur",
            "appointment_at": (timezone.now() + timedelta(days=2)).isoformat(),
            "phone": "01712345678",
            "access_instructions": "Call on arrival",
            "price_estimate": "1.00",
        }

    def test_customer_creates_booking_using_server_service_price(self):
        self.client.force_authenticate(self.customer)
        response = self.client.post("/api/v1/bookings/", self.payload(), format="json")
        self.assertEqual(response.status_code, 201, response.data)
        self.assertEqual(response.data["service_name"], "Inspection")
        self.assertEqual(str(response.data["price_estimate"]), "650.00")
        self.assertEqual(response.data["status"], Booking.Status.REQUESTED)

    def test_only_booking_owner_can_read_and_customer_cannot_accept(self):
        booking = Booking.objects.create(
            customer=self.customer,
            provider=self.provider,
            service=self.service,
            service_name=self.service.name,
            description="A detailed electrical inspection is needed.",
            address="House 12, Road 4",
            area="Mirpur",
            appointment_at=timezone.now() + timedelta(days=2),
            phone="01712345678",
            price_estimate=self.service.price,
        )
        self.client.force_authenticate(self.other_customer)
        self.assertEqual(self.client.get(f"/api/v1/bookings/{booking.id}/").status_code, 404)
        self.client.force_authenticate(self.customer)
        response = self.client.patch(f"/api/v1/bookings/{booking.id}/status/", {"status": "confirmed"}, format="json")
        self.assertEqual(response.status_code, 403)

    def test_assigned_provider_can_accept_and_complete(self):
        booking = Booking.objects.create(
            customer=self.customer,
            provider=self.provider,
            service=self.service,
            service_name=self.service.name,
            description="A detailed electrical inspection is needed.",
            address="House 12, Road 4",
            area="Mirpur",
            appointment_at=timezone.now() + timedelta(days=2),
            phone="01712345678",
            price_estimate=self.service.price,
        )
        self.client.force_authenticate(self.provider_user)
        self.assertEqual(self.client.patch(f"/api/v1/bookings/{booking.id}/status/", {"status": "confirmed"}, format="json").status_code, 200)
        self.assertEqual(self.client.patch(f"/api/v1/bookings/{booking.id}/status/", {"status": "completed"}, format="json").status_code, 200)