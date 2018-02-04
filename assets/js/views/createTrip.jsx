import React from 'react';
import moment from 'moment';
import {InputForm, CheckBoxes, SearchLocForm, DatePicker} from './inputForm.jsx';

export default class CreateTrip extends React.Component {
  constructor(props, state) {
    super();
    let users = props.tripStore.users;
    let userIndex = users.reduce((acc, x) => {
      acc[x.id] = false;
      return acc;
    }, {});
    this.state = {
      name: null,
      userIndex: userIndex,
      stage: 1,
      currLoc: 1,
      stops: [],
    }
  }
  setName(val) {
    this.setState({name: val});
  }
  setLoc(val) {
    this.setState({loc: val});
    this.props.tripActions.searchLoc(val);
  }
  setStartDate(val) {
    this.setState({startDate: val});
  }
  setEndDate(val) {
    this.setState({endDate: val});
  }
  setStopStart(val) {
    this.setState({stopStartDate: val});
  }
  setStopEnd(val) {
    this.setState({stopEndDate: val});
  }
  setGuests(val) {
    let userIndex = this.state.userIndex;
    userIndex[val.id] = val.checked;
  }
  renderStops() {
    return this.props.tripStore.createdStops.map(x => {
      // return this.state.stops.map(x => {
      return <div>
        {x.name}
        {moment(x.when).format('YYYY-MM-DD HH:mm A')}
        </div>
    });
    // return this.props.tripStore.locations.map(x => {
    //   return <div onClick={e => {this.props.tripActions.deleteStop(x.id)}}>{x.name}</div>;
    // });
  }
  setWhen(val) {
    this.setState({
      when: val,
    });
  }
  setLocId() {
    this.setState({currLoc: this.state.currLoc++});
  }
  addStop({name}) {
    let stops = this.state.stops;
    stops.push({name: name});
    this.setState({stops: stops});
  }
  render() {
    if (this.props.tripStore.stage === 2) {
      let lastCreated = this.props.tripStore.lastCreated;
      return (<div className={"form-container"}>
        <div className={"form-container-inner"}>
          <h1>{lastCreated.name}</h1>
          {this.renderStops()}
          <SearchLocForm
            placeholder={"Stop"}
            onInput={this.setLoc.bind(this)}
          />
          <DatePicker
            placeholder={"When"}
            onInput={this.setWhen.bind(this)}
          />
          <div className={"create-button col"} onClick={e => {
            this.props.tripActions.createStopInMem({name: this.state.loc, when: this.state.when});
            // this.props.tripActions.createStop({
            //   when: this.state.when,
            //   id: this.state.currLoc,
            // });
            // this.setLocId();
          }}>
            Add Stop
          </div>
        </div>
      </div>);
    }  else {
      return (<div className={"form-container"}>
        <div className={"form-container-inner"}>
          <InputForm
            placeholder={"Name"}
            onInput={this.setName.bind(this)}
          />
          <DatePicker
            placeholder={"Start Date Time"}
            onInput={this.setStartDate.bind(this)}
          />
          <DatePicker
            placeholder={"End Date Time"}
            onInput={this.setEndDate.bind(this)}
          />

          <CheckBoxes
            choices={this.props.tripStore.users}
            onInput={this.setGuests.bind(this)}
          />
          <div className={"create-button col"} onClick={e => {
            let guests = [];
            let userIndex = this.state.userIndex;
            for (let userId in userIndex) {
              if (userIndex[userId]) {
                guests.push(userId);
              }
            }
            let name = this.state.name;
            let startDate = this.state.startDate;
            let endDate = this.state.endDate;
            let stop = this.state.loc;
            this.props.tripActions.createTrip({
              guests: guests.map(x => parseInt(x)),
              name: name,
              start_datetime: startDate,
              end_datetime: endDate,
              // stops: stop,
            });
          }}>
            <a className="waves-effect waves-light btn">Create New Trip</a>
          </div>
        </div>
      </div>);
    }
  }
}