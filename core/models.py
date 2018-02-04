from datetime import datetime

from django.db import models


class User(models.Model):
    """Users are friends"""
    email = models.CharField(max_length=255, unique=True)
    name = models.CharField(max_length=255, unique=True)
    phone = models.CharField(max_length=255, unique=True)
    profile_picture = models.FileField(null=True)
    date_joined = models.DateTimeField(auto_created=True)

    # not needed in MVP
    # friends = models.ManyToManyField("self")


class Location(models.Model):
    """Places on the map"""
    name = models.CharField(max_length=255, default='')
    address = models.CharField(max_length=255, default='')
    icon = models.FileField(null=True)
    lat = models.FloatField(null=True)
    lon = models.FloatField(null=True)


class Stop(models.Model):
    """A destination in a Trip itinerary"""
    location = models.ForeignKey(Location, on_delete=models.CASCADE)
    when = models.DateTimeField(auto_now_add=True)

    # Todo: privacy
    # is_public = models.BooleanField(default=False)


class Trip(models.Model):
    """Trip Itinerary
    If a guest wants to modify itinerary, then a new trip is created for you
    """
    name = models.CharField(max_length=255, default='')
    start_datetime = models.DateTimeField(auto_now_add=True)
    end_datetime = models.DateTimeField(auto_now_add=True)
    guests = models.ManyToManyField(User, related_name='guests')
    host = models.ForeignKey(User, on_delete=models.CASCADE, related_name='host')
    stops = models.ManyToManyField(Stop, blank=True)


class Gps(models.Model):
    lat = models.FloatField()
    lon = models.FloatField()
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    timestamp = models.DateTimeField(default=datetime.now)
