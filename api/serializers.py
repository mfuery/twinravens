from rest_framework import serializers

from core.models import Gps, Location, Stop, Trip, User


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = '__all__'


class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = '__all__'


class StopSerializer(serializers.ModelSerializer):
    location = LocationSerializer()

    class Meta:
        model = Stop
        fields = '__all__'


class TripSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trip
        fields = '__all__'


class GpsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Gps
        fields = '__all__'
