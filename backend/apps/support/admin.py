from django.contrib import admin

from .models import Dispute


@admin.register(Dispute)
class DisputeAdmin(admin.ModelAdmin):
    list_display = ("id", "booking", "customer", "provider", "status", "created_at")
    list_filter = ("status", "created_at")
    search_fields = ("booking__id", "customer__email", "provider__display_name", "description")
    readonly_fields = ("created_at", "updated_at", "booking_previous_status")