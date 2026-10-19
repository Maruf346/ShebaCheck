from rest_framework.routers import DefaultRouter

from .views import DisputeViewSet

router = DefaultRouter()
router.register("disputes", DisputeViewSet, basename="dispute")
urlpatterns = router.urls
