# Django viewsets for the shelters app that we can access via website
from rest_framework import mixins, viewsets
from rest_framework.permissions import AllowAny
from .models import Shelter, Dog, ContactFormInquiry
from .serializers import ShelterSerializer, DogSerializer, ContactFormInquirySerializer


# ViewSet for managing Shelter objects
class ShelterViewSet(viewsets.ReadOnlyModelViewSet):
    """Public shelter information; manage records through Django admin."""

    permission_classes = [AllowAny]
    queryset = Shelter.objects.all()
    serializer_class = ShelterSerializer


# ViewSet for managing Dog objects
class DogViewSet(viewsets.ReadOnlyModelViewSet):
    """Public dog listings; manage records through Django admin."""

    permission_classes = [AllowAny]
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
class ContactFormInquiryViewSet(mixins.CreateModelMixin, viewsets.GenericViewSet):
    """Accept inquiries without exposing stored submissions through the API."""

    permission_classes = [AllowAny]
    queryset = ContactFormInquiry.objects.all()
    serializer_class = ContactFormInquirySerializer
