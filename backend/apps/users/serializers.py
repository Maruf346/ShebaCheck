from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers

from .models import User


class UserSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ("id", "email", "first_name", "last_name", "full_name", "phone", "role", "date_joined")
        read_only_fields = ("id", "email", "role", "date_joined", "full_name")

    def get_full_name(self, obj: User) -> str:
        return " ".join(part for part in (obj.first_name, obj.last_name) if part).strip()


class RegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password], trim_whitespace=False)
    role = serializers.ChoiceField(choices=(User.Role.CUSTOMER, User.Role.PROVIDER), default=User.Role.CUSTOMER)

    class Meta:
        model = User
        fields = ("id", "email", "password", "first_name", "last_name", "phone", "role")
        read_only_fields = ("id",)

    def validate_email(self, value: str) -> str:
        return value.strip().lower()

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


class ProfileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("first_name", "last_name", "phone")
