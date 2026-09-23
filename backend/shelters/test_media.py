import importlib.util
from io import BytesIO
from pathlib import Path
from tempfile import TemporaryDirectory
from urllib.parse import urlsplit

from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase
from PIL import Image
from rest_framework.test import APIClient

from .models import Dog, Shelter


class DogMediaTests(TestCase):
    def setUp(self):
        media = TemporaryDirectory()
        self.addCleanup(media.cleanup)
        self.media_root = Path(media.name)
        shelter = Shelter.objects.create(
            name="Demo", location="Tallinn", country="Estonia",
            contact_email="shelter@example.com", contact_phone="123",
        )
        self.dog = Dog.objects.create(
            name="Luna", age=2, breed="Mixed", size="medium",
            sex="female", adoption_status="available", shelter=shelter,
        )
        self.api = APIClient()

    def configure_urls(self, debug):
        self.enterContext(self.settings(DEBUG=debug, MEDIA_ROOT=self.media_root))
        # Load the real URL configuration freshly under each DEBUG setting,
        # without mutating the module used by other tests.
        spec = importlib.util.spec_from_file_location(
            "media_test_urls", settings.BASE_DIR / "adoption_backend" / "urls.py"
        )
        urls = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(urls)
        self.enterContext(self.settings(ROOT_URLCONF=urls))

    def test_admin_upload_is_returned_and_served_through_api_url(self):
        self.configure_urls(debug=True)
        admin = get_user_model().objects.create_superuser(
            username="media-admin", email="admin@example.com", password="test-password"
        )
        self.client.force_login(admin)
        picture = BytesIO()
        Image.new("RGB", (2, 2), color="blue").save(picture, format="PNG")
        image_bytes = picture.getvalue()
        response = self.client.post(
            f"/admin/shelters/dog/{self.dog.id}/change/",
            {
                "name": "Luna", "age": 2, "breed": "Mixed", "size": "medium",
                "sex": "female", "adoption_status": "available",
                "shelter": self.dog.shelter_id, "_save": "Save",
                "photos": SimpleUploadedFile("luna.png", image_bytes, "image/png"),
            },
        )
        self.assertEqual(response.status_code, 302)
        self.dog.refresh_from_db()
        self.assertTrue(self.dog.photos.name.startswith("dog_photos/"))
        self.assertEqual((self.media_root / self.dog.photos.name).read_bytes(), image_bytes)

        detail = self.api.get(f"/api/dogs/{self.dog.id}/")
        self.assertEqual(detail.status_code, 200)
        url = detail.data["photos"]
        self.assertEqual(url, f"http://testserver/media/{self.dog.photos.name}")
        listing = self.api.get("/api/dogs/")
        self.assertEqual(listing.data[0]["photos"], url)
        image = self.api.get(urlsplit(url).path)
        try:
            self.assertEqual(image.status_code, 200)
            self.assertEqual(image["Content-Type"], "image/png")
            self.assertEqual(b"".join(image.streaming_content), image_bytes)
        finally:
            image.close()

    def test_missing_photo_is_null_and_missing_file_returns_404(self):
        self.configure_urls(debug=True)
        response = self.api.get(f"/api/dogs/{self.dog.id}/")
        self.assertIsNone(response.data["photos"])
        self.assertEqual(self.api.get("/media/dog_photos/missing.png").status_code, 404)

    def test_media_is_not_served_when_debug_is_disabled(self):
        self.configure_urls(debug=False)
        (self.media_root / "example.txt").write_text("not for development serving")
        self.assertEqual(self.api.get("/media/example.txt").status_code, 404)
