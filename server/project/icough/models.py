from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from django.conf import settings


class Appointment(models.Model):
    APPOINTMENT_STATES = (
        ('A', 'Approved'),
        ('D', 'Declined'),
        ('P', 'Pending'),
    )
    time = models.DateTimeField()
    created = models.DateTimeField(auto_now_add=True)
    state = models.CharField(max_length=1, choices=APPOINTMENT_STATES, default='P')
    patient = models.ForeignKey(
        settings.AUTH_USER_MODEL, default=1, related_name='appointment_patient')
    doctor = models.ForeignKey(
        settings.AUTH_USER_MODEL, default=1, related_name='appointment_doctor')

    def __str__(self):
        return "Appointment " + str(self.id)
