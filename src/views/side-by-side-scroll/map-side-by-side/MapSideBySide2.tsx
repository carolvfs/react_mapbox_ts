import React, { useRef, useEffect } from "react";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN as string;

interface IMapSideBySideProps {}

const MapSideBySide: React.FC<IMapSideBySideProps> = (props) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const beforeMapRef = useRef<mapboxgl.Map | null>(null);
  const afterMapRef = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const beforeMap = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [0, 0],
      zoom: 0
    });

    const afterMap = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [0, 0],
      zoom: 0
    });

    const syncMaps = (sourceMap: mapboxgl.Map, targetMap: mapboxgl.Map) => {
      const handleMoveEnd = () => {
        const { lng, lat } = sourceMap.getCenter();
        const zoom = sourceMap.getZoom();
        targetMap.jumpTo({ center: [lng, lat], zoom });
      };

      sourceMap.on('moveend', handleMoveEnd);

      return () => {
        sourceMap.off('moveend', handleMoveEnd);
      };
    };

    const cleanupBeforeMap = syncMaps(beforeMap, afterMap);
    const cleanupAfterMap = syncMaps(afterMap, beforeMap);

    beforeMapRef.current = beforeMap;
    afterMapRef.current = afterMap;

    return () => {
      cleanupBeforeMap();
      cleanupAfterMap();
      beforeMap.remove();
      afterMap.remove();
    };
  }, []);

  return (
    <div id="map-compare-container" style={{ position: "relative", height: "100%", width: "100%" }}>
      <div ref={mapContainerRef} style={{ position: "absolute", top: 0, bottom: 0, left: 0, right: 0 }} />
    </div>
  );
};

export default MapSideBySide;
