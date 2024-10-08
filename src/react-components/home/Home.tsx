import React, { useState, useCallback, useMemo } from 'react';
import Map, { Marker, Source, Layer } from 'react-map-gl';
import type { CircleLayer } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import ControlPanel, { Mode } from './control-panel'

// https://github.com/visgl/react-map-gl/blob/7.1-release/examples/side-by-side/src/app.tsx
// https://visgl.github.io/react-map-gl/examples/side-by-side

const LeftMapStyle: React.CSSProperties = {
  position: 'absolute',
  width: '40vw',
  height: '100vh'
};
const RightMapStyle: React.CSSProperties = {
  position: 'absolute',
  left: '60%',
  width: '40vw',
  height: '100vh'
};

function Home() {

  const [viewState, setViewState] = useState({
    latitude: 37.7577,
    longitude: -122.4376,
    zoom: 8,
  });

  const [mode, setMode] = useState<Mode>('side-by-side')
  const [activeMap, setActiveMap] = useState<'left' | 'right'>('left');
  
  const onLeftMoveStart = useCallback(() => setActiveMap('left'), []);
  const onRightMoveStart = useCallback(() => setActiveMap('right'), []);
  const onMove = useCallback((evt:any) => setViewState(evt.viewState), []);

  const width = typeof window === 'undefined' ? 100 : window.innerWidth;

  const leftMapPadding = useMemo(() => {
    return {left: mode === 'split-screen' ? width / 2 : 0, top: 0, right: 0, bottom: 0};
  }, [width, mode]);
  const rightMapPadding = useMemo(() => {
    return {right: mode === 'split-screen' ? width / 2 : 0, top: 0, left: 0, bottom: 0};
  }, [width, mode]);

  const [selectedPoint, setSelectedPoint] = useState(null);

  const handleMarkerClick = (point:any) => {
    setSelectedPoint(point);
    // Handle the click event, e.g., open a modal, show details, etc.
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

const geojson3 = {
  type: 'FeatureCollection',
  features: [
    {type: 'Feature', geometry: {type: 'Point', coordinates: [-122.0, 37.1]}}
  ]
};

const geojson4 = {
  type: 'FeatureCollection',
  features: [
    {type: 'Feature', geometry: {type: 'Point', coordinates: [-121.3, 37.5]}}
  ]
};

const geojsonArr = [geojson2, geojson]
const geojsonArr2 = [geojson3, geojson4]

const layerStyle: CircleLayer = {
  id: 'point',
  type: 'circle',
  paint: {
    'circle-radius': 10,
    // 'circle-color': '#007cbf'
    'circle-color': 'red'
  }
};

const layerStyle2: CircleLayer = {
  id: 'point',
  type: 'circle',
  paint: {
    'circle-radius': 10,
    // 'circle-color': '#007cbf'
    'circle-color': 'blue'
  }
};

  
  return (
    <>
    <div style={{position: 'relative', height: '100%'}}>
    {/* <div style={{height: '100%'}}> */}
    <Map
      id="left-map"
      mapboxAccessToken="pk.eyJ1IjoiY2Fyb2x2ZnMiLCJhIjoiY2x2MmplZ3pwMGltazJscGMyeTNwdTlmMSJ9.WXeQtHjwp8ap2Fiz6RD8Xg"
      {...viewState}
      // style={{width: "100vw", height: "100vh", position: "relative"}}
      // onMove={evt => setViewState(evt.viewState)}
      style={LeftMapStyle}
      onMove={activeMap === 'left'&& onMove }
      mapStyle="mapbox://styles/mapbox/streets-v11"
      padding={leftMapPadding}
      onMoveStart={onLeftMoveStart}
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
    <div style={{ height: "100vh", width: "1px", backgroundColor: "white", position: "absolute", left:"50%"}}></div>
    <Map
      id="right-map"
      mapboxAccessToken="pk.eyJ1IjoiY2Fyb2x2ZnMiLCJhIjoiY2x2MmplZ3pwMGltazJscGMyeTNwdTlmMSJ9.WXeQtHjwp8ap2Fiz6RD8Xg"
      {...viewState}
      // style={{width: "100vw", height: "100vh", position: "relative"}}
      style={RightMapStyle}
      // onMove={evt => setViewState(evt.viewState)}
      padding={rightMapPadding}
      onMoveStart={onRightMoveStart}
      onMove={activeMap === 'right' && onMove }
      mapStyle="mapbox://styles/mapbox/streets-v11"
    >
      {geojsonArr2 && geojsonArr2.map((g, i) =>
        g.features.map((point, j) => (
          <Marker
            key={`marker-${i}-${j}`}
            longitude={point.geometry.coordinates[0]}
            latitude={point.geometry.coordinates[1]}
          >
            <div
              onClick={() => handleMarkerClick(point)}
              style={{
                width: `${layerStyle2.paint['circle-radius'] * 2}px`,
                height: `${layerStyle2.paint['circle-radius'] * 2}px`,
                borderRadius: '50%',
                backgroundColor: layerStyle2.paint['circle-color'],
                cursor: 'pointer',
              }}
            />
          </Marker>
        ))
      )}

    </Map>
    </div>
    <ControlPanel mode={mode} onModeChange={setMode} />
    </>
  );
}

export default Home