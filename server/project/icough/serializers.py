from .models import Appointment
from rest_framework import serializers


class AppointmentSerializer(serializers.ModelSerializer):

    class Meta:
        model = Appointment
        fields = ('id', 'time', 'created', 'state', 'doctor', 'patient')
