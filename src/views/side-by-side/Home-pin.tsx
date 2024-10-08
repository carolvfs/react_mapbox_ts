import React, { useState } from 'react';
import Map, { Marker } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

function Home() {

  const [viewState, setViewState] = useState({
    latitude: 37.7577,
    longitude: -122.4376,
    zoom: 8,
  });

  return (
    <Map
      mapboxAccessToken="pk.eyJ1IjoiY2Fyb2x2ZnMiLCJhIjoiY2x2MmplZ3pwMGltazJscGMyeTNwdTlmMSJ9.WXeQtHjwp8ap2Fiz6RD8Xg"
      {...viewState}
      style={{width: "100vw", height: "100vh", position: "relative"}}
      onMove={evt => setViewState(evt.viewState)}
      mapStyle="mapbox://styles/mapbox/streets-v11"
    >
      <Marker longitude={-122} latitude={37.5} anchor="bottom" >
        <img src={"https://unpkg.com/leaflet@1.5.1/dist/images/marker-icon.png"}></img>
      </Marker>

    </Map>
  );
}

export default Home