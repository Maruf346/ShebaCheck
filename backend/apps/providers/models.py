from django.conf import settings
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models


class ProviderProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="provider_profile")
    display_name = models.CharField(max_length=160)
    category = models.CharField(max_length=80, blank=True, db_index=True)
    area = models.CharField(max_length=120, blank=True, db_index=True)
    bio = models.TextField(blank=True)
    image_url = models.URLField(blank=True)
    identity_verified = models.BooleanField(default=False)
    years_experience = models.PositiveSmallIntegerField(default=0)
    starting_price = models.DecimalField(max_digits=10, decimal_places=2, default=0, validators=[MinValueValidator(0)])
    cancellation_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0, validators=[MinValueValidator(0), MaxValueValidator(100)])
    response_time = models.CharField(max_length=80, blank=True)
    tags = models.JSONField(default=list, blank=True)
    is_active = models.BooleanField(default=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ("display_name",)

    def __str__(self) -> str:
        return self.display_name


class ProviderService(models.Model):
    provider = models.ForeignKey(ProviderProfile, on_delete=models.CASCADE, related_name="services")
    name = models.CharField(max_length=160)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    is_active = models.BooleanField(default=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ("name",)
        constraints = [models.UniqueConstraint(fields=("provider", "name"), name="unique_provider_service_name")]

    def __str__(self) -> str:
        return f"{self.name} — {self.provider.display_name}"


class AvailabilityBlock(models.Model):
    provider = models.ForeignKey(ProviderProfile, on_delete=models.CASCADE, related_name="availability_blocks")
    date = models.DateField(db_index=True)
    reason = models.CharField(max_length=240, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ("date",)
        constraints = [models.UniqueConstraint(fields=("provider", "date"), name="unique_provider_blocked_date")]

    def __str__(self) -> str:
        return f"{self.provider.display_name} unavailable on {self.date}"


class PortfolioItem(models.Model):
    provider = models.ForeignKey(ProviderProfile, on_delete=models.CASCADE, related_name="portfolio")
    title = models.CharField(max_length=180)
    description = models.TextField(blank=True)
    image_url = models.URLField(blank=True)
    completed_at = models.DateField(null=True, blank=True)
    is_published = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ("-completed_at", "-created_at")

    def __str__(self) -> str:
        return self.title
