from .serializers import AppointmentSerializer, DoctorOrPatientSerializer
from .models import Appointment
from rest_framework.permissions import AllowAny
from rest_framework import viewsets
from rest_framework import filters
from rest_framework.views import APIView
from django.contrib.auth.models import User
from rest_framework.response import Response


class AppointmentViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows Appointments to be viewed or edited.
    """
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
    filter_fields = ('state', 'doctor')
    search_fields = ('doctor', 'patient')
    ordering_fields = ('created', 'time', 'patient', 'doctor')
    filter_backends = (filters.OrderingFilter,
                       filters.DjangoFilterBackend, filters.SearchFilter,)

    # def get_queryset(self):
    #    pass  # Filter queryset according to user


class DoctorsListView(APIView):
    """
    API endpoint for fetching a list of doctors

    GET returns an array of doctors
    """
    permission_classes = (AllowAny,)

    def get(self, request):

        queryset = User.objects.filter(groups__name__in=['doctors'])
        serializer = DoctorOrPatientSerializer(queryset, many=True)

        return Response(serializer.data)
