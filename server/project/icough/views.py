from .serializers import AppointmentSerializer, DoctorOrPatientSerializer
from .models import Appointment
from rest_framework.permissions import AllowAny
from rest_framework import filters
from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework import viewsets
from rest_framework import generics
from rest_framework import mixins
from rest_framework.status import HTTP_201_CREATED, HTTP_400_BAD_REQUEST, HTTP_200_OK
from django.utils import timezone
from icough.appointment_utilities import isClashing, isExpired


class AppointmentViewSet(mixins.ListModelMixin, mixins.CreateModelMixin, viewsets.GenericViewSet):
    """
    API endpoint for Appointments

    GET returns a list of UPCOMING appointments where:
    a) If request comes from a patient, appointments where patient = user are returned.
    b) If request comes from a doctor, appointments where doctor = user are returned.

    POST expects a a `time` field as well as `doctor` object field.
    Doctor objects are retrieved from /icough/doctors/.

    PUT is used to update appointment at /icough/appointments/id/
    If the request comes from a doctor `state` field is expected, containing either 'A' or 'D'.
    If the request comes from a patient, `time` field is expected.
    """
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
    filter_fields = ('state', 'doctor')
    search_fields = ('doctor__first_name', 'doctor__last_name',
                     'patient__first_name', 'patient__last_name')
    ordering_fields = ('created', 'time', 'patient', 'doctor', 'state')
    filter_backends = (filters.OrderingFilter,
                       filters.DjangoFilterBackend, filters.SearchFilter,)

    def get_queryset(self):
        isDoctor = User.objects.filter(username=self.request.user.username).filter(
            groups__name__in=['doctors'])

        appointments = Appointment.objects.filter(
            time__gte=timezone.now())
        if isDoctor:
            return appointments.filter(doctor=self.request.user)
        return appointments.filter(patient=self.request.user)

    def create(self, request):
        doctor = User.objects.all().filter(
            username=(request.data['doctor'].get('username')))
        if not doctor:
            return Response({'message': 'Could not retrieve doctor'}, status=HTTP_400_BAD_REQUEST)
        doctor = doctor[0]

        serializer = AppointmentSerializer(data={
            'time': request.data['time']
        }, context={
            'patient': request.user,
            'doctor': doctor
        })

        serializer.is_valid(raise_exception=True)

        if isClashing(serializer.validated_data['time'], doctor):
            return Response({'message': 'This appointment request clashes with another.'}, status=HTTP_400_BAD_REQUEST)

        serializer.save()
        return Response(status=HTTP_201_CREATED)

    def update(self, request, pk):
        # @TODO add permission checking for doctor and patient
        appointment = Appointment.objects.all().filter(pk=pk)[0]

        if appointment.state == 'P':
            appointment.state = request.data['state']
            appointment.save()
            return Response(status=HTTP_200_OK)
        elif appointment.state == 'D':
            appointment.time = request.data['time']
            appointment.state = 'P'
            appointment.save()
            return Response(status=HTTP_200_OK)
        return Response(status=HTTP_400_BAD_REQUEST)


class AppointmentHistoryViewSet(mixins.ListModelMixin, viewsets.GenericViewSet):
    """
    API endpoint for Appointments history

    GET returns a list of EXPIRED appointments where:
    a) If request comes from a patient, appointments where patient = user are returned.
    b) If request comes from a doctor, appointments where doctor = user are returned.
    """

    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
    filter_fields = ('state', 'doctor')
    search_fields = ('doctor__first_name', 'doctor__last_name',
                     'patient__first_name', 'patient__last_name')
    ordering_fields = ('created', 'time', 'patient', 'doctor', 'state')
    filter_backends = (filters.OrderingFilter,
                       filters.DjangoFilterBackend, filters.SearchFilter,)

    def get_queryset(self):
        isDoctor = User.objects.filter(username=self.request.user.username).filter(
            groups__name__in=['doctors'])

        appointments = Appointment.objects.filter(
            time__lt=timezone.now())
        if isDoctor:
            return appointments.filter(doctor=self.request.user)
        return appointments.filter(patient=self.request.user)


class DoctorsListView(generics.ListAPIView):
    """
    API endpoint for fetching a list of doctors.

    GET returns an array of doctors.
    """

    queryset = User.objects.filter(groups__name__in=['doctors'])
    serializer_class = DoctorOrPatientSerializer
    pagination_class = None
