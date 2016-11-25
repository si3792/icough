from .models import Appointment
from rest_framework import serializers
from django.contrib.auth.models import User


class DoctorOrPatientSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ('id', 'first_name', 'last_name')


class AppointmentSerializer(serializers.ModelSerializer):

    doctor = DoctorOrPatientSerializer()
    patient = DoctorOrPatientSerializer()

    class Meta:
        model = Appointment
        fields = ('id', 'time', 'created', 'state', 'doctor', 'patient')
