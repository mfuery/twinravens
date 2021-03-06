from django.http import Http404
from rest_framework import generics, mixins, status, viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView

from core.models import Location, Stop, Trip, User, Gps
from .serializers import LocationSerializer, StopSerializer, TripSerializer, \
    UserSerializer, GpsSerializer, CreateTripSerializer, CreateStopSerializer


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

    def create(self, request, *args, **kwargs):
        serializer = CreateStopSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


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

    def create(self, request, *args, **kwargs):
        serializer = CreateTripSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


@api_view(['GET'])
def everything(request):
    trips = Trip.objects.all()
    trip_itinerary_data = []
    users = UserSerializer(User.objects.all(), many=True).data
    stops = StopSerializer(Stop.objects.all(), many=True).data
    locations = LocationSerializer(Location.objects.all(), many=True).data
    for trip in trips:
        try:
            trip_itinerary_data.append(TripSerializer(trip).data),

        except Trip.DoesNotExist:
            continue

    if request.method == 'GET':
        return Response({'trips': trip_itinerary_data, 'users': users, 'stops': stops, 'locations': locations})


@api_view(['GET'])
def trip_itinerary(request, trip_pk):
    """
    Retrieve, update or delete a code snippet.
    """
    try:
        trip = Trip.objects.get(pk=trip_pk)

    except Trip.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = TripSerializer(trip)
        return Response(serializer.data)

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
