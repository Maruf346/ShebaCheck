from django.contrib.auth.base_user import AbstractBaseUser, BaseUserManager
from django.contrib.auth.models import PermissionsMixin
from django.db import models
from django.utils import timezone


class UserManager(BaseUserManager):
	use_in_migrations = True

	def create_user(self, email: str, password: str | None = None, **extra_fields):
		if not email:
			raise ValueError("An email address is required.")
		email = self.normalize_email(email).strip().lower()
		user = self.model(email=email, **extra_fields)
		user.set_password(password)
		user.save(using=self._db)
		return user

	def create_superuser(self, email: str, password: str | None = None, **extra_fields):
		extra_fields.setdefault("is_staff", True)
		extra_fields.setdefault("is_superuser", True)
		extra_fields.setdefault("role", User.Role.ADMIN)
		if not extra_fields["is_staff"] or not extra_fields["is_superuser"]:
			raise ValueError("A superuser must have staff and superuser permissions.")
		return self.create_user(email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
	class Role(models.TextChoices):
		CUSTOMER = "customer", "Customer"
		PROVIDER = "provider", "Provider"
		ADMIN = "admin", "Administrator"

	email = models.EmailField(unique=True)
	first_name = models.CharField(max_length=150, blank=True)
	last_name = models.CharField(max_length=150, blank=True)
	phone = models.CharField(max_length=20, blank=True)
	role = models.CharField(max_length=20, choices=Role.choices, default=Role.CUSTOMER)
	is_active = models.BooleanField(default=True)
	is_staff = models.BooleanField(default=False)
	date_joined = models.DateTimeField(default=timezone.now)

	objects = UserManager()

	USERNAME_FIELD = "email"
	REQUIRED_FIELDS: list[str] = []

	class Meta:
		ordering = ("email",)

	def __str__(self) -> str:
		return self.email
