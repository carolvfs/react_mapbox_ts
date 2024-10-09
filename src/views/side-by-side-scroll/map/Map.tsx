import React, { useRef, useState, useEffect, useCallback } from "react"
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN as string

interface IMap {
  timeStamp?: string
  opacity?: number
  layers:any[]
  mapInfo: {
    style: string,
    center: [number, number],
    zoom: number
  }
}

const Map: React.FC<IMap> = (props) => {

  const mapContainerRef = useRef<HTMLDivElement | null>(null)
  const [map, setMap] = useState<any>(null)

  const populateMap = useCallback(() => {

    const defineFillColor = (l:any) => {

      let _fillColor:any = "purple"

      if (l.colorType === "continuous") {
        if (!l.timeInvariant) {
          const interpolateExpression = ["interpolate", ["linear"], ["get", props.timeStamp, ['get', 'values']]]

          const inputValues = [];
      
          for (let i = 0; i < l.domain.length; i++) {
            inputValues.push(l.domain[i])
            inputValues.push(l.colorScheme[i])

          }

          interpolateExpression.push(...inputValues)

          _fillColor = interpolateExpression
        }
      }
      
      return _fillColor
    }

    const addCircleLayer = (l:any) => {
      map.addLayer({
        id: l.id,
        type: l.type,
        source: l.sourceId,
        paint: {
          'circle-radius': 4,
          'circle-stroke-width': 2,
          'circle-color': defineFillColor(l),
          'circle-stroke-color': 'white'
        }
      });
    }

    const addFillLayer = (l:any) => {
      map.addLayer({
        id: l.id,
        type: l.type,
        source: l.sourceId,
        paint: {
          "fill-color": defineFillColor(l),
          "fill-opacity": props.opacity ? props.opacity : 1.0
        }
      })

      map.addLayer({
        id: `${l.id}-line`,
        type: "line",
        source: l.sourceId,
        paint: {
          "line-color": "black",
          "line-width": 1
          
        }
      })
    }

    
    if(!map || !props.mapInfo.style || props.layers.length === 0) return

    // const activeLayers = map.getStyle().layers

    for (const layer of props.layers) {

      if (!map.getSource(layer.sourceId)) {
        map.addSource(layer.sourceId, {
          type: layer.sourceType,
          data: layer.geojson
        })
        
        if (!map.getLayer(layer.id)) {
          if(layer.type === "fill") {
            addFillLayer(layer)
            
          } else if (layer.type === "circle") {
            addCircleLayer(layer)
          }
        }
      }
    }
    
  },[map, props.layers, props.mapInfo.style, props.opacity, props.timeStamp])
  
  const startMap = useCallback(() => {
    const attachMap = () => {
      if (!mapContainerRef.current || !props.mapInfo.style || !props.mapInfo.center || !props.mapInfo.zoom) return
      
      const _map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: props.mapInfo.style,
        center: props.mapInfo.center,
        zoom: props.mapInfo.zoom
      })

      // _map.addControl(new mapboxgl.NavigationControl(), 'top-right')

      
      _map.on("load", () => setMap(_map))

      return () => _map.remove()
  
    }

    if (!map) attachMap()

  },[map, props.mapInfo.style, props.mapInfo.center, props.mapInfo.zoom])

  useEffect(() => startMap() ,[startMap])
  useEffect(() => populateMap() ,[populateMap])

  return (
    <div id="map-container" style={{position:"absolute", top:0, bottom:0, left:0, width:"100%", height:"100%"}} ref={mapContainerRef}></div>
  )
}

export default Map