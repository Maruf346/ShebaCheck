from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework.test import APIClient


User = get_user_model()


class AuthenticationApiTests(TestCase):
	def setUp(self):
		self.client = APIClient()

	def test_customer_registration_and_jwt_login(self):
		response = self.client.post(
			"/api/v1/auth/register/",
			{
				"email": "customer@example.com",
				"password": "StrongPass!872",
				"first_name": "Amina",
				"last_name": "Rahman",
				"phone": "01712345678",
				"role": "customer",
			},
			format="json",
		)
		self.assertEqual(response.status_code, 201)
		self.assertEqual(response.data["role"], "customer")
		self.assertNotIn("password", response.data)

		token_response = self.client.post(
			"/api/v1/auth/token/",
			{"email": "customer@example.com", "password": "StrongPass!872"},
			format="json",
		)
		self.assertEqual(token_response.status_code, 200)
		self.assertIn("access", token_response.data)
		self.assertIn("refresh", token_response.data)

	def test_public_registration_cannot_create_admin(self):
		response = self.client.post(
			"/api/v1/auth/register/",
			{"email": "root@example.com", "password": "StrongPass!872", "role": "admin"},
			format="json",
		)
		self.assertEqual(response.status_code, 400)
		self.assertFalse(User.objects.filter(email="root@example.com").exists())

	def test_provider_registration_creates_profile(self):
		response = self.client.post(
			"/api/v1/auth/register/",
			{"email": "provider@example.com", "password": "StrongPass!872", "first_name": "Rafiq", "role": "provider"},
			format="json",
		)
		self.assertEqual(response.status_code, 201)
		self.assertEqual(response.data["role"], "provider")
		user = User.objects.get(email="provider@example.com")
		self.assertEqual(user.provider_profile.display_name, "Rafiq")

	def test_current_user_requires_auth_and_updates_only_profile_fields(self):
		user = User.objects.create_user("customer@example.com", "StrongPass!872", role=User.Role.CUSTOMER)
		self.assertEqual(self.client.get("/api/v1/auth/me/").status_code, 401)
		self.client.force_authenticate(user)
		response = self.client.patch("/api/v1/auth/me/", {"first_name": "Amina", "role": "admin"}, format="json")
		self.assertEqual(response.status_code, 200)
		user.refresh_from_db()
		self.assertEqual(user.first_name, "Amina")
		self.assertEqual(user.role, User.Role.CUSTOMER)
