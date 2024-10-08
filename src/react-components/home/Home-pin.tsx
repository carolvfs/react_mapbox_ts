import React, { useState } from 'react';
import Map, { Marker, Source, Layer } from 'react-map-gl';
import type { CircleLayer } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const ICON = `M12 0c-4.198 0-8 3.403-8 7.602 0 4.198 3.469 9.21 8 16.398 4.531-7.188 8-12.2 8-16.398 0-4.199-3.801-7.602-8-7.602zm0 11c-1.657 0-3-1.343-3-3s1.343-3 3-3 3 1.343 3 3-1.343 3-3 3z`

  const pinStyle = {
  cursor: "pointer",

  fill: "blue",
  stroke: "white"
};

const size = 40

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

      {/* <svg
        height={size}
        viewBox="0 0 24 24"
        style={{
          ...pinStyle,
          transform: `translate(${-size / 2}px,${-size}px)`
        }}
      >
        <path d={ICON} />
      </svg> */}
      </Marker>

    </Map>
  );
}

export default Home