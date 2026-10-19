from django.urls import path

from .views import CurrentUserView, DocumentedTokenRefreshView, EmailTokenObtainPairView, RegistrationView

app_name = "users"

urlpatterns = [
    path("register/", RegistrationView.as_view(), name="register"),
    path("me/", CurrentUserView.as_view(), name="me"),
    path("token/", EmailTokenObtainPairView.as_view(), name="token"),
    path("token/refresh/", DocumentedTokenRefreshView.as_view(), name="token-refresh"),
]
