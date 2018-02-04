from .base import *


DATABASES = {
   'default': {
       'ENGINE': 'django.db.backends.postgresql_psycopg2',
       'NAME': 'twinravens',
       'USER': 'twinravens',
       'PORT': '5432'
   }
}

if os.path.exists(os.path.join(os.path.dirname(__file__), 'local_settings.py')):
    from .local_settings import *
