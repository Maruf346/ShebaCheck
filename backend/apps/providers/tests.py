from datetime import date

from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework.test import APIClient

from .models import ProviderProfile, ProviderService


User = get_user_model()


class ProviderApiTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.provider_user = User.objects.create_user("pro@example.com", "StrongPass!872", role=User.Role.PROVIDER)
        self.other_provider = User.objects.create_user("other@example.com", "StrongPass!872", role=User.Role.PROVIDER)
        self.profile = ProviderProfile.objects.create(user=self.provider_user, display_name="Rafiq Electrical", category="Electrical", area="Mirpur", starting_price=650)
        self.other_profile = ProviderProfile.objects.create(user=self.other_provider, display_name="Uttara AC", category="AC Repair", area="Uttara", starting_price=900)
        self.service = ProviderService.objects.create(provider=self.profile, name="Wiring inspection", price=650)

    def test_public_search_supports_category_area_and_search(self):
        response = self.client.get("/api/v1/providers/?category=Electrical&area=Mirpur&search=Rafiq")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["count"], 1)
        self.assertEqual(response.data["results"][0]["name"], "Rafiq Electrical")
        self.assertEqual(response.data["results"][0]["services"][0]["name"], "Wiring inspection")

    def test_provider_can_manage_own_services_only(self):
        self.client.force_authenticate(self.provider_user)
        response = self.client.post("/api/v1/providers/services/", {"name": "Switchboard repair", "price": "850.00"}, format="json")
        self.assertEqual(response.status_code, 201)
        self.assertEqual(self.profile.services.count(), 2)
        forbidden = self.client.patch(f"/api/v1/providers/services/{self.service.id}/", {"price": "900.00"}, format="json")
        self.assertEqual(forbidden.status_code, 200)

        self.client.force_authenticate(self.other_provider)
        self.assertEqual(self.client.patch(f"/api/v1/providers/services/{self.service.id}/", {"price": "1.00"}, format="json").status_code, 404)

    def test_provider_can_add_unavailable_date(self):
        self.client.force_authenticate(self.provider_user)
        response = self.client.post("/api/v1/providers/availability/", {"date": date(2030, 1, 1), "reason": "Annual leave"}, format="json")
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data["date"], "2030-01-01")