import {ajax, transform} from "../lib/utils";
import {createStore} from "../ffux";
import kefir from 'kefir';


export default createStore({
  actions: ['createTrip', 'searchLoc'],
  state: (initialState, {createTrip, searchLoc}) => {
    let init = ajax('/api/everything', null, 'GET').map(x => x);
    let searchLocStream = searchLoc.flatMap(x => {
      let p = tomtom.fuzzySearch().key("c26Y46QwvfTgsAirK4Nh0w8YokZJ3XGq").query(x).go();
      return kefir.fromPromise(p);
    }).onValue(x => {
      console.log(x);
    });

    let createTripStream = createTrip.flatMap(x => {
      console.log(x);
      return ajax('/api/trips', x);
    }).map(x => x);

    return transform({
        trips: [],
        users: [],
        locations: [],
        stops: [],
        loading: true,
      },
      createTripStream, (prev, res) => {
        console.log(res);
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
