import {ajax, transform} from "../lib/utils";
import {createStore} from "../ffux";
import kefir from 'kefir';


export default createStore({
  actions: ['createTrip', 'searchLoc', 'getItin'],
  state: (initialState, {createTrip, searchLoc, getItin}) => {
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
      x['stops'] = [1];
      return ajax('/api/trips/', x);
    });

    let getItinStream = getItin.flatMap(x => {
      return ajax(`/api/trip-itinerary/${x}/`, null, 'GET');
    });

    return transform({
        trips: [],
        users: [],
        locations: [],
        stops: [],
        itin: null,
        loading: true,
      },
      createTripStream, (prev, res) => {
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
        prev.trips = res.trips;
        prev.users = res.users;
        prev.locations = res.locations;
        prev.stops = res.stops;
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
