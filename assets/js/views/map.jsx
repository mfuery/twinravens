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
      this.tomtom = tomtom;
      const props = Object.assign({}, this.props, {
        loaded: this.state.loaded
      });

      const mapRef = refs.map;

      const node = ReactDOM.findDOMNode(mapRef);
      // center

      // map config
      const center = this.props.center || [41, -96];

      tomtom.setProductInfo('Twin Ravens', '0.0.1');
      tomtom.routingKey(apiKey);
      tomtom.searchKey(apiKey);
      this.map = tomtom.map(node, {
        key: apiKey,
        center: center,  // America
        zoom: 8,
        layers: [
          tomtom.L.tileLayer.wms(`https://api.tomtom.com/map/1/wms/?key=${apiKey}`, {
            layers: 'basic',
            format: 'image/jpeg'
          })
        ],
        source: 'vector',
        basePath: '/static'
      });

      tomtom.routeOnMap({
        onEachFeature: this.bindPopups.bind(this),
        serviceOptions: {
          maxAlternatives: 2,
          traffic: true
        }
      })
        .addTo(this.map)
        .draw(this.props.locations);

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
    buildPopupMessage({lengthInMeters, travelTimeInSeconds, trafficDelayInSeconds}) {
      const distance = tomtom.unitFormatConverter.formatDistance(lengthInMeters);
      const time = tomtom.unitFormatConverter.formatTime(travelTimeInSeconds);
      const delay = tomtom.unitFormatConverter.formatTime(trafficDelayInSeconds);
      return [
        `Distance: ${distance}`,
        `Estimated travel time: ${time}`,
        `Traffic delay: ${delay}`,
      ].join('<br/>');
    }
    bindPopups(feature, layer) {
      layer.on('mouseover', e => {
        this.tomtom.L.popup()
          .setLatLng(e.latlng)
          .setContent(this.buildPopupMessage(feature.properties.summary))
          .openOn(this.map);
      });
    }
    render() {
      const props = Object.assign({}, this.props, {
        loaded: this.state.loaded,
        map: this.state.map,
        tomtom: this.state.tomtom,
        mapComponent: this.refs.map
      });
      return <div>
        <div id="parent">
          <div id="map" ref="map" className="use-all-space"/>
        </div>
        <WrappedComponent {...props}/>
      </div>;
    }
  }
  return Wrapper;
};

export default wrapper;
