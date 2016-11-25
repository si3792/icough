from .serializers import AppointmentSerializer
from .models import Appointment
from rest_framework.permissions import AllowAny
from rest_framework import viewsets
from rest_framework import filters


class AppointmentViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows Appointments to be viewed or edited.
    """
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
    filter_fields = ('state', 'doctor')
    search_fields = ('doctor', 'patient')
    ordering_fields = ('created', 'time')
    filter_backends = (filters.OrderingFilter,
                       filters.DjangoFilterBackend, filters.SearchFilter,)

    def get_serializer_context(self):
        return {'request': self.request}
