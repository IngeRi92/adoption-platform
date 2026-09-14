from django.core.management.base import BaseCommand

from shelters.models import Dog, Shelter


class Command(BaseCommand):
    help = "Seed the database with demo shelter and dog data for frontend integration"

    def handle(self, *args, **options):
        shelter_a, _ = Shelter.objects.get_or_create(
            name="Päikesepesa Shelter",
            defaults={
                "location": "Tallinn",
                "country": "Estonia",
                "contact_email": "info@paikesepesa.ee",
                "contact_phone": "+3725550001",
                "website": "https://paikesepesa.ee",
                "verified": True,
            },
        )

        shelter_b, _ = Shelter.objects.get_or_create(
            name="Nordic Rescue",
            defaults={
                "location": "Stockholm",
                "country": "Sweden",
                "contact_email": "hello@nordicrescue.se",
                "contact_phone": "+46700000001",
                "website": "https://nordicrescue.se",
                "verified": True,
            },
        )

        dogs = [
            {
                "name": "Luna",
                "age": 2,
                "breed": "Labrador",
                "size": "medium",
                "sex": "female",
                "medical_history": "Vaccinated and healthy.",
                "personality_traits": "Friendly, playful, and gentle with children.",
                "adoption_status": "available",
                "shelter": shelter_a,
            },
            {
                "name": "Max",
                "age": 5,
                "breed": "German Shepherd",
                "size": "large",
                "sex": "male",
                "medical_history": "Needs moderate exercise and routine checkups.",
                "personality_traits": "Calm, loyal, and protective.",
                "adoption_status": "pending",
                "shelter": shelter_a,
            },
            {
                "name": "Mila",
                "age": 1,
                "breed": "Cocker Spaniel",
                "size": "small",
                "sex": "female",
                "medical_history": "Recently spayed and vaccinated.",
                "personality_traits": "Warm, affectionate, and highly social.",
                "adoption_status": "available",
                "shelter": shelter_b,
            },
        ]

        for dog in dogs:
            Dog.objects.get_or_create(
                name=dog["name"],
                defaults={
                    "age": dog["age"],
                    "breed": dog["breed"],
                    "size": dog["size"],
                    "sex": dog["sex"],
                    "medical_history": dog["medical_history"],
                    "personality_traits": dog["personality_traits"],
                    "adoption_status": dog["adoption_status"],
                    "shelter": dog["shelter"],
                },
            )

        self.stdout.write(
            self.style.SUCCESS("Demo shelters and dogs created successfully.")
        )
