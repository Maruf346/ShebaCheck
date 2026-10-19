from django.urls import include, path

urlpatterns = [
    path("auth/", include("apps.users.urls")),
    path("providers/", include("apps.providers.urls")),
    path("bookings/", include("apps.bookings.urls")),
    path("reviews/", include("apps.reviews.urls")),
    path("support/", include("apps.support.urls")),
]
