from drf_spectacular.utils import extend_schema, extend_schema_view
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from apps.users.permissions import IsStaffOrAdmin
from .models import Dispute
from .serializers import DisputeCreateSerializer, DisputeResolutionSerializer, DisputeSerializer


@extend_schema_view(
    list=extend_schema(tags=["Support"], summary="List my support disputes", description="Customers and providers see disputes associated with their accounts. Staff can see all disputes."),
    retrieve=extend_schema(tags=["Support"], summary="Get a dispute"),
    create=extend_schema(tags=["Support"], summary="Open a dispute for a booking", description="Only the customer who owns a confirmed or completed booking may open a dispute."),
)
class DisputeViewSet(viewsets.ModelViewSet):
    queryset = Dispute.objects.all()
    http_method_names = ("get", "post", "patch", "head", "options")
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        if getattr(self, "swagger_fake_view", False):
            return self.queryset.none()
        queryset = Dispute.objects.select_related("booking", "customer", "provider", "provider__user")
        user = self.request.user
        if user.is_staff or user.role == "admin":
            return queryset
        if user.role == "provider":
            return queryset.filter(provider__user=user)
        return queryset.filter(customer=user)

    def get_serializer_class(self):
        if self.action == "create":
            return DisputeCreateSerializer
        if self.action == "resolve":
            return DisputeResolutionSerializer
        return DisputeSerializer

    def perform_create(self, serializer):
        if self.request.user.role != "customer":
            raise PermissionDenied("Only customers can open booking disputes.")
        serializer.save()

    @extend_schema(
        tags=["Support"],
        summary="Update dispute resolution",
        description="Staff may move a dispute into review or resolve/reject it, with an optional resolution note.",
        request=DisputeResolutionSerializer,
        responses={200: DisputeSerializer},
    )
    @action(detail=True, methods=("patch",), permission_classes=(IsAuthenticated, IsStaffOrAdmin))
    def resolve(self, request, pk=None):
        dispute = self.get_object()
        serializer = DisputeResolutionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        dispute.status = serializer.validated_data["status"]
        dispute.resolution_note = serializer.validated_data.get("resolution_note", "")
        dispute.save(update_fields=("status", "resolution_note", "updated_at"))
        if dispute.status in (Dispute.Status.RESOLVED, Dispute.Status.REJECTED):
            dispute.booking.status = dispute.booking_previous_status
            dispute.booking.save(update_fields=("status", "updated_at"))
        return Response(DisputeSerializer(dispute).data, status=status.HTTP_200_OK)
