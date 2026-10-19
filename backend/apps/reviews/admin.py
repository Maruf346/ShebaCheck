from django.contrib import admin

from .models import Review


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ("id", "provider", "customer", "booking", "rating", "is_published", "created_at")
    list_filter = ("rating", "is_published", "created_at")
    search_fields = ("provider__display_name", "customer__email", "body")