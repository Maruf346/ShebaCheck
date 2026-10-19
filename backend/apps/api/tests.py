from django.test import TestCase
import yaml
from rest_framework.test import APIClient


class ApiDocumentationTests(TestCase):
	def setUp(self):
		self.client = APIClient()

	def test_health_check(self):
		response = self.client.get("/api/health/")
		self.assertEqual(response.status_code, 200)
		self.assertEqual(response.json(), {"status": "ok", "version": "v1"})

	def test_schema_and_swagger_are_served(self):
		schema_response = self.client.get("/api/schema/")
		self.assertEqual(schema_response.status_code, 200)
		schema = yaml.safe_load(schema_response.content)
		self.assertIn("/api/v1/providers/", schema["paths"])
		self.assertIn("/api/v1/bookings/", schema["paths"])
		self.assertIn("/api/v1/auth/register/", schema["paths"])
		self.assertEqual(self.client.get("/api/docs/").status_code, 200)
