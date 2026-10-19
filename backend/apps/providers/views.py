from django.db.models import Avg, Count, FloatField, Q, Value
from django.db.models.functions import Coalesce
from drf_spectacular.utils import OpenApiParameter, extend_schema, extend_schema_view
from rest_framework import mixins, status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.response import Response

from apps.users.permissions import IsProvider
from .models import AvailabilityBlock, FavoriteProvider, PortfolioItem, ProviderProfile, ProviderService
from .serializers import (
    AvailabilityBlockSerializer,
    FavoriteProviderSerializer,
    PortfolioItemSerializer,
    ProviderProfileUpdateSerializer,
    ProviderServiceSerializer,
    PublicProviderSerializer,
)


@extend_schema_view(
    list=extend_schema(
        tags=["Providers"],
        summary="Search providers",
        description="Returns active providers. Supports category, area, identity_verified, search, pagination, and ordering.",
        parameters=[
            OpenApiParameter("min_price", int, description="Inclusive minimum starting price."),
            OpenApiParameter("max_price", int, description="Inclusive maximum starting price."),
            OpenApiParameter("min_rating", float, description="Minimum average review rating."),
            OpenApiParameter("available_on", str, description="Only include providers not blocked on this ISO date (YYYY-MM-DD)."),
        ],
    ),
    retrieve=extend_schema(tags=["Providers"], summary="Get a provider profile"),
)
class ProviderViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ProviderProfile.objects.all()
    serializer_class = PublicProviderSerializer
    permission_classes = (IsAuthenticatedOrReadOnly,)
    search_fields = ("display_name", "category", "area", "bio")
    filterset_fields = ("category", "area", "identity_verified")
    ordering_fields = ("display_name", "starting_price", "created_at", "average_rating", "review_count")
    ordering = ("display_name",)

    def get_queryset(self):
        queryset = ProviderProfile.objects.filter(is_active=True, user__is_active=True).select_related("user").prefetch_related("services", "portfolio", "availability_blocks")
        queryset = queryset.annotate(
            average_rating=Coalesce(Avg("provider_reviews__rating"), Value(0.0), output_field=FloatField()),
            review_count=Count("provider_reviews", distinct=True),
            completed_count=Count("provider_bookings", filter=Q(provider_bookings__status="completed"), distinct=True),
        )
        params = self.request.query_params
        if getattr(self, "swagger_fake_view", False):
            return queryset.none()
        min_price = params.get("min_price")
        max_price = params.get("max_price")
        min_rating = params.get("min_rating")
        available_on = params.get("available_on")
        if min_price:
            queryset = queryset.filter(starting_price__gte=min_price)
        if max_price:
            queryset = queryset.filter(starting_price__lte=max_price)
        if min_rating:
            queryset = queryset.filter(average_rating__gte=min_rating)
        if available_on:
            queryset = queryset.exclude(availability_blocks__date=available_on)
        return queryset

    def get_permissions(self):
        if self.action == "me":
            return (IsAuthenticated(), IsProvider())
        return super().get_permissions()

    @extend_schema(
        tags=["Providers"],
        summary="Get or update my provider profile",
        request=ProviderProfileUpdateSerializer,
        responses={200: PublicProviderSerializer},
    )
    @action(detail=False, methods=("get", "patch"), url_path="me")
    def me(self, request):
        profile, _ = ProviderProfile.objects.get_or_create(
            user=request.user,
            defaults={"display_name": " ".join(filter(None, (request.user.first_name, request.user.last_name))) or request.user.email.split("@", 1)[0]},
        )
        if request.method == "PATCH":
            serializer = ProviderProfileUpdateSerializer(profile, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
        profile = self.get_queryset().filter(pk=profile.pk).first() or profile
        return Response(PublicProviderSerializer(profile, context=self.get_serializer_context()).data)


class ProviderOwnedModelViewSet(viewsets.ModelViewSet):
    model = None
    permission_classes = (IsAuthenticatedOrReadOnly,)
    serializer_class = None
    related_name = ""

    def get_permissions(self):
        if self.request.method in ("POST", "PUT", "PATCH", "DELETE"):
            return (IsAuthenticated(), IsProvider())
        return super().get_permissions()

    def get_queryset(self):
        if getattr(self, "swagger_fake_view", False):
            return self.model.objects.none()
        queryset = self.model.objects.select_related("provider", "provider__user")
        if self.request.method in ("POST", "PUT", "PATCH", "DELETE"):
            return queryset.filter(provider__user=self.request.user)
        return queryset.filter(provider__is_active=True, is_published=True) if self.model is PortfolioItem else queryset.filter(provider__is_active=True, is_active=True)

    def perform_create(self, serializer):
        profile, _ = ProviderProfile.objects.get_or_create(
            user=self.request.user,
            defaults={"display_name": " ".join(filter(None, (self.request.user.first_name, self.request.user.last_name))) or self.request.user.email.split("@", 1)[0]},
        )
        serializer.save(provider=profile)


@extend_schema_view(
    list=extend_schema(tags=["Providers"], summary="List provider services"),
    retrieve=extend_schema(tags=["Providers"], summary="Get a provider service"),
    create=extend_schema(tags=["Providers"], summary="Add a service to my provider profile"),
    update=extend_schema(tags=["Providers"], summary="Update one of my services"),
    partial_update=extend_schema(tags=["Providers"], summary="Partially update one of my services"),
    destroy=extend_schema(tags=["Providers"], summary="Remove one of my services"),
)
class ProviderServiceViewSet(ProviderOwnedModelViewSet):
    model = ProviderService
    serializer_class = ProviderServiceSerializer


@extend_schema_view(
    list=extend_schema(tags=["Providers"], summary="List published portfolio items"),
    retrieve=extend_schema(tags=["Providers"], summary="Get a portfolio item"),
    create=extend_schema(tags=["Providers"], summary="Add a portfolio item"),
    update=extend_schema(tags=["Providers"], summary="Update a portfolio item"),
    partial_update=extend_schema(tags=["Providers"], summary="Partially update a portfolio item"),
    destroy=extend_schema(tags=["Providers"], summary="Remove a portfolio item"),
)
class PortfolioViewSet(ProviderOwnedModelViewSet):
    model = PortfolioItem
    serializer_class = PortfolioItemSerializer


@extend_schema_view(
    list=extend_schema(tags=["Providers"], summary="List my blocked dates"),
    create=extend_schema(tags=["Providers"], summary="Block an unavailable date"),
    destroy=extend_schema(tags=["Providers"], summary="Remove an unavailable date"),
)
class AvailabilityBlockViewSet(mixins.ListModelMixin, mixins.CreateModelMixin, mixins.DestroyModelMixin, viewsets.GenericViewSet):
    queryset = AvailabilityBlock.objects.all()
    serializer_class = AvailabilityBlockSerializer
    permission_classes = (IsAuthenticated, IsProvider)

    def get_queryset(self):
        if getattr(self, "swagger_fake_view", False):
            return self.queryset.none()
        return AvailabilityBlock.objects.filter(provider__user=self.request.user)

    def perform_create(self, serializer):
        profile, _ = ProviderProfile.objects.get_or_create(
            user=self.request.user,
            defaults={"display_name": " ".join(filter(None, (self.request.user.first_name, self.request.user.last_name))) or self.request.user.email.split("@", 1)[0]},
        )
        serializer.save(provider=profile)


@extend_schema_view(
    list=extend_schema(tags=["Providers"], summary="List my saved providers"),
    create=extend_schema(tags=["Providers"], summary="Save a provider"),
    destroy=extend_schema(tags=["Providers"], summary="Remove a saved provider"),
)
class FavoriteProviderViewSet(mixins.ListModelMixin, mixins.CreateModelMixin, mixins.DestroyModelMixin, viewsets.GenericViewSet):
    queryset = FavoriteProvider.objects.all()
    serializer_class = FavoriteProviderSerializer
    permission_classes = (IsAuthenticated,)

    def get_permissions(self):
        if self.request.method in ("POST", "DELETE"):
            return (IsAuthenticated(),)
        return super().get_permissions()

    def get_queryset(self):
        if getattr(self, "swagger_fake_view", False):
            return self.queryset.none()
        if self.request.user.role != "customer":
            return FavoriteProvider.objects.none()
        return FavoriteProvider.objects.filter(customer=self.request.user, provider__is_active=True).select_related("provider", "provider__user").prefetch_related("provider__services", "provider__portfolio")

    def perform_create(self, serializer):
        if self.request.user.role != "customer":
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("Only customer accounts can save providers.")
        serializer.save(customer=self.request.user)
