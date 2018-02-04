import {ajax, transform} from "../lib/utils";
import {createStore} from "../ffux";


export default createStore({
  actions: ['init', 'createTrip'],
  state: (initialState, {createTrip}) => {
    let init = ajax('/api/trips', null, 'GET').map(x => x);

    let createTripStream = createTrip.flatMap(x => {
        return ajax('/api/trips', JSON.stringify({}));
    });
    return transform({
        trips: [],
        loading: true,
      },
      createTripStream, (prev, res) => {
        // prev = load(prev, res);
        return prev;
      },
      init, (prev, res) => {
        // prev = load(prev, res);
        prev.trips = res;
        return prev;
      });

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
