import ffux from './ffux';
import React from 'react';
import {Switch, Route, BrowserRouter} from 'react-router-dom';
import Listener from './listener';
import Dash from './views/dash.jsx';
import TopNav from './views/topnav.jsx';
import TripStore from './stores/tripStore';
import wrapper from './views/map.jsx';

class Container extends React.Component {
  render() {
    return <div>TomTom Map</div>;
  }
}
const TomTom = wrapper({apiKey: 'c26Y46QwvfTgsAirK4Nh0w8YokZJ3XGq'})(Container);


class App extends Listener {
  render() {
    // set up loading state
    if (true) {
      // component routes here
      return (<div className="app-container">
        <TopNav/>
        <Switch>
          <Route exact path={'/'} component={() => <Dash
            tripStore={this.state.model.state.tripStore}
          />}/>
          <Route exact path={'/maptest'}
                 component={() => <TomTom/>} />
          {/*<Route path={urls.ESTIMATES} component={() => <SampleCompoent*/}
          {/*/>}/>*/}
        </Switch>
      </div>);
    } else {
      return (<div>Loading...</div>);
    }
  }
}

export default class AppWrapper extends React.Component {
  render() {
    let initialState={};
    return (<BrowserRouter>
        <App initialState={initialState}
          dispatcher={state => {
            return ffux({
              tripStore: TripStore({}),
            });
          }}/>
    </BrowserRouter>);
  }
}