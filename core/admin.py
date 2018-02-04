from django.contrib import admin

from core.models import Location, Trip, User, Stop

admin.site.register(User)
admin.site.register(Location)
admin.site.register(Stop)
admin.site.register(Trip)
