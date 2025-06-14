from pathlib import Path
from datetime import timedelta
import os
from dotenv import load_dotenv  # ✅ YES, if you installed python-dotenv

SITE_ID = 1
BASE_DIR = Path(__file__).resolve().parent.parent

# Load environment choice from default .env if it exists
load_dotenv(dotenv_path=BASE_DIR / '.env', override=False)

# Then load environment-specific settings
env = os.getenv("ENV", "development").lower()

if env == "production":
    load_dotenv(dotenv_path=BASE_DIR / '.env.production', override=True)
elif env == "development":
    load_dotenv(dotenv_path=BASE_DIR / '.env.development', override=True)

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
print("🔑 Loaded OpenAI Key from .env:", OPENAI_API_KEY)

SECRET_KEY = os.getenv('SECRET_KEY', 'fallback-key')

DEBUG = os.getenv('DEBUG', 'False') == 'True'

ALLOWED_HOSTS = os.getenv('ALLOWED_HOSTS', '127.0.0.1,localhost').split(',')

EMAIL_BACKEND = os.environ.get('EMAIL_BACKEND', 'django.core.mail.backends.smtp.EmailBackend')  # Default to SMTP backend
EMAIL_HOST = os.environ.get('EMAIL_HOST', 'smtp.example.com')  # Set your fallback
EMAIL_PORT = int(os.environ.get('EMAIL_PORT', 587))  # Default to 587 for TLS
EMAIL_USE_TLS = os.environ.get('EMAIL_USE_TLS', 'True') == 'True'  # Ensures bool
EMAIL_HOST_USER = os.environ.get('EMAIL_HOST_USER', '')
EMAIL_HOST_PASSWORD = os.environ.get('EMAIL_HOST_PASSWORD', '')
DEFAULT_FROM_EMAIL = os.environ.get('DEFAULT_FROM_EMAIL', 'webmaster@localhost')

# Application definition
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'my_apps',
    'rest_framework',
    'corsheaders',
    'dj_rest_auth',
    'dj_rest_auth.registration',
    'rest_framework.authtoken',
    'django.contrib.sites',   
    'allauth',
    'allauth.account',
    'allauth.socialaccount',
    'storages',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware', 
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'allauth.account.middleware.AccountMiddleware', 
    'my_apps.middleware.DisableCSRF',
]

ROOT_URLCONF = 'django_project.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'templates')],  # Make sure this points to your folder
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
                'my_apps.context_processors.user_role',  # ✅ Add this
            ],
        },
    },
]

WSGI_APPLICATION = 'django_project.wsgi.application'


# Database
# https://docs.djangoproject.com/en/5.1/ref/settings/#databases

USE_SQLITE = os.getenv('USE_SQLITE', 'False').lower() == 'true'
ENV = os.getenv('ENV', 'local').lower()  # 'azure' or 'local'

if USE_SQLITE:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }
else:
    #For Cloud Production and Deployment
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.mysql',
            'NAME': os.getenv('DB_NAME', 'capstone_db'),
            'USER': os.getenv('DB_USER', 'capstone_user@pawfect-mysql') if ENV == 'azure' else os.getenv('DB_USER', 'capstone_user'),
            'PASSWORD': os.getenv('DB_PASSWORD', 'Securepassword123'),
            'HOST': os.getenv('DB_HOST', 'pawfect-mysql.mysql.database.azure.com') if ENV == 'azure' else os.getenv('DB_HOST', 'mysql-db'),
            'PORT': os.getenv('DB_PORT', '3306'),
        }
    }

    #For Development Phase
    #DATABASES = {
        #'default': {
            #'ENGINE': 'django.db.backends.mysql',
            #'NAME': os.getenv('DB_NAME', 'capstone_db'),
            #'USER': os.getenv('DB_USER', 'capstone_user'),
            #'PASSWORD': os.getenv('DB_PASSWORD', 'securepassword123'),
            #'HOST': os.getenv('DB_HOST', '127.0.0.1'),
            #'PORT': os.getenv('DB_PORT', '3306'),
        #}
    #}
    
