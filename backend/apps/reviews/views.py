from drf_spectacular.utils import extend_schema, extend_schema_view
from rest_framework import mixins, status, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from .models import Review
from .serializers import ProviderReplySerializer, ReviewSerializer


@extend_schema_view(
    list=extend_schema(tags=["Reviews"], summary="List published reviews", description="Filter by provider using provider=<provider id>."),
    retrieve=extend_schema(tags=["Reviews"], summary="Get a review"),
    create=extend_schema(tags=["Reviews"], summary="Review a completed booking", description="Customers may submit one review per completed booking."),
)
class ReviewViewSet(mixins.ListModelMixin, mixins.RetrieveModelMixin, mixins.CreateModelMixin, viewsets.GenericViewSet):
    serializer_class = ReviewSerializer

    def get_permissions(self):
        if self.action in ("list", "retrieve"):
            return (AllowAny(),)
        return (IsAuthenticated(),)

    def get_queryset(self):
        queryset = Review.objects.filter(is_published=True).select_related("customer", "provider", "booking")
        provider_id = self.request.query_params.get("provider")
        if provider_id:
            queryset = queryset.filter(provider_id=provider_id)
        if self.request.user.is_authenticated and self.request.query_params.get("mine") == "true":
            queryset = Review.objects.filter(customer=self.request.user).select_related("customer", "provider", "booking")
        return queryset

    def perform_create(self, serializer):
        if self.request.user.role != "customer":
            raise PermissionDenied("Only customer accounts can submit reviews.")
        serializer.save()

    @extend_schema(
        tags=["Reviews"],
        summary="Reply to a review",
        description="The provider who received the review may add or update one public reply.",
        request=ProviderReplySerializer,
        responses={200: ReviewSerializer},
    )
    @action(detail=True, methods=("patch",), url_path="reply", permission_classes=(IsAuthenticated,))
    def reply(self, request, pk=None):
        review = self.get_object()
        if review.provider.user_id != request.user.id:
            raise PermissionDenied("Only the provider named in this review may reply.")
        serializer = ProviderReplySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        review.provider_reply = serializer.validated_data["provider_reply"]
        review.save(update_fields=("provider_reply", "updated_at"))
        return Response(ReviewSerializer(review).data, status=status.HTTP_200_OK)
