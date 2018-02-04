from rest_framework import serializers

from core.models import Location, Stop, Trip, User


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = (
            'id', 'email', 'name', 'phone', 'profile_picture', 'friends',
            'date_joined',
        )


class StopSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stop
        fields = (
            'id', 'location', 'when',
        )


class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = (
            'id', 'name', 'address', 'icon', 'lat', 'lon',
        )


class TripSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trip
        fields = (
            'id', 'name', 'start_datetime', 'end_datetime', 'guests',
            'stops',
        )
