from rest_framework.test import APITestCase, APIRequestFactory, APIClient, force_authenticate
from django.contrib.auth.models import User, Group


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
