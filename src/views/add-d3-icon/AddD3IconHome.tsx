import React, { useRef, useState, useCallback, useEffect } from "react"
import mapboxgl from "mapbox-gl"
import * as d3 from 'd3';
import { createColorBar, ColorBarOptions } from './colorBarUtils'

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN as string

const AddD3IconHome = () => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null)
  const [map, setMap] = useState<mapboxgl.Map | null>(null)

  const [isAddingIcon, setIsAddingIcon] = useState<boolean>(false)
  const [isRemovingIcon, setIsRemovingIcon] = useState<boolean>(false)

  const isAddListenerAttached = useRef(false)
  const [markers, setMarkers] = useState<mapboxgl.Marker[]>([])

  // Ref to store the current value of isRemoving
  const isRemovingRef = useRef(isRemovingIcon)

  const colorBarOptions: ColorBarOptions = {
    width: 50,
    height: 200,
    colorScheme: 'interpolateRainbow',
    domain: [10, 30],
  }

  useEffect(() => {
    isRemovingRef.current = isRemovingIcon
  }, [isRemovingIcon])

  // Initialize the map
  const startMap = useCallback(() => {
    if (!mapContainerRef.current) return

    const mapInstance = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/carolvfs/clxnzay8z02qh01qkhftqheen",
      center: [-98.2, 38.96] as [number, number],
      zoom: 3,
    })

    setMap(mapInstance)

    return () => mapInstance.remove()
  }, [])

  useEffect(() => {
    startMap()
  }, [startMap])

  // Handle adding and removing markers
  useEffect(() => {
    if (!map) return

    const handleMapClick = (e: mapboxgl.MapMouseEvent) => {
      const coordinates = e.lngLat

      const myMarker = document.createElement('div')
      myMarker.style.width = '30px'
      myMarker.style.height = '30px'
      myMarker.style.backgroundImage = 'url(charging-station.png)'
      // myMarker.style.backgroundSize = 'cover'
      // myMarker.style.borderRadius = '50%'
      myMarker.style.background = 'transparent'

      const svg = d3.select(myMarker).append('svg')
      createColorBar(svg, colorBarOptions)

      const marker = new mapboxgl.Marker({
        element: myMarker,
        anchor: 'bottom',
      })
        .setLngLat(coordinates)
        .addTo(map)

      const markerElement = marker.getElement()

      markerElement.addEventListener("click", (event) => {
        // Always prevent map click when marker is clicked
        event.stopPropagation()

        if (isRemovingRef.current) {
          marker.remove()
          setMarkers((prevMarkers) => prevMarkers.filter((m) => m !== marker))
        }
      })

      setMarkers((prevMarkers) => [...prevMarkers, marker])
    }

    if (isAddingIcon && !isAddListenerAttached.current) {
      map.on("click", handleMapClick)
      isAddListenerAttached.current = true
    } else if (!isAddingIcon && isAddListenerAttached.current) {
      map.off("click", handleMapClick)
      isAddListenerAttached.current = false
    }

    // Cleanup on component unmount or when dependencies change
    return () => {
      if (isAddListenerAttached.current) {
        map.off("click", handleMapClick)
        isAddListenerAttached.current = false
      }
    }
  }, [map, isAddingIcon])

  const renderMap = () => {
    return (
      <div
        style={{
          position: "relative",
          right: "-100px",
          display: "flex",
          flexDirection: "column",
          width: "1000px",
          height: "500px",
          backgroundColor: "purple",
          margin: "10px",
          padding: "5px",
        }}
      >
        <div style={{ padding: "10px" }}>
          <button
            onClick={() => {
              setIsAddingIcon(true)
              setIsRemovingIcon(false)
            }}
          >
            Add Icon
          </button>
          <button
            onClick={() => {
              setIsAddingIcon(false)
              setIsRemovingIcon(true)
            }}
          >
            Remove Icon
          </button>
          <button
            onClick={() => {
              setIsAddingIcon(false)
              setIsRemovingIcon(false)
            }}
          >
            Stop
          </button>
        </div>
        <div
          className="mymap-container"
          style={{
            backgroundColor: "aqua",
            width: "100%",
            height: "100%",
            flex: 1,
          }}
          ref={mapContainerRef}
        >
          {/* The map will render here */}
        </div>
      </div>
    )
  }

  const render = () => {
    return (
      <div style={{ backgroundColor: "#EAEAEA", height: "100%", width: "100%" }}>
        {renderMap()}
      </div>
    )
  }

  return render()
}

export default AddD3IconHome
