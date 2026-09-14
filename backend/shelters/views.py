# Django viewsets for the shelters app that we can access via website
from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.response import Response
from .models import Shelter, Dog, ContactFormInquiry
from .serializers import ShelterSerializer, DogSerializer, ContactFormInquirySerializer


# ViewSet for managing Shelter objects
class ShelterViewSet(viewsets.ModelViewSet):
    queryset = Shelter.objects.all()
    serializer_class = ShelterSerializer


# ViewSet for managing Dog objects
class DogViewSet(viewsets.ModelViewSet):
    queryset = Dog.objects.all()
    serializer_class = DogSerializer

    def get_queryset(self):
        queryset = Dog.objects.select_related("shelter")

        country = self.request.query_params.get("country")
        sex = self.request.query_params.get("sex")
        size = self.request.query_params.get("size")
        breed = self.request.query_params.get("breed")
        adoption_status = self.request.query_params.get("adoption_status")

        if country:
            queryset = queryset.filter(shelter__country__icontains=country)
        if sex and sex.lower() != "all":
            queryset = queryset.filter(sex=sex)
        if size:
            queryset = queryset.filter(size=size)
        if breed:
            queryset = queryset.filter(breed__icontains=breed)
        if adoption_status:
            queryset = queryset.filter(adoption_status=adoption_status)

        return queryset.order_by("id")


# ViewSet for managing ContactFormInquiry objects
class ContactFormInquiryViewSet(viewsets.ModelViewSet):
    queryset = ContactFormInquiry.objects.all()
    serializer_class = ContactFormInquirySerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=201, headers=headers)
