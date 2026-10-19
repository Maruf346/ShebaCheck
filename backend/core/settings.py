import os
from datetime import timedelta
from pathlib import Path

from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env")


def env_bool(name: str, default: bool = False) -> bool:
    return os.getenv(name, str(default)).strip().lower() in {"1", "true", "yes", "on"}


def env_list(name: str, default: str = "") -> list[str]:
    return [value.strip() for value in os.getenv(name, default).split(",") if value.strip()]

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.getenv("DJANGO_SECRET_KEY", "local-development-key-change-before-deploy-2026")

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = env_bool("DJANGO_DEBUG", True)

ALLOWED_HOSTS = env_list("DJANGO_ALLOWED_HOSTS", "localhost,127.0.0.1,testserver")


# Application definition

INSTALLED_APPS = [
    "jazzmin", 
    "django.contrib.admin", 
    "django.contrib.auth",
    "django.contrib.contenttypes", 
    "django.contrib.sessions", 
    "django.contrib.messages",
    "django.contrib.staticfiles", 
    "django.contrib.sites", 
    
    # Third-party apps
    "rest_framework",
    "rest_framework_simplejwt.token_blacklist", 
    "corsheaders", "drf_spectacular",
    "django_filters", 
    "phonenumber_field", 
    
    # Local apps 
    "apps.api.apps.ApiConfig",
    "apps.users.apps.UsersConfig",
    "apps.providers.apps.ProvidersConfig",
    "apps.bookings.apps.BookingsConfig",
    "apps.reviews.apps.ReviewsConfig",
    "apps.support.apps.SupportConfig",
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'core.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'core.wsgi.application'


# Database
# https://docs.djangoproject.com/en/6.1/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}


# Password validation
# https://docs.djangoproject.com/en/6.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/6.1/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/6.1/howto/static-files/

STATIC_URL = 'static/'
MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

AUTH_USER_MODEL = "users.User"

CORS_ALLOWED_ORIGINS = env_list(
    "CORS_ALLOWED_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173"
)


# Email
# https://docs.djangoproject.com/en/6.1/topics/email/#topic-email-configuration

EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"
SUPPORT_EMAIL = os.getenv("SUPPORT_EMAIL", "support@shebacheck.local")
MAILERS = {
    'default': {
        'BACKEND': 'django.core.mail.backends.console.EmailBackend',
    },
}


SPECTACULAR_SETTINGS = {
    "TITLE": "ShebaCheck API", 
    "DESCRIPTION": "Help people find trustworthy electricians, plumbers, appliance repairers, and other local service providers.",
    "VERSION": "0.1.0", 
    "SERVE_INCLUDE_SCHEMA": False, 
    "COMPONENT_SPLIT_REQUEST": True,
    "CONTACT": {"email": SUPPORT_EMAIL},
    "SERVERS": [{"url": "/api/v1", "description": "ShebaCheck API v1"}],
    "TAGS": [
        {"name": "Authentication", "description": "Registration and account access."},
        {"name": "Providers", "description": "Public provider discovery and provider profile management."},
        {"name": "Bookings", "description": "Customer bookings and provider booking workflow."},
        {"name": "Reviews", "description": "Reviews tied to completed bookings."},
        {"name": "Support", "description": "Customer support and dispute reporting."},
    ],
    "ENUM_NAME_OVERRIDES": {
        "BookingStatusEnum": "apps.bookings.models.Booking.Status",
        "DisputeStatusEnum": "apps.support.models.Dispute.Status",
        "UserRoleEnum": "apps.users.models.User.Role",
    },
}

REST_FRAMEWORK = {
    "DEFAULT_SCHEMA_CLASS": "drf_spectacular.openapi.AutoSchema",
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
    "DEFAULT_PERMISSION_CLASSES": (
        "rest_framework.permissions.IsAuthenticatedOrReadOnly",
    ),
    "DEFAULT_FILTER_BACKENDS": (
        "django_filters.rest_framework.DjangoFilterBackend",
        "rest_framework.filters.SearchFilter",
        "rest_framework.filters.OrderingFilter",
    ),
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.PageNumberPagination",
    "PAGE_SIZE": 20,
}


JAZZMIN_SETTINGS = {
    "site_title": "ShebaCheck Admin", "site_header": "ShebaCheck", "site_brand": "ShebaCheck",
    "welcome_sign": "Welcome to the ShebaCheck administration panel", "copyright": "ShebaCheck",
}


SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=int(os.getenv("JWT_ACCESS_TOKEN_MINUTES", "60"))),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=int(os.getenv("JWT_REFRESH_TOKEN_DAYS", "30"))),
    "ROTATE_REFRESH_TOKENS": True, "BLACKLIST_AFTER_ROTATION": True, "UPDATE_LAST_LOGIN": True,
}
