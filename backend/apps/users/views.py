from django.db import transaction
from drf_spectacular.utils import OpenApiResponse, extend_schema
from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .serializers import ProfileUpdateSerializer, RegistrationSerializer, UserSerializer


class EmailTokenObtainPairView(TokenObtainPairView):
	serializer_class = TokenObtainPairSerializer

	@extend_schema(
		tags=["Authentication"],
		summary="Obtain JWT tokens",
		description="Authenticate with email and password. Use the access token as a Bearer token.",
		responses={200: OpenApiResponse(description="Access and refresh JWT tokens.")},
	)
	def post(self, request, *args, **kwargs):
		return super().post(request, *args, **kwargs)


class DocumentedTokenRefreshView(TokenRefreshView):
	@extend_schema(
		tags=["Authentication"],
		summary="Refresh access token",
		description="Exchange a valid refresh token for a new access token.",
		responses={200: OpenApiResponse(description="A refreshed access token.")},
	)
	def post(self, request, *args, **kwargs):
		return super().post(request, *args, **kwargs)


class RegistrationView(generics.CreateAPIView):
	serializer_class = RegistrationSerializer
	permission_classes = (AllowAny,)

	@extend_schema(
		tags=["Authentication"],
		summary="Register a customer or provider account",
		description="Public registration never accepts the administrator role. Provider accounts receive an empty provider profile to complete later.",
		responses={201: UserSerializer},
	)
	@transaction.atomic
	def create(self, request, *args, **kwargs):
		serializer = self.get_serializer(data=request.data)
		serializer.is_valid(raise_exception=True)
		user = serializer.save()
		if user.role == "provider":
			from apps.providers.models import ProviderProfile

			display_name = " ".join(part for part in (user.first_name, user.last_name) if part).strip()
			ProviderProfile.objects.create(
				user=user,
				display_name=display_name or user.email.split("@", 1)[0],
			)
		return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)


class CurrentUserView(APIView):
	permission_classes = (IsAuthenticated,)

	@extend_schema(tags=["Authentication"], summary="Get the current account", responses={200: UserSerializer})
	def get(self, request):
		return Response(UserSerializer(request.user).data)

	@extend_schema(
		tags=["Authentication"],
		summary="Update the current account profile",
		request=ProfileUpdateSerializer,
		responses={200: UserSerializer},
	)
	def patch(self, request):
		serializer = ProfileUpdateSerializer(request.user, data=request.data, partial=True)
		serializer.is_valid(raise_exception=True)
		serializer.save()
		return Response(UserSerializer(request.user).data)
