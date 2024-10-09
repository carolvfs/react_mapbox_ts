import React, { useRef, useState, useEffect, useCallback, useMemo } from "react"
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { before } from "lodash"

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN as string

interface IMapSideBySide {

}

const MapSideBySide: React.FC<IMapSideBySide> = (props) => {

  const width = typeof window === 'undefined' ? 100 : window.innerWidth

  const mapContainerRef = useRef<HTMLDivElement | null>(null)
  const beforeRef = useRef<HTMLDivElement | null>(null)
  const afterRef = useRef<HTMLDivElement | null>(null)

  const [viewState, setViewState] = useState({center: [0, 0], zoom: 0 })
  const [activeMap, setActiveMap] = useState<'left' | 'right' | null>(null)
  // const [lat, setLat] = useState<number>(0) 
  // const [lon, setLon] = useState<number>(0)
  const [center, setCenter] = useState<mapboxgl.LngLat>([0,0])
  const [zoom, setZoom] = useState<number>(0)

  const [beforeMap, setBeforeMap] = useState(null)
  const [afterMap, setAfterMap] = useState(null)

  const onLeftMoveStart = useCallback(() => setActiveMap('left'), [])
  const onRightMoveStart = useCallback(() => setActiveMap('right'), [])
  const onMove = useCallback((center:any, zoom:number) => {setCenter(center); setZoom(zoom)}, [])

  const leftMapPadding = useMemo(() => { return { left: 0, top: 0, right: 0, bottom: 0 } }, [width])
  const rightMapPadding = useMemo(() => { return { right: 0, top: 0, left: 0, bottom: 0 } }, [width])

  const startMap = useCallback(() => {
      if (!mapContainerRef.current || !beforeRef.current || !afterRef.current) return
     
      const _beforeMap = new mapboxgl.Map({
        container: beforeRef.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: center,
        zoom: zoom
      });

      
      const _afterMap = new mapboxgl.Map({
        container: afterRef.current,
        style: 'mapbox://styles/mapbox/dark-v11',
        center: center,
        zoom: zoom
      });

      setBeforeMap(_beforeMap)
      setAfterMap(_afterMap)
      
      return () => { _beforeMap.remove(); _afterMap.remove() }

      // _map.addControl(new mapboxgl.NavigationControl(), 'top-right')

  },[])

  useEffect(() => startMap() ,[startMap])

  useEffect(() => {

    if(!beforeMap || !afterMap) return

    beforeMap.on("movestart", (e:any) => { 
      if(e.originalEvent instanceof MouseEvent) {
        console.log("before started")
        const _center = beforeMap.getCenter(); // Get the current center of the map
        const _zoom = beforeMap.getZoom(); // Get the current zoom level of the map
        console.log("activeMap === before", "before is moving")
        onMove(_center, _zoom)
        setActiveMap('left')
      
      }
    
    
    })
    afterMap.on("movestart", (e:any) => { 
      if(e.originalEvent instanceof MouseEvent) {
        console.log("after started")
        const _center = afterMap.getCenter(); // Get the current center of the map
        const _zoom = afterMap.getZoom(); // Get the current zoom level of the map
        console.log("activeMap === right", "after is moving")
        onMove(_center, _zoom)
        setActiveMap('right')
      }
    })

    // beforeMap.on("movestart", (e:any) => { if(e.originalEvent instanceof MouseEvent) {console.log("before started"); setActiveMap('left')}})
    // afterMap.on("movestart", (e:any) => { if(e.originalEvent instanceof MouseEvent) {console.log("after started"); setActiveMap('right')}})
    
    beforeMap.on("moveend", (e:any) => { if(e.originalEvent instanceof MouseEvent) {console.log("before ended"); setActiveMap(null)}})
    afterMap.on("moveend", (e:any) => { if(e.originalEvent instanceof MouseEvent) {console.log("after ended"); setActiveMap(null)}})


  },[beforeMap, afterMap])

  useEffect(() => {

    if(!beforeMap || !afterMap) return

    beforeMap.on("move", () => {
      if(activeMap === "left") {
        const _center = beforeMap.getCenter(); // Get the current center of the map
        const _zoom = beforeMap.getZoom(); // Get the current zoom level of the map
        console.log("activeMap === before", "before is moving")
        onMove(_center, _zoom)
      } 
    })

    afterMap.on("move", () => {
      if(activeMap === "right") {
        const _center = afterMap.getCenter(); // Get the current center of the map
        const _zoom = afterMap.getZoom(); // Get the current zoom level of the map
        console.log("activeMap === right", "after is moving")
        onMove(_center, _zoom)
      } 
    })

  },[beforeMap, afterMap, activeMap])

  useEffect(() => {

    if(!beforeMap || !afterMap) return

    if(activeMap === 'left') {
      console.log("right is flying")
      afterMap.jumpTo({ center, zoom })

    } else

    if(activeMap === 'right') {
      console.log("left is flying")
      beforeMap.jumpTo({ center, zoom })
    }

  },[beforeMap, afterMap, activeMap, center, zoom])


  return(
  <div id="map-compare-container" style={{position:"absolute", top:0, bottom:0, left:0, width:"100%"}} ref={mapContainerRef}>
    <div id="before-map" style={{position: 'absolute', top:0, bottom:0, left:0, width:"50%", height: '100%'}} ref={beforeRef}></div>
    <div id="after-map" style={{position: 'absolute', top:0, bottom:0, left:"50%",width:"50%", height: '100%'}} ref={afterRef}></div>
  </div>
  )

}

export default MapSideBySide