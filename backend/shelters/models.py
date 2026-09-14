# Place database models here
from django.db import models


class Shelter(models.Model):
    name = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    country = models.CharField(max_length=100, default="Unknown")
    contact_email = models.EmailField()
    contact_phone = models.CharField(max_length=20)
    website = models.URLField(blank=True, null=True)
    verified = models.BooleanField(default=False)

    def __str__(self):
        return self.name


class Dog(models.Model):
    name = models.CharField(max_length=255)
    age = models.IntegerField()
    breed = models.CharField(max_length=255)
    size = models.CharField(
        max_length=50,
        choices=[("small", "Small"), ("medium", "Medium"), ("large", "Large")],
    )
    sex = models.CharField(
        max_length=10, choices=[("male", "Male"), ("female", "Female")]
    )
    medical_history = models.TextField(blank=True, null=True)
    personality_traits = models.TextField(blank=True, null=True)
    adoption_status = models.CharField(
        max_length=50,
        choices=[
            ("available", "Available"),
            ("adopted", "Adopted"),
            ("pending", "Pending"),
        ],
    )
    shelter = models.ForeignKey(Shelter, on_delete=models.CASCADE)
    photos = models.ImageField(upload_to="dog_photos/", blank=True, null=True)

    def __str__(self):
        return self.name


class ContactFormInquiry(models.Model):
    dog = models.ForeignKey(Dog, on_delete=models.CASCADE)
    user_name = models.CharField(max_length=255, blank=True, null=True)
    user_email = models.EmailField()
    message = models.TextField()
    submission_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Inquiry for {self.dog.name} by {self.user_email}"
