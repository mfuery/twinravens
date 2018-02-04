import ffux from './ffux';
import React from 'react';
import {Switch, Route, BrowserRouter} from 'react-router-dom';
import Listener from './listener';
import Dash from './views/dash.jsx';
import TopNav from './views/topnav.jsx';
import TripStore from './stores/tripStore';
import wrapper from './views/map.jsx';
import CreateTrip from "./views/createTrip.jsx";
import moment from 'moment';


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
            <span className="card-title">{moment(this.props.date).format('MMMM Do YYYY, h:mm:ss a')}</span>
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
    const cards = this.props.tripStore.stops;
    return <div>
      {cards.map(x => {
        return <Card key={x.id}
                     id={x.id}
                     description={x.location.address}
                     name={x.location.name}
                     date={x.when}
                     imageUrl={'http://www.developerweek.com/wp-content/uploads/2015/11/hackaton-banner-badge.png'} />;
      })}
    </div>;
  }
}
const TomTom = wrapper({apiKey: 'c26Y46QwvfTgsAirK4Nh0w8YokZJ3XGq'})(Container);


class App extends Listener {
  render() {
    // set up loading state
    if (true) {
      // component routes here
      const tripStore = this.state.model.state.tripStore;
      const tripActions = this.state.model.actions.tripStore;
      return (<div className="app-container">
        <TopNav/>
        <Switch>
          <Route exact path={'/'} component={() => <Dash
            tripStore={tripStore}
          />}/>
          <Route exact path={'/create_trip'} component={() => <CreateTrip
            tripStore={tripStore}
            tripActions={tripActions}
          />}/>
          <Route exact path={'/maptest'}
                 component={() => {
                   const stops = tripStore.stops;
                   const first = stops[0];
                   let center;
                   if (first)
                     center = {lat: first.location.lat, lng: first.location.lon};
                   const locations = stops.map(x => {
                     return {lat: x.location.lat, lng: x.location.lon};
                   });
                   // const locations = [
                   //   {lat: 37.832619, lng: -122.480118}, // golden gate
                   //   {lat: 37.802706, lng: -122.405904}, // coit
                   //   {lat: 37.795403, lng: -122.393640}, // ferry
                   //   {lat: 37.785650, lng: -122.401130}]; // moma
                   // const locations = [{lat: 51.63685, lng: 19.4171}, {lat: 52.23498, lng: 21.00849}];
                   return <TomTom tripStore={tripStore}
                                  tripActions={tripActions}
                                  center={center} locations={locations} />;
                 }}
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