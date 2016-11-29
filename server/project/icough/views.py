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


class AppointmentViewSet(mixins.ListModelMixin, mixins.CreateModelMixin, viewsets.GenericViewSet):
    """
    API endpoint that allows Appointments to be viewed, created or updated.

    GET returns a list of upcoming appointments where
    (a) patient = current user, if user is a patient
    (b) doctor = current user, if user is a doctor

    POST expects a doctor object field, as well as time

    PUT expects a state field
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
        serializer.save()
        return Response(status=HTTP_201_CREATED)

    def update(self, request, pk):

        appointment = Appointment.objects.all().filter(pk=pk)[0]
        appointment.state = request.data['state']
        appointment.save()
        return Response(status=HTTP_200_OK)


class AppointmentHistoryViewSet(mixins.ListModelMixin, viewsets.GenericViewSet):
    """
    API endpoint for fetching a list of appointment history

    GET returns an array of (old) appointments where
    (a) patient = current user, if user is a patient
    (b) doctor = current user, if user is a doctor
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
    API endpoint for fetching a list of doctors

    GET returns an array of doctors
    """

    queryset = User.objects.filter(groups__name__in=['doctors'])
    serializer_class = DoctorOrPatientSerializer
    pagination_class = None
