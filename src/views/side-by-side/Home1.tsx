import * as React from 'react';
import Map from 'react-map-gl';

function Home() {
  return (
    <Map
      mapboxAccessToken="pk.eyJ1IjoiY2Fyb2x2ZnMiLCJhIjoiY2x2MmplZ3pwMGltazJscGMyeTNwdTlmMSJ9.WXeQtHjwp8ap2Fiz6RD8Xg"
      initialViewState={{
        longitude: -122.4,
        latitude: 37.8,
        zoom: 14
      }}
      style={{width: 600, height: 400}}
      mapStyle="mapbox://styles/mapbox/streets-v9"
    />
  );
}

export default Home