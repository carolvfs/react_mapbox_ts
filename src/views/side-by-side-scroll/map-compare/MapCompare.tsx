import React, { useRef, useState, useEffect, useCallback } from "react"
import mapboxgl from 'mapbox-gl'
import MapboxCompare from "mapbox-gl-compare"
import 'mapbox-gl/dist/mapbox-gl.css'
import "mapbox-gl-compare/dist/mapbox-gl-compare.css"

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN as string

interface IMapCompare {

}

const MapCompare: React.FC<IMapCompare> = (props) => {

  const mapContainerRef = useRef<HTMLDivElement | null>(null)
  const beforeRef = useRef<HTMLDivElement | null>(null)
  const afterRef = useRef<HTMLDivElement | null>(null)
  const [map, setMap] = useState<any>(null)

  const startMap = useCallback(() => {
      if (!mapContainerRef.current || !beforeRef.current || !afterRef.current) return
     
      const beforeMap = new mapboxgl.Map({
        container: beforeRef.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [0, 0],
        zoom: 0
      });

      const afterMap = new mapboxgl.Map({
          container: afterRef.current,
          style: 'mapbox://styles/mapbox/dark-v11',
          center: [0, 0],
          zoom: 0
      });

      const _map = new MapboxCompare(beforeMap, afterMap, mapContainerRef.current, {
        // Set this to enable comparing two maps by mouse movement:
        // mousemove: true
      });

      return () => _map.remove()
      // _map.addControl(new mapboxgl.NavigationControl(), 'top-right')

  },[])

  useEffect(() => startMap() ,[startMap])

  return(
  <div id="map-compare-container" style={{position:"absolute", top:0, bottom:0, left:0, width:"100%"}} ref={mapContainerRef}>
    <div id="before-map" style={{position: 'absolute', top:0, bottom:0, left:0,width:"100%", height: '100%'}} ref={beforeRef}></div>
    <div id="after-map" style={{position: 'absolute', top:0, bottom:0, left:0,width:"100%", height: '100%'}} ref={afterRef}></div>
  </div>
  )

}

export default MapCompare