#    if ENV == 'azure':
#        DATABASES['default']['OPTIONS'] = {
#           'ssl': {
#                'ca': os.path.join(BASE_DIR, 'YourCombinedCert.pem')
#            }
#        }


# Password validation
# https://docs.djangoproject.com/en/5.1/ref/settings/#auth-password-validators

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
# https://docs.djangoproject.com/en/5.1/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.1/howto/static-files/

STATIC_URL = '/static/'
STATICFILES_DIRS = [
    BASE_DIR / 'staticfiles',
]
STATIC_ROOT = BASE_DIR / 'staticfiles_build'  # for collectstatic during deployment

# Default primary key field type
# https://docs.djangoproject.com/en/5.1/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:3001",  # If using another port
    "http://127.0.0.1:3000",
    "http://react-frontend:3000",  # Docker container name (React)
    "https://react-ui.icypebble-e6a48936.southeastasia.azurecontainerapps.io",
]

CORS_ALLOW_CREDENTIALS = True

CORS_ORIGIN_WHITELIST = [
    "http://localhost:3000",
    'https://react-ui.icypebble-e6a48936.southeastasia.azurecontainerapps.io',
    "http://127.0.0.1:3000"
]

CSRF_TRUSTED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:8000",      
    "http://127.0.0.1:8000",
    'https://react-ui.icypebble-e6a48936.southeastasia.azurecontainerapps.io',
    'https://django-api.icypebble-e6a48936.southeastasia.azurecontainerapps.io',      
]

CSRF_COOKIE_HTTPONLY = False
CSRF_COOKIE_SAMESITE = 'Lax'
SESSION_COOKIE_HTTPONLY = True
SESSION_COOKIE_SAMESITE = "Lax"
SESSION_COOKIE_SECURE = False  # True if using HTTPS only

AUTHENTICATION_BACKENDS = [
    'django.contrib.auth.backends.ModelBackend',
]

ACCOUNT_LOGIN_METHODS = {'email'}
ACCOUNT_SIGNUP_FIELDS = ['email*', 'password1*', 'password2*']
ACCOUNT_EMAIL_VERIFICATION = 'optional'  # or 'mandatory'
ACCOUNT_UNIQUE_EMAIL = True

LOGIN_URL = '/api/login/'  # or wherever your API login lives

AZURE_ACCOUNT_NAME = "pawfectmediastore"
AZURE_CONTAINER = "media"
AZURE_CUSTOM_DOMAIN = f"{AZURE_ACCOUNT_NAME}.blob.core.windows.net"
DEFAULT_FILE_STORAGE = "django_project.storage_backends.AzureMediaStorage"
AZURE_ACCOUNT_KEY = os.getenv("AZURE_ACCOUNT_KEY")  # store in .env or GitHub secret
AZURE_SSL = True

if DEBUG:
    MEDIA_URL = '/media/'  # Local dev
else:
    MEDIA_URL = f"https://{AZURE_CUSTOM_DOMAIN}/{AZURE_CONTAINER}/"  # Azure prod

if DEBUG:
    MEDIA_ROOT = BASE_DIR / 'media'  # Only needed for local media file handling

    

# Default to local dev, override in prod with environment variable
FRONTEND_BASE_URL = os.getenv("FRONTEND_BASE_URL", "http://localhost:3000")

REACT_URL_PROD = "https://react-ui.icypebble-e6a48936.southeastasia.azurecontainerapps.io"
REACT_URL_DEV = "http://localhost:3000"
REACT_URL = REACT_URL_DEV if DEBUG else REACT_URL_PROD

CACHES = {
    "default": {
        "BACKEND": "django_redis.cache.RedisCache",
        "LOCATION": f"rediss://:{os.getenv('REDIS_KEY')}@{os.getenv('REDIS_HOST')}:6380/0",
        "OPTIONS": {
            "CLIENT_CLASS": "django_redis.client.DefaultClient",
            "SSL": True,
        }
    }
}
