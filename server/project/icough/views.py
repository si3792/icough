from .serializers import AppointmentSerializer, DoctorOrPatientSerializer
from .models import Appointment
from rest_framework.permissions import AllowAny
from rest_framework import filters
from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework import viewsets
from rest_framework import generics
from rest_framework import mixins
from rest_framework.status import HTTP_201_CREATED, HTTP_400_BAD_REQUEST, HTTP_200_OK, HTTP_403_FORBIDDEN
from django.utils import timezone
from icough.appointment_utilities import isClashing, isExpired
from django.utils.dateparse import parse_datetime
from icough import google_utilities


class AppointmentViewSet(mixins.ListModelMixin, mixins.CreateModelMixin, viewsets.GenericViewSet):
    """
    API endpoint for Appointments

    GET returns a list of UPCOMING appointments where:
    - If request comes from a patient, appointments where patient = user are returned.
    - If request comes from a doctor, appointments where doctor = user are returned.

    POST expects a a `time` field as well as `doctor` object field.
    ( Doctor objects are retrieved from /icough/doctors/ )

    PUT is used to update appointment at /icough/appointments/id/
    - If request comes from a doctor, `state` field is expected, containing either 'A' or 'D'.
    - If request comes from a patient, `time` field is expected.
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

        isDoctor = User.objects.filter(username=self.request.user.username).filter(
            groups__name__in=['doctors'])
        if isDoctor:
            return Response({'message': 'Only patients can request appointments'}, status=HTTP_403_FORBIDDEN)

        try:
            doctor = User.objects.all().filter(
                username=(request.data['doctor'].get('username', None)))[0]
        except:
            return Response({'message': 'Invalid doctor field'}, status=HTTP_400_BAD_REQUEST)

        serializer = AppointmentSerializer(data={
            'time': request.data.get('time', None)
        }, context={
            'patient': request.user,
            'doctor': doctor
        })

        serializer.is_valid(raise_exception=True)

        if isExpired(serializer.validated_data['time']):
            return Response({'message': 'Invalid appointment time'}, status=HTTP_400_BAD_REQUEST)

        if isClashing(serializer.validated_data['time'], doctor):
            return Response({'message': 'This request clashes with existing appointment'}, status=HTTP_400_BAD_REQUEST)

        serializer.save()
        return Response(status=HTTP_201_CREATED)

    def update(self, request, pk):

        isDoctor = User.objects.filter(username=self.request.user.username).filter(
            groups__name__in=['doctors'])

        try:
            appointment = Appointment.objects.all().filter(
                pk=pk)[0]
        except:
            return Response({'message': 'Invalid pk'}, status=HTTP_400_BAD_REQUEST)

        if isDoctor:
            if appointment.doctor != request.user:
                return Response(status=HTTP_403_FORBIDDEN)

            if appointment.state != 'P':
                return Response({'message': 'Only PENDING appointments can be updated'}, status=HTTP_403_FORBIDDEN)

            appointment.state = request.data.get('state', None)
            if appointment.state != 'A' and appointment.state != 'D':
                return Response({'message': 'Invalid state field'}, status=HTTP_400_BAD_REQUEST)

            appointment.save()

            # Save event for Google users
            if appointment.state == 'A':
                google_utilities.createCalendarEvent(
                    appointment, appointment.patient)
                google_utilities.createCalendarEvent(
                    appointment, appointment.doctor)

            return Response(status=HTTP_200_OK)

        else:
            if appointment.patient != request.user:
                return Response(status=HTTP_403_FORBIDDEN)

            if appointment.state != 'D':
                return Response({'message': 'Only DECLINED appointments can be rescheduled'}, status=HTTP_403_FORBIDDEN)

            newTime = request.data.get('time', None)
            if newTime is None:
                return Response({'message': 'Missing time field'}, status=HTTP_400_BAD_REQUEST)

            newTime = parse_datetime(newTime)  # convert from string

            if isExpired(newTime):
                return Response({'message': 'Invalid appointment time'}, status=HTTP_400_BAD_REQUEST)

            if isClashing(newTime, appointment.doctor):
                return Response({'message': 'This request clashes with existing appointment'},
                                status=HTTP_400_BAD_REQUEST)

            appointment.time = newTime
            appointment.state = 'P'
            appointment.save()
            return Response(status=HTTP_200_OK)


class AppointmentHistoryViewSet(mixins.ListModelMixin, viewsets.GenericViewSet):
    """
    API endpoint for Appointments history

    GET returns a list of EXPIRED appointments where:
    - If request comes from a patient, appointments where patient = user are returned.
    - If request comes from a doctor, appointments where doctor = user are returned.
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
