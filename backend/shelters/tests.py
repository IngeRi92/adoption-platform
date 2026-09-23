from django.test import TestCase
from rest_framework.test import APIClient

from .models import ContactFormInquiry, Dog, Shelter


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
        inquiry = ContactFormInquiry.objects.get(pk=response.data["id"])
        self.assertEqual(inquiry.dog_id, self.available_dog.id)
        self.assertEqual(inquiry.message, "I would love to meet Luna.")

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
        self.assertFalse(ContactFormInquiry.objects.exists())

    def test_shelter_list_and_detail_are_public(self):
        response = self.client.get("/api/shelters/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data[0]["id"], self.shelter.id)
        response = self.client.get(f"/api/shelters/{self.shelter.id}/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["contact_email"], self.shelter.contact_email)

    def test_public_listing_endpoints_reject_writes(self):
        for resource, record in [("dogs", self.available_dog), ("shelters", self.shelter)]:
            collection = f"/api/{resource}/"
            detail = f"{collection}{record.id}/"
            for method, url in [("post", collection), ("put", detail),
                                ("patch", detail), ("delete", detail)]:
                with self.subTest(resource=resource, method=method):
                    response = getattr(self.client, method)(
                        url, {"name": "Unauthorized change"}, format="json"
                    )
                    self.assertEqual(response.status_code, 405)
            original_name = record.name
            record.refresh_from_db()
            self.assertEqual(record.name, original_name)
        self.assertEqual(Dog.objects.count(), 2)
        self.assertEqual(Shelter.objects.count(), 1)

    def test_inquiries_cannot_be_read_changed_or_deleted(self):
        inquiry = ContactFormInquiry.objects.create(
            dog=self.available_dog,
            user_email="private@example.com",
            message="Private adoption inquiry",
        )
        for method in ["get", "head", "put", "patch", "delete"]:
            with self.subTest(method=method, endpoint="collection"):
                response = getattr(self.client, method)("/api/inquiries/")
                self.assertEqual(response.status_code, 405)
                self.assertNotIn(b"private@example.com", response.content)
        for method in ["get", "head", "post", "put", "patch", "delete"]:
            with self.subTest(method=method, endpoint="detail"):
                response = getattr(self.client, method)(f"/api/inquiries/{inquiry.id}/")
                self.assertEqual(response.status_code, 404)
                self.assertNotIn(b"private@example.com", response.content)
        inquiry.refresh_from_db()
        self.assertEqual(inquiry.message, "Private adoption inquiry")
        self.assertEqual(ContactFormInquiry.objects.count(), 1)
