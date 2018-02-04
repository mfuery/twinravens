from django.conf.urls import include
from django.urls import path, re_path
from rest_framework import routers

from .views import LocationViewSet, StopViewSet, TripDetail, TripViewSet, \
    UserViewSet, trip_itinerary, everything

user_list = UserViewSet.as_view({
    'get': 'list'
})
user_detail = UserViewSet.as_view({
    'get': 'retrieve'
})

"""Because we're using viewsets instead of views, we can automatically generate 
the URL conf for our API, by simply registering the viewsets with a router 
class.

Again, if we need more control over the API URLs we can simply drop down to 
using regular class-based views, and writing the URL conf explicitly."""
router = routers.DefaultRouter()
router.register('guests', UserViewSet)
router.register('locations', LocationViewSet)
router.register('stops', StopViewSet)
router.register('trips', TripViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('everything/', everything),
    path('api-auth/', include('rest_framework.urls'), name='rest_framework'),
    re_path('trip-itinerary/(?P<trip_pk>[0-9])/', trip_itinerary),
    re_path('trips/(?P<trip_pk>[0-9])/', TripDetail.as_view()),
    re_path('trips/(?P<trip_pk>[0-9])/', TripDetail.as_view()),
]
