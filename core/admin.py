from django.contrib import admin

from core.models import Gps, Location, Stop, Trip, User

admin.site.register(User)
admin.site.register(Location)
admin.site.register(Stop)
admin.site.register(Trip)
admin.site.register(Gps)
