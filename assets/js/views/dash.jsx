import React from 'react';

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
            <span class="card-title">{this.props.date}</span>
            <span class="card-title">{this.props.title}</span>
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

export default class Dash extends React.Component {
  renderCards() {
    let cards = [
      {
        title: 'Hackathon',
        date: '2/3/2018',
        imageUrl: 'http://www.developerweek.com/wp-content/uploads/2015/11/hackaton-banner-badge.png'
      },
      {
        title: 'Football',
        date: '2/3/2018',
        imageUrl: 'https://images-na.ssl-images-amazon.com/images/I/81DBe4NVTiL._SL1500_.jpg'
      }
    ];
    return cards.map(x => {
      return <Card
        title={x.title}
        date={x.date}
        imageUrl={x.imageUrl}
      />
    });
  }
  render() {

    return (<div className={"dash-container"}>
      <div className={"row"}>
        <div className={"create-button col"}>
          <a class="waves-effect waves-light btn">Create New Trip</a>
        </div>
      </div>
      {/*<div className={"create-button"}>Create New Trip</div>*/}
      {this.renderCards()}
    </div>);
  }
}
