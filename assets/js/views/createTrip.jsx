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
  setGuests(val) {
    console.log(val);
    let userIndex = this.state.userIndex;
    userIndex[val.id] = val.checked;
  }
  render() {
    return (<div className={"form-container"}>
      <div className={"form-container-inner"}>
        <InputForm
          placeholder={"Name"}
          onInput={this.setName.bind(this)}
        />
        <SearchLocForm
          placeholder={"Stop"}
          onInput={this.setLoc.bind(this)}
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
            guests: guests,
            name: name,
            start_datetime: startDate,
            end_datetime: endDate,
            stop: stop,
          });
        }}>
          <a className="waves-effect waves-light btn">Create New Trip</a>
        </div>
      </div>
    </div>);
  }
}