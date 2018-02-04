from rest_framework import generics, renderers, status, viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response

from core.models import Location, Stop, Trip, User
from core.serializers import GuestSerializer
from .serializers import LocationSerializer, StopSerializer, TripSerializer, \
    UserSerializer


class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer


class StopViewSet(viewsets.ModelViewSet):
    """
    This viewset automatically provides `list` and `detail` actions.
    """
    queryset = Stop.objects.all().order_by('when')
    serializer_class = StopSerializer


class LocationViewSet(viewsets.ModelViewSet):
    """
    This viewset automatically provides `list` and `detail` actions.
    """
    queryset = Location.objects.all().order_by('name')
    serializer_class = LocationSerializer


class TripViewSet(viewsets.ModelViewSet):
    """
    This viewset automatically provides `list` and `detail` actions.
    """
    queryset = Trip.objects.all()
    serializer_class = TripSerializer


class TripItinerary(generics.GenericAPIView):
    queryset = Trip.objects.all()
    renderer_classes = (renderers.StaticHTMLRenderer,)

    def get(self, request, *args, **kwargs):
        snippet = self.get_object()
        return Response(snippet.highlighted)


@api_view(['GET'])
def trip_itinerary(request, trip_pk):
    """
        Retrieve, update or delete a code snippet.
        """
    try:
        guests = []
        stops = []
        trip = Trip.objects.get(pk=trip_pk)
        guest_list = trip.guests.all()
        stops_list = trip.stops.all().order_by('when')

        for a in guest_list:
            guests.append(GuestSerializer(a).data)
        for n in stops_list:
            stops.append(StopSerializer(n).data)

        trip_itinerary_data = {
            'trip': TripSerializer(trip).data,
        }
        trip_itinerary_data['trip']['guests'] = guests
        trip_itinerary_data['trip']['stops'] = stops
    except Trip.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        return Response(trip_itinerary_data)

    # return Response(status.HTTP_400_BAD_REQUEST)
