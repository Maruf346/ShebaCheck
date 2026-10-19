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

    @extend_schema(
        tags=["Providers"],
        summary="Automated AI OCR NID Verification for Provider",
        description="Scans uploaded NID image or test sample card using local ML OCR, checks Bangladesh NID formatting, verifies name match against registered provider account, and automatically sets identity_verified=True upon match.",
    )
    @action(detail=False, methods=("post",), url_path="verify-nid")
    def verify_nid(self, request):
        from apps.ml_estimator.nid_ocr import get_nid_ocr_engine
        profile, _ = ProviderProfile.objects.get_or_create(
            user=request.user,
            defaults={"display_name": " ".join(filter(None, (request.user.first_name, request.user.last_name))) or request.user.email.split("@", 1)[0]},
        )
        test_card = request.data.get("test_card")
        nid_image_b64 = request.data.get("nid_image")
        image_file = request.FILES.get("file")

        image_bytes = None
        if image_file:
            image_bytes = image_file.read()
        elif nid_image_b64:
            if "," in nid_image_b64:
                nid_image_b64 = nid_image_b64.split(",", 1)[1]
            try:
                import base64
                image_bytes = base64.b64decode(nid_image_b64)
            except Exception:
                pass

        ocr_engine = get_nid_ocr_engine()
        full_name = " ".join(filter(None, (request.user.first_name, request.user.last_name))) or profile.display_name
        result = ocr_engine.process_nid_document(
            image_bytes=image_bytes,
            test_card_type=test_card,
            provider_name=full_name,
        )

        if result.get("is_verified"):
            profile.identity_verified = True
            current_tags = list(profile.tags or [])
            if "NID checked" not in current_tags:
                current_tags.insert(0, "NID checked")
            masked = result.get("masked_nid")
            if masked:
                tag_label = f"NID: {masked}"
                if tag_label not in current_tags:
                    current_tags.append(tag_label)
            profile.tags = current_tags
            profile.save(update_fields=["identity_verified", "tags"])

        result["profile_verified"] = profile.identity_verified
        return Response(result, status=status.HTTP_200_OK)

    @action(detail=False, methods=("post",), url_path="reset-nid")
    def reset_nid(self, request):
        profile = ProviderProfile.objects.filter(user=request.user).first()
        if profile:
            profile.identity_verified = False
            profile.tags = [t for t in (profile.tags or []) if not t.startswith("NID")]
            profile.save(update_fields=["identity_verified", "tags"])
        return Response({"status": "reset", "identity_verified": False})


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

        provider_id = self.request.query_params.get("provider")
        if provider_id:
            return queryset.filter(provider_id=provider_id, provider__is_active=True)

        if self.request.user.is_authenticated:
            if getattr(self.request.user, "role", None) == "provider" or self.request.query_params.get("mine") == "true":
                return queryset.filter(provider__user=self.request.user)

        if self.request.method in ("POST", "PUT", "PATCH", "DELETE"):
            if self.request.user.is_authenticated:
                return queryset.filter(provider__user=self.request.user)
            return self.model.objects.none()

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
