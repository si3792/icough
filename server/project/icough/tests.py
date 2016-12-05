from rest_framework.test import APITestCase, APIRequestFactory, APIClient, force_authenticate
from django.contrib.auth.models import User, Group
from icough.models import Appointment
from django.utils import timezone
from icough.serializers import DoctorOrPatientSerializer
import datetime


class DoctorsListViewTest(APITestCase):

    def setUp(self):
        self.user = User.objects.create(username='testuser',
                                        email='testuser@foo.bar',
                                        first_name='Test',
                                        last_name='User')
        self.doctor1 = User.objects.create(username='doctor1',
                                           email='doctor1@foo.bar',
                                           first_name='Doctor',
                                           last_name='One')
        self.doctor2 = User.objects.create(username='doctor2',
                                           email='doctor2@foo.bar',
                                           first_name='Doctor',
                                           last_name='Two')
        self.doctor3 = User.objects.create(username='doctor3',
                                           email='doctor3@foo.bar',
                                           first_name='Doctor',
                                           last_name='Three')
        doctors = Group.objects.create(name='doctors')
        self.doctor1.groups.add(doctors)
        self.doctor2.groups.add(doctors)
        self.doctor3.groups.add(doctors)

    def test_unauthenticated_get(self):
        client = APIClient()
        response = client.get('/icough/doctors/')
        self.assertEqual(response.status_code, 401)

    def test_authenticated_get(self):
        client = APIClient()
        client.force_authenticate(user=self.user)
        response = client.get('/icough/doctors/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 3)


class AppointmentHistoryViewSetTest(APITestCase):

    def setUp(self):
        self.user = User.objects.create(username='testuser',
                                        email='testuser@foo.bar',
                                        first_name='Test',
                                        last_name='User')
        self.doctor1 = User.objects.create(username='doctor1',
                                           email='doctor1@foo.bar',
                                           first_name='Doctor',
                                           last_name='One')
        self.doctor2 = User.objects.create(username='doctor2',
                                           email='doctor2@foo.bar',
                                           first_name='Doctor',
                                           last_name='Two')
        self.doctor3 = User.objects.create(username='doctor3',
                                           email='doctor3@foo.bar',
                                           first_name='Doctor',
                                           last_name='Three')

        self.patient1 = User.objects.create(username='patient1',
                                            email='patient1@foo.bar',
                                            first_name='Patient',
                                            last_name='One')
        self.patient2 = User.objects.create(username='patient2',
                                            email='patient2@foo.bar',
                                            first_name='Patient',
                                            last_name='Two')
        doctors = Group.objects.create(name='doctors')
        self.doctor1.groups.add(doctors)
        self.doctor2.groups.add(doctors)
        self.doctor3.groups.add(doctors)

        Appointment.objects.create(patient=self.user, doctor=self.doctor1, time=(
            timezone.now() - datetime.timedelta(days=1)))
        Appointment.objects.create(patient=self.user, doctor=self.doctor1, time=(
            timezone.now() + datetime.timedelta(days=1)))
        Appointment.objects.create(patient=self.patient1, doctor=self.doctor1, time=(
            timezone.now() - datetime.timedelta(days=2)))

    def test_unauthenticated_get(self):
        client = APIClient()
        response = client.get('/icough/history/')
        self.assertEqual(response.status_code, 401)

    def test_authenticated_patient_get(self):
        client = APIClient()
        client.force_authenticate(user=self.user)
        response = client.get('/icough/history/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['count'], 1)
        self.assertEqual((response.data['results'][0])['state'], 'P')
        serializer_doctor = DoctorOrPatientSerializer(self.doctor1)
        serializer_patient = DoctorOrPatientSerializer(self.user)
        self.assertEqual((response.data['results'][0])[
                         'doctor'], serializer_doctor.data)
        self.assertEqual((response.data['results'][0])[
                         'patient'], serializer_patient.data)

    def test_authenticated_doctor_get(self):
        client = APIClient()
        client.force_authenticate(user=self.doctor1)
        response = client.get('/icough/history/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['count'], 2)

    def test_authenticated_doctor_get_2(self):
        client = APIClient()
        client.force_authenticate(user=self.doctor3)
        response = client.get('/icough/history/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['count'], 0)


class AppointmentViewSetTest(APITestCase):

    def setUp(self):
        self.user = User.objects.create(username='testuser',
                                        email='testuser@foo.bar',
                                        first_name='Test',
                                        last_name='User')
        self.doctor1 = User.objects.create(username='doctor1',
                                           email='doctor1@foo.bar',
                                           first_name='Doctor',
                                           last_name='One')
        self.doctor2 = User.objects.create(username='doctor2',
                                           email='doctor2@foo.bar',
                                           first_name='Doctor',
                                           last_name='Two')
        self.doctor3 = User.objects.create(username='doctor3',
                                           email='doctor3@foo.bar',
                                           first_name='Doctor',
                                           last_name='Three')

        self.patient1 = User.objects.create(username='patient1',
                                            email='patient1@foo.bar',
                                            first_name='Patient',
                                            last_name='One')
        self.patient2 = User.objects.create(username='patient2',
                                            email='patient2@foo.bar',
                                            first_name='Patient',
                                            last_name='Two')
        doctors = Group.objects.create(name='doctors')
        self.doctor1.groups.add(doctors)
        self.doctor2.groups.add(doctors)
        self.doctor3.groups.add(doctors)

        Appointment.objects.create(patient=self.user, doctor=self.doctor1, time=(
            timezone.now() + datetime.timedelta(days=1)))
        Appointment.objects.create(patient=self.user, doctor=self.doctor1, time=(
            timezone.now() - datetime.timedelta(days=1)))
        Appointment.objects.create(patient=self.patient1, doctor=self.doctor1, time=(
            timezone.now() + datetime.timedelta(days=2)), state='A')
        Appointment.objects.create(patient=self.patient2, doctor=self.doctor2, time=(
            timezone.now() + datetime.timedelta(days=1)), state='D')

    def test_unauthenticated_get(self):
        client = APIClient()
        response = client.get('/icough/appointments/')
        self.assertEqual(response.status_code, 401)

    def test_authenticated_patient_get(self):
        client = APIClient()
        client.force_authenticate(user=self.user)
        response = client.get('/icough/appointments/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['count'], 1)
        self.assertEqual((response.data['results'][0])['state'], 'P')
        serializer_doctor = DoctorOrPatientSerializer(self.doctor1)
        serializer_patient = DoctorOrPatientSerializer(self.user)
        self.assertEqual((response.data['results'][0])[
                         'doctor'], serializer_doctor.data)
        self.assertEqual((response.data['results'][0])[
                         'patient'], serializer_patient.data)

    def test_authenticated_doctor_get(self):
        client = APIClient()
        client.force_authenticate(user=self.doctor1)
        response = client.get('/icough/appointments/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['count'], 2)

    def test_authenticated_doctor_get_2(self):
        client = APIClient()
        client.force_authenticate(user=self.doctor3)
        response = client.get('/icough/appointments/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['count'], 0)

    def test_unauthenticated_post(self):
        client = APIClient()
        response = client.post('/icough/appointments/', {})
        self.assertEqual(response.status_code, 401)

    def test_authenticated_doctor_post(self):
        client = APIClient()
        client.force_authenticate(user=self.doctor3)
        response = client.post('/icough/appointments/', {})
        self.assertEqual(response.status_code, 403)
        self.assertEqual(response.data['message'],
                         'Only patients can request appointments')

    def test_authenticated_patient_post_invalid_doctor_field(self):
        client = APIClient()
        client.force_authenticate(user=self.user)
        response = client.post('/icough/appointments/', {})
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data['message'], 'Invalid doctor field')

    def test_authenticated_patient_post_invalid_doctor_field_2(self):
        client = APIClient()
        client.force_authenticate(user=self.user)
        response = client.post('/icough/appointments/', {
            'doctor': {
                'username': 'not-existing'
            }
        })
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data['message'], 'Invalid doctor field')

    def test_authenticated_patient_post_missing_time_field(self):
        client = APIClient()
        client.force_authenticate(user=self.user)
        response = client.post('/icough/appointments/', {
            'doctor': {
                'username': 'doctor3'
            }
        })
        self.assertEqual(response.status_code, 400)
        self.assertEqual(
            response.data, {'time': ['This field may not be null.']})

    def test_authenticated_patient_post_invalid_time_field(self):
        client = APIClient()
        client.force_authenticate(user=self.user)
        response = client.post('/icough/appointments/', {
            'doctor': {
                'username': 'doctor3'
            },
            'time': timezone.now() - datetime.timedelta(days=5)  # time is in the past!
        })
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data['message'], 'Invalid appointment time')

    def test_authenticated_patient_post_clashing_appointment(self):
        client = APIClient()
        client.force_authenticate(user=self.user)

        response = client.post('/icough/appointments/', {
            'doctor': {
                'username': 'doctor1'
            },
            'time': timezone.now() + datetime.timedelta(days=2)
        })
        self.assertEqual(response.status_code, 400)
        self.assertEqual(
            response.data['message'], 'This request clashes with existing appointment')

    def test_authenticated_patient_post_success(self):
        client = APIClient()
        client.force_authenticate(user=self.user)

        response = client.post('/icough/appointments/', {
            'doctor': {
                'username': 'doctor1'
            },
            'time': timezone.now() + datetime.timedelta(days=3)
        })
        self.assertEqual(response.status_code, 201)

    def test_unauthenticated_put(self):
        client = APIClient()
        response = client.post('/icough/appointments/1/', {})
        self.assertEqual(response.status_code, 401)

    def test_authenticated_doctor_put_unauthorized(self):
        client = APIClient()
        client.force_authenticate(user=self.doctor1)
        response = client.put('/icough/appointments/3/', {})
        self.assertEqual(response.status_code, 403)
        self.assertEqual(response.data['message'],
                         'Only PENDING appointments can be updated')

    def test_authenticated_doctor_put_unauthorized_2(self):
        client = APIClient()
        # This doctor should not be able to access doctor1's appointment
        client.force_authenticate(user=self.doctor2)
        response = client.put('/icough/appointments/3/', {})
        self.assertEqual(response.status_code, 403)

    def test_authenticated_doctor_put_invalid_pk(self):
        client = APIClient()
        client.force_authenticate(user=self.doctor1)
        response = client.put('/icough/appointments/3792/', {})
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data['message'], 'Invalid pk')

    def test_authenticated_doctor_put_missing_state(self):
        client = APIClient()
        client.force_authenticate(user=self.doctor1)
        response = client.put('/icough/appointments/1/', {})
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data['message'], 'Invalid state field')

    def test_authenticated_doctor_put_invalid_state(self):
        client = APIClient()
        client.force_authenticate(user=self.doctor1)
        response = client.put('/icough/appointments/1/', {'state': 'P'})
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data['message'], 'Invalid state field')

    def test_authenticated_doctor_put_success(self):
        client = APIClient()
        client.force_authenticate(user=self.doctor1)
        response = client.put('/icough/appointments/1/', {'state': 'A'})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(Appointment.objects.all().filter(id=1)[0].state, 'A')

    def test_authenticated_doctor_put_success_2(self):
        client = APIClient()
        client.force_authenticate(user=self.doctor1)
        response = client.put('/icough/appointments/1/', {'state': 'D'})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(Appointment.objects.all().filter(id=1)[0].state, 'D')

    def test_authenticated_patient_put_unauthorized(self):
        client = APIClient()
        client.force_authenticate(user=self.user)
        response = client.put('/icough/appointments/3/', {})
        self.assertEqual(response.status_code, 403)

    def test_authenticated_patient_put_unauthorized_2(self):
        client = APIClient()
        client.force_authenticate(user=self.user)
        response = client.put('/icough/appointments/1/', {})
        self.assertEqual(response.status_code, 403)
        self.assertEqual(
            response.data['message'], 'Only DECLINED appointments can be rescheduled')

    def test_authenticated_patient_put_missing_time(self):
        client = APIClient()
        client.force_authenticate(user=self.patient2)
        response = client.put('/icough/appointments/4/', {})
        self.assertEqual(response.status_code, 400)
        self.assertEqual(
            response.data['message'], 'Missing time field')

    def test_authenticated_patient_put_invalid_time(self):
        client = APIClient()
        client.force_authenticate(user=self.patient2)
        response = client.put('/icough/appointments/4/', {
            'time': timezone.now() - datetime.timedelta(days=1)
        })
        self.assertEqual(response.status_code, 400)
        self.assertEqual(
            response.data['message'], 'Invalid appointment time')

    def test_authenticated_patient_put_clashing_time(self):
        client = APIClient()
        client.force_authenticate(user=self.patient2)
        Appointment.objects.create(
            doctor=self.doctor2,
            patient=self.patient2,
            state='A',
            time=timezone.now() + datetime.timedelta(days=1)
        )
        response = client.put('/icough/appointments/4/', {
            'time': timezone.now() + datetime.timedelta(days=1)
        })
        self.assertEqual(response.status_code, 400)
        self.assertEqual(
            response.data['message'], 'This request clashes with existing appointment')

    def test_authenticated_patient_put_success(self):
        client = APIClient()
        client.force_authenticate(user=self.patient2)
        time = timezone.now() + datetime.timedelta(days=11)
        response = client.put('/icough/appointments/4/', {
            'time': time
        })
        self.assertEqual(response.status_code, 200)
        self.assertEqual(Appointment.objects.all().filter(id=4)[0].time, time)
        self.assertEqual(Appointment.objects.all().filter(id=4)[0].state, 'P')
