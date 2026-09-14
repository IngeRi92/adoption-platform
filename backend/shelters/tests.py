from django.test import TestCase
from rest_framework.test import APIClient

from .models import Dog, Shelter


class DogApiTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.shelter = Shelter.objects.create(
            name="Päikesepesa",
            location="Tallinn",
            country="Estonia",
            contact_email="info@paikesepesa.ee",
            contact_phone="+3725550001",
            website="https://paikesepesa.ee",
            verified=True,
        )

        self.available_dog = Dog.objects.create(
            name="Luna",
            age=2,
            breed="Labrador",
            size="medium",
            sex="female",
            medical_history="Vaccinated and healthy",
            personality_traits="Friendly and playful",
            adoption_status="available",
            shelter=self.shelter,
        )

        self.pending_dog = Dog.objects.create(
            name="Max",
            age=5,
            breed="German Shepherd",
            size="large",
            sex="male",
            medical_history="Needs daily walks",
            personality_traits="Calm and loyal",
            adoption_status="pending",
            shelter=self.shelter,
        )

    def test_dogs_can_be_filtered_by_country_sex_and_size(self):
        response = self.client.get(
            "/api/dogs/",
            {"country": "Estonia", "sex": "female", "size": "medium"},
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["name"], "Luna")

    def test_dog_detail_endpoint_returns_shelter_data(self):
        response = self.client.get(f"/api/dogs/{self.available_dog.id}/")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["name"], "Luna")
        self.assertEqual(response.data["shelter"]["name"], "Päikesepesa")

    def test_inquiries_can_be_posted(self):
        response = self.client.post(
            "/api/inquiries/",
            {
                "dog": self.available_dog.id,
                "user_name": "Maria",
                "user_email": "maria@example.com",
                "message": "I would love to meet Luna.",
            },
            format="json",
        )

        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data["user_email"], "maria@example.com")

    def test_inquiry_requires_valid_email_and_message(self):
        response = self.client.post(
            "/api/inquiries/",
            {
                "dog": self.available_dog.id,
                "user_name": "Maria",
                "user_email": "not-an-email",
                "message": "",
            },
            format="json",
        )

        self.assertEqual(response.status_code, 400)
        self.assertIn("user_email", response.data)
        self.assertIn("message", response.data)
