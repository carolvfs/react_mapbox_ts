import React, { useState, useEffect } from 'react';
import ReactMapGL, { Marker, Source, Layer, ViewStateChangeEvent } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN as string

const MapComponent: React.FC = () => {
  const [viewport, setViewport] = useState({
    latitude: 40.7128,
    longitude: -74.0060,
    zoom: 10,
  });
  const [locations, setLocations] = useState<{ A: [number, number] | null; B: [number, number] | null }>({ A: null, B: null });
  const [route, setRoute] = useState<any>(null);
  const [moving, setMoving] = useState(false);
  const [markerPosition, setMarkerPosition] = useState<[number, number] | null>(null);

  const carSpeed = 20; // Speed in km/h
  const speedInMetersPerSec = carSpeed * 1000 / 3600;

  useEffect(() => {
    if (moving && route) {
      animateMarker();
    }
  }, [moving, route]);

  const handleMapClick = (event: any) => {
    const lngLatArray = event.lngLat.toArray() as [number, number];
    if (!locations.A) {
      setLocations({ ...locations, A: lngLatArray });
    } else if (!locations.B) {
      setLocations({ ...locations, B: lngLatArray });
      fetchRoute(locations.A, lngLatArray);
    }
  };

  const fetchRoute = async (locationA: [number, number], locationB: [number, number]) => {
    const response = await fetch(`https://api.mapbox.com/directions/v5/mapbox/driving/${locationA[0]},${locationA[1]};${locationB[0]},${locationB[1]}?geometries=geojson&access_token=${MAPBOX_TOKEN}`);
    const data = await response.json();
    setRoute(data.routes[0].geometry);
  };

  const animateMarker = () => {
    if (!route) return;

    const coordinates = route.coordinates;
    const length = coordinates.length;
    if (length < 2) return;

    const totalDistance = coordinates.reduce((acc: number, coord: number[], i: number) => {
      if (i === 0) return acc;
      const prevCoord = coordinates[i - 1];
      const distance = Math.sqrt(Math.pow(coord[0] - prevCoord[0], 2) + Math.pow(coord[1] - prevCoord[1], 2));
      return acc + distance;
    }, 0);

    const stepInterval = 20; // 100 milliseconds per step
    let elapsedTime = 0;

    const interval = setInterval(() => {
      if (elapsedTime >= totalDistance / speedInMetersPerSec) {
        clearInterval(interval);
        setMoving(false);
        return;
      }

      const progress = (elapsedTime * speedInMetersPerSec) / totalDistance;
      const segmentIndex = Math.floor(progress * (length - 1));
      const segmentProgress = progress * (length - 1) - segmentIndex;
      const startCoord = coordinates[segmentIndex];
      const endCoord = coordinates[segmentIndex + 1];

      const lng = startCoord[0] + segmentProgress * (endCoord[0] - startCoord[0]);
      const lat = startCoord[1] + segmentProgress * (endCoord[1] - startCoord[1]);

      setMarkerPosition([lng, lat]);
      elapsedTime += stepInterval / 1000; // Convert milliseconds to seconds
    }, stepInterval);
  };

  return (
    <ReactMapGL
      {...viewport}
      style={{ width: '100%', height: '100vh' }}
      mapStyle="mapbox://styles/mapbox/streets-v11"
      onMove={(evt: ViewStateChangeEvent) => setViewport(evt.viewState)}
      onClick={handleMapClick}
      mapboxAccessToken={MAPBOX_TOKEN}
    >
      {locations.A && <Marker longitude={locations.A[0]} latitude={locations.A[1]} />}
      {locations.B && <Marker longitude={locations.B[0]} latitude={locations.B[1]} />}

      {route && (
        <Source id="route" type="geojson" data={route}>
          <Layer
            id="routeLayer"
            type="line"
            paint={{
              'line-color': '#888',
              'line-width': 8,
            }}
          />
        </Source>
      )}

      {markerPosition && (
        <Marker longitude={markerPosition[0]} latitude={markerPosition[1]}>
          <div style={{ backgroundColor: 'red', width: '10px', height: '10px', borderRadius: '50%' }} />
        </Marker>
      )}

      <button style={{ position: "relative", zIndex: 2000}} onClick={() => setMoving(true)}>Start Movement</button>
      <button style={{ position: "relative", zIndex: 2000}} onClick={() => setMoving(false)}>Stop Movement</button>
    </ReactMapGL>
  );
};

export default MapComponent;
