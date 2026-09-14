from rest_framework import serializers
from .models import Shelter, Dog, ContactFormInquiry


class ShelterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Shelter
        fields = "__all__"


class DogSerializer(serializers.ModelSerializer):
    shelter = ShelterSerializer(read_only=True)

    class Meta:
        model = Dog
        fields = "__all__"


class ContactFormInquirySerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactFormInquiry
        fields = "__all__"

    def validate_user_email(self, value):
        if not value or "@" not in value:
            raise serializers.ValidationError("Please provide a valid email address.")
        return value

    def validate_message(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError("Message is required.")
        return value.strip()
