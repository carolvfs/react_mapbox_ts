import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
// import InclinationChart from './InclinationChart'
import InclinationChart from './InclinationChartD3'

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

        map.setTerrain({ source: 'mapbox-dem', exaggeration: 1 });
      }

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

          fetchRoute(locations.A, lngLat, map);
        }
      });
    });


    return () => map.remove();
  }, [locations.A]);

  const fetchRoute = async (locationA, locationB, map) => {
    try {
      const query = `https://api.mapbox.com/directions/v5/mapbox/driving/${locationA[0]},${locationA[1]};${locationB[0]},${locationB[1]}?geometries=geojson&overview=full&access_token=${mapboxgl.accessToken}`;
      const response = await fetch(query);
      const data = await response.json();
      if (data.routes && data.routes.length > 0) {
        console.log(data.routes)
        const routeGeoJson = data.routes[0].geometry;
        setRoute(routeGeoJson);
        addRouteLayer(routeGeoJson, map);

        computeInclination(routeGeoJson, map);
      }
    } catch (error) {
      console.error('Error fetching route:', error);
    }
  };


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


  const computeInclination = (routeGeoJson, map) => {
    const coordinates = routeGeoJson.coordinates;
    const inclinationsArray = [];
    for (let i = 1; i < coordinates.length; i++) {
      const prevCoord = coordinates[i - 1];
      const currCoord = coordinates[i];

      const elevationPrev = map.queryTerrainElevation(prevCoord, { exaggeration: 1 });
      const elevationCurr = map.queryTerrainElevation(currCoord, { exaggeration: 1 });

      const distance = haversineDistance(prevCoord, currCoord);

      const slope = distance !== 0 ? ((elevationCurr - elevationPrev) / distance) * 100 : 0;
      inclinationsArray.push(slope);
    }
    setInclinations(inclinationsArray);
    console.log('Inclinations along route (%):', inclinationsArray);
  };


  const haversineDistance = (coord1, coord2) => {
    const toRad = (deg) => (deg * Math.PI) / 180;
    const [lon1, lat1] = coord1;
    const [lon2, lat2] = coord2;
    const R = 6371000;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

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


    const marker = new mapboxgl.Marker(markerEl).setLngLat(coordinates[0]).addTo(map);


    function animate() {
      counter++;
      if (counter >= coordinates.length) return;
      marker.setLngLat(coordinates[counter]);
      requestAnimationFrame(animate);
    }
    animate();
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
      {inclinations.length > 0 && <InclinationChart inclinations={inclinations} />}
    </div>
  );
};

export default MapComponent;
