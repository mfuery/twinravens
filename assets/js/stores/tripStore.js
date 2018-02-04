import {loadingAjax, transform} from "../lib/utils";
import {createStore} from "../ffux";


export default createStore({
  actions: ['init'],
  state: (initialState, {init}) => {
    return transform({
        user_info: null,
        loading: true,
      },
      init, (prev, res) => {
        prev = load(prev, res);
        prev.user_info = res;
        return prev;
      });

    function load(prev, res) {
      if (res.loading) {
        prev.loading = true;
        return prev;
      } else {
        prev.loading = false;
        return prev;
      }
    }
  }
})
