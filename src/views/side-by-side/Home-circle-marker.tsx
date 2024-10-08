import React, { useState } from 'react';
import Map, { Marker } from 'react-map-gl';
import type { CircleLayer } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

function Home() {

  const [viewState, setViewState] = useState({
    latitude: 37.7577,
    longitude: -122.4376,
    zoom: 8,
  });

  const [selectedPoint, setSelectedPoint] = useState(null);

  const handleMarkerClick = (point:any) => {
    setSelectedPoint(point);
    console.log('Marker clicked:', point);
  };


const geojson = {
  type: 'FeatureCollection',
  features: [
    {type: 'Feature', geometry: {type: 'Point', coordinates: [-122.4, 37.8]}}
  ]
};

const geojson2 = {
  type: 'FeatureCollection',
  features: [
    {type: 'Feature', geometry: {type: 'Point', coordinates: [-121, 37]}}
  ]
};

const geojsonArr = [geojson2, geojson]

const layerStyle: CircleLayer = {
  id: 'point',
  type: 'circle',
  paint: {
    'circle-radius': 10,
    'circle-color': 'red'
  }
};

  
  return (
    <Map
      mapboxAccessToken="pk.eyJ1IjoiY2Fyb2x2ZnMiLCJhIjoiY2x2MmplZ3pwMGltazJscGMyeTNwdTlmMSJ9.WXeQtHjwp8ap2Fiz6RD8Xg"
      {...viewState}
      style={{width: "100vw", height: "100vh", position: "relative"}}
      onMove={evt => setViewState(evt.viewState)}
      mapStyle="mapbox://styles/mapbox/streets-v11"
    >

      {geojsonArr && geojsonArr.map((g, i) =>
        g.features.map((point, j) => (
          <Marker
            key={`marker-${i}-${j}`}
            longitude={point.geometry.coordinates[0]}
            latitude={point.geometry.coordinates[1]}
          >
            <div
              onClick={() => handleMarkerClick(point)}
              style={{
                width: `${layerStyle.paint['circle-radius'] * 2}px`,
                height: `${layerStyle.paint['circle-radius'] * 2}px`,
                borderRadius: '50%',
                backgroundColor: layerStyle.paint['circle-color'],
                cursor: 'pointer',
              }}
            />
          </Marker>
        ))
      )}

    </Map>
  );
}

export default Home