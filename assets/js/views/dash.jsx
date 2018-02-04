import React from 'react';
import moment from 'moment';
import Link from "react-router-dom/es/Link";

class Card extends React.Component {
  render() {
    return (<div className="row">
      <div className="col">
        <div className="card" onClick={e => {
          // go to detail page
        }}>
          <div className="card-image">
            <img src={this.props.imageUrl}/>
            {/*<span class="card-title">Card Title</span>*/}
          </div>
          <div className="card-content" onClick={e => {
            this.props.tripActions.getItin(this.props.id);
          }}>
              <span className="card-title">{moment(this.props.date).format('DDD MMM YYYY')}</span>
              <span className="card-title">{this.props.name}</span>
              <p>{this.props.description}</p>
          </div>
          <div className="card-action">
            {/*<a href="#">This is a link</a>*/}
          </div>
        </div>
      </div>
    </div>);
  }
}

export default class Dash extends React.Component {
  renderCards() {
    let trips = this.props.tripStore.trips;
    let cards = [
    ];
    cards = cards.concat(trips);
    return cards.map(x => {
      return <Card
        id={x.id}
        name={x.name}
        date={x.start_date}
        imageUrl={x.imageUrl || 'http://www.developerweek.com/wp-content/uploads/2015/11/hackaton-banner-badge.png'}
      />
    });
  }
  render() {
    return (<div className={"dash-container"}>
      <div className={"row"}>
        <div className={"create-button col"}>
          <Link to={"/create_trip"} className="waves-effect waves-light btn">Create New Trip</Link>
        </div>
      </div>
      {/*<div className={"create-button"}>Create New Trip</div>*/}
      {this.renderCards()}
    </div>);
  }
}
