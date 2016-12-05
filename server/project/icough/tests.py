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
        response = client.get('/icough/doctors/')
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
