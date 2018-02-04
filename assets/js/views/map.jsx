import React, {PropTypes as T} from 'react'
import ReactDOM from 'react-dom'

import cache from '../lib/ScriptCache'
import Api from '../lib/api'

const defaultMapConfig = {};
export const wrapper = (options) => (WrappedComponent) => {
  const apiKey = options.apiKey;

  class Wrapper extends React.Component {
    constructor(props, context) {
      super(props, context);

      this.state = {
        loaded: false,
        map: null,
        tomtom: null
      };
    }
    componentDidMount() {
      const refs = this.refs;
      const tomtom = window.tomtom;
      const props = Object.assign({}, this.props, {
        loaded: this.state.loaded
      });

      const mapRef = refs.map;

      const node = ReactDOM.findDOMNode(mapRef);
      // center

      // map config

      tomtom.setProductInfo('Twin Ravens', '0.0.1');
      this.map = tomtom.map(node, {
        key: apiKey,
        center: [41, -96],  // America
        zoom: 4,
        layers: [
          tomtom.L.tileLayer.wms(`https://api.tomtom.com/map/1/wms/?key=${apiKey}`, {
            layers: 'basic',
            format: 'image/jpeg'
          })
        ],
        source: 'vector',
        basePath: '/static'
      });

      this.setState({
        loaded: true,
        map: this.map,
        tomtom: window.tomtom
      });
    }
    componentWillMount() {
      // this.scriptCache = cache({
      //   tomtom: Api({
      //     apiKey: apiKey
      //   })
      // });
    }
    render() {
      const props = Object.assign({}, this.props, {
        loaded: this.state.loaded,
        map: this.state.map,
        tomtom: this.state.tomtom,
        mapComponent: this.refs.map
      });
      return <div>
        <WrappedComponent {...props}/>
        <div id="parent">
          <div id="map" ref="map" className="use-all-space"/>
        </div>
      </div>;
    }
  }
  return Wrapper;
};

export default wrapper;
