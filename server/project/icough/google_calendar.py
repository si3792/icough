import requests as makerequest
from django.utils import timezone
from icough.settings import APPOINTMENT_DURATION
import json


# @TODO handle expiration of access_token
# @TODO add better error handling
# @TODO customize appointments -> Patients should get dr name in description, etc

def createCalendarEvent(appointment, user):

    # Check if user has social account with Google
    try:
        social = user.social_auth.get(provider='google-oauth2')
    except:
        return

    access_token = social.extra_data.get('access_token', None)
    if access_token is None:
        return

    url = "https://www.googleapis.com/calendar/v3/calendars/primary/events/"
    headers = {"Authorization": "Bearer " + access_token,
               "Content-Type": "application/json"}
    data = {
        "summary": "Appointment",
        "start": {
            "dateTime": appointment.time.isoformat()
        },
        "end": {
            "dateTime": (appointment.time + timezone.timedelta(minutes=(APPOINTMENT_DURATION))).isoformat()
        }
    }

    request = makerequest.post(url, data=json.dumps(data), headers=headers)
