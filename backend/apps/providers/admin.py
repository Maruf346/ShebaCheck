from django.contrib import admin

from .models import AvailabilityBlock, PortfolioItem, ProviderProfile, ProviderService


class ProviderServiceInline(admin.TabularInline):
    model = ProviderService
    extra = 0


@admin.register(ProviderProfile)
class ProviderProfileAdmin(admin.ModelAdmin):
    list_display = ("display_name", "category", "area", "identity_verified", "is_active")
    list_filter = ("category", "identity_verified", "is_active")
    search_fields = ("display_name", "user__email", "area")
    inlines = (ProviderServiceInline,)


admin.site.register(AvailabilityBlock)
admin.site.register(PortfolioItem)