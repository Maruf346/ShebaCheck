from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import BookingCountView, BookingViewSet

router = DefaultRouter()
router.register("", BookingViewSet, basename="booking")

urlpatterns = [
    path("summary/", BookingCountView.as_view(), name="booking-summary"),
    path("", include(router.urls)),
]
