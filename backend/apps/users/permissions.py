from rest_framework.permissions import BasePermission


class IsCustomer(BasePermission):
    message = "A customer account is required."

    def has_permission(self, request, view) -> bool:
        return bool(request.user and request.user.is_authenticated and request.user.role == "customer")


class IsProvider(BasePermission):
    message = "A provider account is required."

    def has_permission(self, request, view) -> bool:
        return bool(request.user and request.user.is_authenticated and request.user.role == "provider")


class IsStaffOrAdmin(BasePermission):
    message = "Staff permissions are required."

    def has_permission(self, request, view) -> bool:
        return bool(request.user and request.user.is_authenticated and (request.user.is_staff or request.user.role == "admin"))
