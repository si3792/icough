from django.conf.urls import url, include
from icough import views
from rest_framework import routers

router = routers.DefaultRouter()
router.register(r'appointments', views.AppointmentViewSet)

urlpatterns = [
    url(r'^', include(router.urls))
]
