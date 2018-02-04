import ffux from './ffux';
import React from 'react';
import {Switch, Route, BrowserRouter} from 'react-router-dom';
import Listener from './listener';
import Dash from './views/dash.jsx';
import TopNav from './views/topnav.jsx';
import TripStore from './stores/tripStore';
import wrapper from './views/map.jsx';
import CreateTrip from "./views/createTrip.jsx";


class Card extends React.Component {
  render() {
    return (<div className="row">
      <div className="col">
        <div className="card">
          <div className="card-image">
            <img src={this.props.imageUrl}/>
            {/*<span class="card-title">Card Title</span>*/}
          </div>
          <div className="card-content">
            <span className="card-title">{moment(this.props.date).format('DDD MMM YYYY')}</span>
            <span className="card-title">{this.props.name}</span>
            <p>{this.props.description}</p>
          </div>
          <div className="card-action">
            {/*<a href="#">This is a link</a>*/}
            {/*<a href="#">This is a link</a>*/}
          </div>
        </div>
      </div>
    </div>);
  }
}


class Container extends React.Component {
  render() {
    return <div></div>;
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
          <Route exact path={'/create_trip'} component={() => <CreateTrip
            tripStore={this.state.model.state.tripStore}
            tripActions={this.state.model.actions.tripStore}
          />}/>
          <Route exact path={'/maptest'}
                 component={() => <TomTom/>}
          />
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