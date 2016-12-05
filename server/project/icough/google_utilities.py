import requests as makerequest
from django.utils import timezone
from icough.settings import APPOINTMENT_DURATION
from usersystem.secrets import SOCIAL_AUTH_GOOGLE_OAUTH2_KEY, SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET
from django.contrib.auth.models import User
import json


def createCalendarEvent(appointment, user):

    # Check if user has social account with Google
    try:
        social = user.social_auth.get(provider='google-oauth2')
    except:
        return False

    access_token = social.extra_data.get('access_token', None)
    if access_token is None:
        return False

    description = 'Patient: ' + appointment.patient.first_name + ' ' + appointment.patient.last_name + '\n'
    description += 'Doctor: ' + appointment.doctor.first_name + ' ' + appointment.doctor.last_name + '\n'

    url = "https://www.googleapis.com/calendar/v3/calendars/primary/events/"
    data = {
        "summary": "Medical Appointment",
        "description": description,
        "start": {
            "dateTime": appointment.time.isoformat()
        },
        "end": {
            "dateTime": (appointment.time + timezone.timedelta(minutes=(APPOINTMENT_DURATION))).isoformat()
        }
    }

    request = makerequest.post(url, data=json.dumps(data), headers={
        "Authorization": "Bearer " + access_token,
        "Content-Type": "application/json"
    })

    if request.status_code == 200:
        return True

    # If access_token has expired, refresh it and retry
    if request.status_code == 401:
        if refreshToken(social):
            request = makerequest.post(url, data=json.dumps(data), headers={
                "Authorization": "Bearer " + social.extra_data.get('access_token'),
                "Content-Type": "application/json"
            })

            if request.status_code == 200:
                return True

    return False


def refreshToken(social):

    refreshToken = social.extra_data.get('refresh_token', None)
    if refreshToken is None:
        return False

    url = 'https://www.googleapis.com/oauth2/v4/token'
    request = makerequest.post(url, data={
        'client_id': SOCIAL_AUTH_GOOGLE_OAUTH2_KEY,
        'client_secret': SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET,
        'refresh_token': refreshToken,
        'grant_type': 'refresh_token'
    }, headers={'Content-Type': 'application/x-www-form-urlencoded'})

    if request.status_code == makerequest.codes.ok:
        access_token = request.json().get('access_token', None)
        social.extra_data['access_token'] = access_token
        social.save()
        return True
    return False
