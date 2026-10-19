from django.contrib import admin

from .models import Booking


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ("id", "service_name", "customer", "provider", "appointment_at", "status")
    list_filter = ("status", "area", "created_at")
    search_fields = ("service_name", "customer__email", "provider__display_name")
    readonly_fields = ("created_at", "updated_at")