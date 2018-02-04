# Twin Ravens
  
Travel planning with friends with real-time updates on location and ETA.
  
## Dev Setup

```
pip install -r requirements.txt
npm install
./manage.py migrate
./manage.py loaddata data.json
./manage.py runserver
```

## API
  
```
http://127.0.0.1:8000/api/

GET /api/
HTTP 200 OK
Allow: GET, HEAD, OPTIONS
Content-Type: application/json
Vary: Accept

{
    "guests": "http://127.0.0.1:8000/api/guests/",
    "locations": "http://127.0.0.1:8000/api/locations/",
    "stops": "http://127.0.0.1:8000/api/stops/",
    "trips": "http://127.0.0.1:8000/api/trips/"
}
  
http://127.0.0.1:8000/api/trip-itinerary/1/
  
{
  "trip": {
      "id": 1,
      "name": "Sakura Trip",
      "start_datetime": "2018-04-05T00:00:00Z",
      "end_datetime": "2018-04-16T00:00:00Z",
      "guests": [
          {
              "id": 1,
              "email": "mfuery@gmail.com",
              "name": "Michael F.",
              "profile_picture": null
          },
          {
              "id": 2,
              "email": "porfirio84@gmail.com",
              "name": "Julian T.",
              "profile_picture": null
          },
          {
              "id": 3,
              "email": "jkang@email.com",
              "name": "John K.",
              "profile_picture": null
          },
          {
              "id": 4,
              "email": "emily@email.com",
              "name": "Emily S.",
              "profile_picture": null
          }
      ],
      "stops": [
          {
              "id": 1,
              "location": 1,
              "when": "2018-02-04T01:18:54.926179Z"
          },
          {
              "id": 2,
              "location": 2,
              "when": "2018-02-04T01:18:58.671911Z"
          },
          {
              "id": 3,
              "location": 3,
              "when": "2018-02-04T01:19:03.857938Z"
          },
          {
              "id": 4,
              "location": 4,
              "when": "2018-02-04T01:19:07.816063Z"
          }
      ]
  }
}
  ```