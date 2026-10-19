from drf_spectacular.utils import OpenApiParameter, extend_schema, extend_schema_view
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Booking
from .serializers import BookingCreateSerializer, BookingSerializer, BookingStatusSerializer


@extend_schema_view(
    list=extend_schema(
        tags=["Bookings"],
        summary="List my bookings",
        description="Customers see their own bookings; provider users see requests for their own provider profile.",
        parameters=[OpenApiParameter("status", str, description="Optional booking status filter.")],
    ),
    retrieve=extend_schema(tags=["Bookings"], summary="Get a booking"),
    create=extend_schema(tags=["Bookings"], summary="Request a service booking", request=BookingCreateSerializer, responses={201: BookingSerializer}),
)
class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all()
    http_method_names = ("get", "post", "patch", "head", "options")
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        if getattr(self, "swagger_fake_view", False):
            return self.queryset.none()
        user = self.request.user
        queryset = Booking.objects.select_related("customer", "provider", "service")
        if user.role == "provider":
            queryset = queryset.filter(provider__user=user)
        elif user.is_staff or user.role == "admin":
            pass
        else:
            queryset = queryset.filter(customer=user)
        status_filter = self.request.query_params.get("status")
        return queryset.filter(status=status_filter) if status_filter else queryset

    def get_serializer_class(self):
        return BookingCreateSerializer if self.action == "create" else BookingSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        booking = serializer.save()
        headers = self.get_success_headers(serializer.data)
        return Response(BookingSerializer(booking).data, status=status.HTTP_201_CREATED, headers=headers)

    def perform_create(self, serializer):
        if self.request.user.role != "customer":
            raise PermissionDenied("Only customer accounts can request a booking.")
        serializer.save()

    @extend_schema(
        tags=["Bookings"],
        summary="Update booking status",
        description="Customers may cancel their own requested or confirmed booking. The assigned provider may accept, decline, request reschedule, or complete it.",
        request=BookingStatusSerializer,
        responses={200: BookingSerializer},
    )
    @action(detail=True, methods=("patch",), url_path="status")
    def update_status(self, request, pk=None):
        booking = self.get_object()
        target_status = request.data.get("status")
        if request.user == booking.customer:
            if target_status != Booking.Status.CANCELLED:
                raise PermissionDenied("Customers may only cancel their own booking.")
        elif request.user == booking.provider.user:
            if target_status == Booking.Status.CANCELLED:
                raise PermissionDenied("Providers cannot cancel a customer booking; use declined or reschedule requested.")
        elif not (request.user.is_staff or request.user.role == "admin"):
            raise PermissionDenied("You cannot update this booking.")

        serializer = BookingStatusSerializer(data=request.data, context={"booking": booking})
        serializer.is_valid(raise_exception=True)
        booking.status = serializer.validated_data["status"]
        booking.save(update_fields=("status", "updated_at"))
        return Response(BookingSerializer(booking).data)


class BookingCountView(APIView):
    permission_classes = (IsAuthenticated,)

    @extend_schema(tags=["Bookings"], summary="Get booking totals for the current account", responses={200: dict})
    def get(self, request):
        queryset = Booking.objects.all()
        if request.user.role == "provider":
            queryset = queryset.filter(provider__user=request.user)
        elif not (request.user.is_staff or request.user.role == "admin"):
            queryset = queryset.filter(customer=request.user)
        totals = {status_key: queryset.filter(status=status_key).count() for status_key, _ in Booking.Status.choices}
        totals["total"] = queryset.count()
        return Response(totals)
