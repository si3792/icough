from .models import Appointment
from rest_framework import serializers
from django.contrib.auth.models import User


class DoctorOrPatientSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ('id', 'first_name', 'last_name', 'username')
        read_only_fields = ('id', 'first_name', 'last_name', 'username')


class AppointmentSerializer(serializers.ModelSerializer):

    doctor = DoctorOrPatientSerializer(required=False)
    patient = DoctorOrPatientSerializer(required=False)

    class Meta:
        model = Appointment
        fields = ('id', 'time', 'created', 'state', 'doctor', 'patient')

    def create(self, validated_data):

        appointment = Appointment.objects.create(
            time=validated_data['time'],
            patient=self.context['patient'],
            doctor=self.context['doctor']
        )
        return appointment
