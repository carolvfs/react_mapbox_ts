import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

const MapComponent = () => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const [locations, setLocations] = useState({ A: null, B: null });
  const [route, setRoute] = useState(null);
  const [inclinations, setInclinations] = useState([]);

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      // center: [-74.0060, 40.7128],
      // center: [-87.64989974299075, 41.88490502295617],
      center:[-103.58413792780232, 39.599367221926585],
      zoom: 5,
    });
    mapRef.current = map

    map.on('load', () => {
      // Add DEM source if not already present.
      if (!map.getSource('mapbox-dem')) {
        map.addSource('mapbox-dem', {
          type: 'raster-dem',
          url: 'mapbox://mapbox.terrain-rgb',
          tileSize: 512,
          maxzoom: 14,
        });
        // Enable 3D terrain using the DEM source.
        map.setTerrain({ source: 'mapbox-dem', exaggeration: 1 });
      }

      // Listen for clicks to define start (A) and end (B) points.
      map.on('click', (e) => {
        const lngLat = [e.lngLat.lng, e.lngLat.lat];
        if (!locations.A) {
          setLocations((prev) => ({ ...prev, A: lngLat }));
          new mapboxgl.Marker({ color: 'blue' })
            .setLngLat(lngLat)
            .addTo(map);
        } else if (!locations.B) {
          setLocations((prev) => ({ ...prev, B: lngLat }));
          new mapboxgl.Marker({ color: 'blue' })
            .setLngLat(lngLat)
            .addTo(map);
          // Fetch the route once both points are defined.
          fetchRoute(locations.A, lngLat, map);
        }
      });
    });

    // Cleanup on component unmount.
    return () => map.remove();
  }, [locations.A]);

  const fetchRoute = async (locationA, locationB, map) => {
    try {
      const query = `https://api.mapbox.com/directions/v5/mapbox/driving/${locationA[0]},${locationA[1]};${locationB[0]},${locationB[1]}?geometries=geojson&overview=full&access_token=${mapboxgl.accessToken}`;
      const response = await fetch(query);
      const data = await response.json();
      if (data.routes && data.routes.length > 0) {
        const routeGeoJson = data.routes[0].geometry;
        setRoute(routeGeoJson);
        addRouteLayer(routeGeoJson, map);
        // Once the route is added, compute the inclination along it.
        computeInclination(routeGeoJson, map);
      }
    } catch (error) {
      console.error('Error fetching route:', error);
    }
  };

  // Add the fetched route as a new layer to the map.
  const addRouteLayer = (routeGeoJson, map) => {
    if (map.getSource('route')) {
      map.getSource('route').setData(routeGeoJson);
    } else {
      map.addSource('route', {
        type: 'geojson',
        data: routeGeoJson,
      });
      map.addLayer({
        id: 'routeLayer',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': '#888',
          'line-width': 8,
        },
      });
    }
  };

  // Compute the inclination (slope) along the route.
  // It samples elevation for each coordinate using queryTerrainElevation,
  // then calculates the slope between each consecutive point.
  const computeInclination = (routeGeoJson, map) => {
    const coordinates = routeGeoJson.coordinates;
    const inclinationsArray = [];
    for (let i = 1; i < coordinates.length; i++) {
      const prevCoord = coordinates[i - 1];
      const currCoord = coordinates[i];
      // Query the terrain elevation at the given coordinates.
      const elevationPrev = map.queryTerrainElevation(prevCoord, { exaggeration: 1 });
      const elevationCurr = map.queryTerrainElevation(currCoord, { exaggeration: 1 });
      // Calculate the horizontal distance between the two points using the Haversine formula.
      const distance = haversineDistance(prevCoord, currCoord);
      // Calculate slope (inclination) as a percentage.
      const slope = distance !== 0 ? ((elevationCurr - elevationPrev) / distance) * 100 : 0;
      inclinationsArray.push(slope);
    }
    setInclinations(inclinationsArray);
    console.log('Inclinations along route (%):', inclinationsArray);
  };

  // Animate a marker along the route with dynamic delay based on desired speed (in m/s).
const animateMarker = () => {
  if (!route) return;
  const map = mapRef.current;
  const coordinates = route.coordinates;
  let counter = 0;
  const markerEl = document.createElement('div');
  markerEl.style.backgroundColor = 'red';
  markerEl.style.width = '10px';
  markerEl.style.height = '10px';
  markerEl.style.borderRadius = '50%';

  const marker = new mapboxgl.Marker(markerEl)
    .setLngLat(coordinates[0])
    .addTo(map);

  const desiredSpeed = 50; // speed in meters per second

  function animate() {
    if (counter >= coordinates.length - 1) return;
    
    const currentPoint = coordinates[counter];
    const nextPoint = coordinates[counter + 1];
    
    // Calculate the horizontal distance between points using the Haversine formula.
    const distance = haversineDistance(currentPoint, nextPoint);
    
    // Calculate delay based on distance and desired speed (convert seconds to milliseconds).
    const delay = (distance / desiredSpeed) * 1000;
    
    counter++;
    marker.setLngLat(coordinates[counter]);
    setTimeout(animate, delay);
  }
  animate();
};

// Haversine distance function remains the same.
const haversineDistance = (coord1, coord2) => {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const [lon1, lat1] = coord1;
  const [lon2, lat2] = coord2;
  const R = 6371000; // Earth's radius in meters.
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};


  return (
    <div>
      <div ref={mapContainerRef} style={{ width: '100%', height: '100vh' }} />
      <button
        onClick={animateMarker}
        style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 1 }}
      >
        Start Movement
      </button>
    </div>
  );
};

export default MapComponent;
