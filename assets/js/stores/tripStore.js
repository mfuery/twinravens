import {ajax, transform} from "../lib/utils";
import {createStore} from "../ffux";
import kefir from 'kefir';


export default createStore({
  actions: ['createTrip', 'searchLoc', 'getItin', 'deleteStop', 'getUsers', 'createStop', 'createStopInMem'],
  state: (initialState, {createTrip, searchLoc, getItin, deleteStop, getUsers, createStop, createStopInMem}) => {
    let init = ajax('/api/everything/', null, 'GET').map(x => x);

    let searchLocStream = searchLoc.flatMap(x => {
      let p = tomtom.fuzzySearch().key("c26Y46QwvfTgsAirK4Nh0w8YokZJ3XGq").query(x).go();
      return kefir.fromPromise(p);
    }).onValue(x => {
      console.log(x);
    });

    let createTripStream = createTrip.flatMap(x => {
      console.log(x);
      x['host'] = 1;
      x['stops'] = [];
      return ajax('/api/trips/', x);
    });

    let getItinStream = getItin.flatMap(x => {
      return ajax(`/api/trip-itinerary/${x}/`, null, 'GET');
    });

    let deleteStopStream = deleteStop.flatMap(x => {
      return ajax(`/api/locations/${x}/`, null, 'DELETE')
    });

    let getUsersStream = getUsers.flatMap(x => {
      return ajax('/api/users/', null, 'GET')
    });

    let makeStopStream = createStop.flatMap(x => {
      return ajax(`/api/stops/`, {
        location: x.id,
        when: x.when,
      });
    });

    return transform({
        trips: [],
        users: [],
        locations: [],
        stops: [],
        itin: null,
        loading: true,
        stage: 1,
        lastCreated: null,
        createdStops: [],
      },
      createStopInMem, (prev, res) => {
        prev.createdStops.push(res);
        return prev;
      },
      createTripStream, (prev, res) => {
        prev.stage = 2;
        prev.lastCreated = res;
        return prev;
      },
      makeStopStream, (prev, res) => {
        return prev;
      },
      getUsersStream, (prev, res) => {
        return prev;
      },
      deleteStopStream, (prev, res) => {
        console.log(res);
        return prev;
      },
      getItinStream, (prev, res) => {
        console.log(res);
        prev.itin = res;
        prev.itinPage = res.id;
        return prev;
      },
      init, (prev, res) => {
        // prev.trips = res.trips;
        // prev.users = res.users;
        // prev.locations = res.locations;
        // prev.stops = res.stops;
        prev.trips = res.trips;
        prev.users = res.users;
        prev.stops = res.stops;
        prev.locations = res.locations;
        return prev;
      }
    );

    // function load(prev, res) {
    //   if (res.loading) {
    //     prev.loading = true;
    //     return prev;
    //   } else {
    //     prev.loading = false;
    //     return prev;
    //   }
    // }
  }
})
