import React from 'react';

class TestMap extends React.Component {
  render() {
    let searchLoc = this.props.tripStoreActions.searchLoc;
    return (<div>
      <input onClick={e => {
        console.log(e);
      }}></input>
    </div>)
  }
}
