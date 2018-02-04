from django.http import Http404
from rest_framework import generics, mixins, status, viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView

from core.models import Location, Stop, Trip, User, Gps
from core.serializers import GuestSerializer, GpsSerializer
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


class StopDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Stop.objects.all()
    serializer_class = StopSerializer


class LocationViewSet(viewsets.ModelViewSet):
    """
    This viewset automatically provides `list` and `detail` actions.
    """
    queryset = Location.objects.all().order_by('name')
    serializer_class = LocationSerializer


class LocationDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Location.objects.all()
    serializer_class = LocationSerializer


class TripViewSet(viewsets.ModelViewSet):
    """
    This viewset automatically provides `list` and `detail` actions.
    """
    queryset = Trip.objects.all()
    serializer_class = TripSerializer


@api_view(['GET'])
def everything(request):
    trips = Trip.objects.all()
    users = User.objects.all()
    stops = Stop.objects.all()
    locations = Location.objects.all()
    return Response({
        'trips': TripSerializer(trips, many=True).data,
        'users': GuestSerializer(users, many=True).data,
        'stops': StopSerializer(stops, many=True).data,
        'locations': LocationSerializer(locations, many=True).data,
    })


@api_view(['GET'])
def trip_itinerary(request, trip_pk):
    """
        Retrieve, update or delete a code snippet.
        """
    try:
        trip = Trip.objects.get(pk=trip_pk)
        guest_list = trip.guests.all()
        stops_list = trip.stops.all().order_by('when')

        trip_itinerary_data = {
            'trip': TripSerializer(trip).data,
        }
        trip_itinerary_data['trip']['guests'] = GuestSerializer(guest_list,
                                                                many=True).data
        trip_itinerary_data['trip']['stops'] = StopSerializer(stops_list,
                                                              many=True).data
    except Trip.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        return Response(trip_itinerary_data)

    return Response(status.HTTP_400_BAD_REQUEST)


class TripDetail(mixins.RetrieveModelMixin,
                 mixins.UpdateModelMixin,
                 mixins.DestroyModelMixin,
                 generics.GenericAPIView):
    queryset = Trip.objects.all()
    serializer_class = TripSerializer

    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)

    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)


@api_view(['GET'])
def gps_all(request):
    records = Gps.objects.all().order_by('-timestamp')
    serializer = GpsSerializer(records, many=True)
    return Response(serializer.data)


@api_view(['GET', 'POST'])
def gps(request):
    if request.method == 'GET':
        records = Gps.objects.raw("""
            SELECT id, user_id, lat, lon, timestamp FROM core_gps
            WHERE timestamp IN (
              SELECT MAX(timestamp) FROM core_gps
              GROUP BY user_id
            )
            GROUP BY id, user_id, lat, lon, timestamp
            ORDER BY timestamp DESC
        """)
        print(len(list(records)))

        serializer = GpsSerializer(records, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = GpsSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class GpsDetail(APIView):
    """
    Retrieve, update or delete a snippet instance.
    """

    def get_object(self, pk):
        try:
            return Gps.objects.get(pk=pk)
        except Gps.DoesNotExist:
            raise Http404

    def get(self, request, pk, format=None):
        snippet = self.get_object(pk)
        serializer = GpsSerializer(snippet)
        return Response(serializer.data)


    # def delete(self, request, pk, format=None):
    #     snippet = self.get_object(pk)
    #     snippet.delete()
    #     return Response(status=status.HTTP_204_NO_CONTENT)
