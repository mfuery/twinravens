from .base import *
import dj_database_url

# SECURITY WARNING: keep the secret key used in production secret!
# python 3 doesn't support dotenv
# SECRET_KEY = dotenv.get('SECRET_KEY')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = False

# Update database configuration with $DATABASE_URL.
db_from_env = dj_database_url.config(conn_max_age=500)
DATABASES['default'].update(db_from_env)

ALLOWED_HOSTS = [
    '*'
]

# Simplified static file serving.
# https://warehouse.python.org/project/whitenoise/
# STATICFILES_STORAGE = 'whitenoise.django.GzipManifestStaticFilesStorage'

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'root': {
        'level': 'INFO',
        'handlers': ['console'],
    },
    'formatters': {
        'simple': {
            'format': '%(message)s'
        },
        'verbose': {
            'format': '[%(levelname)s - %(created)s], file:%(module)s.py, func:%(funcName)s, ln:%(lineno)s: %(message)s'
        },
    },
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },

    'loggers': {
        # 'django.db.backends': {
        #     'handlers': ['console'],
        #     'level': 'DEBUG'
        # }
    }
}

WEBPACK_LOADER = {
    'DEFAULT': {
        'CACHE': False,
        'POLL_INTERVAL': 0.5,
        'TIMEOUT': None,
        'IGNORE': ['.+\.hot-update.js', '.+\.map'],
    }
}

WEBPACK_LOADER.update({
    'PROD': {
        'BUNDLE_DIR_NAME': base_dir_join(BASE_DIR, 'assets', 'js', 'build/'),
        'STATS_FILE': base_dir_join('webpack-stats-prod.json')
    }
})
