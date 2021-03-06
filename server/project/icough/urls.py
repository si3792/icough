from django.conf.urls import url, include
from icough import views
from rest_framework import routers

router = routers.DefaultRouter()
router.register(r'appointments', views.AppointmentViewSet)
router.register(r'history', views.AppointmentHistoryViewSet)

urlpatterns = [
    url(r'^doctors/', views.DoctorsListView.as_view()),
    url(r'^', include(router.urls))
]
