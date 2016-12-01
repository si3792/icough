# A collection of helper functions for the Appointment model
from icough.models import Appointment
from icough.settings import APPOINTMENT_DURATION, APPOINTMENT_DURATION_DELTA
from django.utils import timezone
import datetime


def isClashing(time, doctor):
    appointments = Appointment.objects.all().filter(doctor=doctor)
    appointments = appointments.filter(state='A')
    appointments = appointments.filter(time__gte=(
        time - datetime.timedelta(minutes=(APPOINTMENT_DURATION - APPOINTMENT_DURATION_DELTA))))
    appointments = appointments.filter(time__lte=(
        time + datetime.timedelta(minutes=(APPOINTMENT_DURATION - APPOINTMENT_DURATION_DELTA))))
    if appointments:
        return True
    return False


def isExpired(appointment):
    if appointment.time > timezone.now():
        return False
    return True
