from rest_framework.serializers import ModelSerializer

from core.models import Stop, Trip, User


class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'


class TripSerializer(ModelSerializer):
    class Meta:
        model = Trip
        fields = '__all__'


class GuestSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'name', 'profile_picture',)


class StopSerializer(ModelSerializer):
    class Meta:
        model = Stop
        fields = '__all__'
