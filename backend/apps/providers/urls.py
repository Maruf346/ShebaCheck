from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import AvailabilityBlockViewSet, FavoriteProviderViewSet, PortfolioViewSet, ProviderServiceViewSet, ProviderViewSet

provider_router = DefaultRouter()
provider_router.register("", ProviderViewSet, basename="provider")
service_router = DefaultRouter()
service_router.register("", ProviderServiceViewSet, basename="provider-service")
portfolio_router = DefaultRouter()
portfolio_router.register("", PortfolioViewSet, basename="provider-portfolio")
availability_router = DefaultRouter()
availability_router.register("", AvailabilityBlockViewSet, basename="provider-availability")
favorite_router = DefaultRouter()
favorite_router.register("", FavoriteProviderViewSet, basename="favorite-provider")

urlpatterns = [
	path("services/", include(service_router.urls)),
	path("portfolio/", include(portfolio_router.urls)),
	path("availability/", include(availability_router.urls)),
	path("favorites/", include(favorite_router.urls)),
	path("", include(provider_router.urls)),
]
