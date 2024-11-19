import React, { useRef, useState, useCallback, useEffect } from "react"
import { Feature, FeatureCollection, Geometry, MultiPolygon } from 'geojson'
import mapboxgl from "mapbox-gl"
import * as d3 from 'd3-contour'
import { scaleLinear } from 'd3-scale'

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN as string

const mapParams = {
  style: "mapbox://styles/carolvfs/clxnzay8z02qh01qkhftqheen",
  center: [-98.20, 38.96] as [number, number],
  zoom: 3,
  geoFile: '/temperature.geojson',
}

const HmapHome = () => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null)
  const [map, setMap] = useState<mapboxgl.Map | null>(null)

  const addContours = useCallback(() => {
    if (!map) return

    const rows = 160
    const columns = 220
    const temperatureGrid = Array.from({ length: rows }, () =>
      Array.from({ length: columns }, () => Math.round(Math.random() * 15) + 15) // Values from 15 to 30
    )

    const lonRange = [-98.0, -95.0]
    const latRange = [38.0, 40.0]

    // Wait for the map's style to load before adding the contours
    map.on("style.load", () => {

      const xScale = scaleLinear()
        .domain([0, temperatureGrid[0].length - 1])
        .range(lonRange)

      const yScale = scaleLinear()
        .domain([0, temperatureGrid.length - 1])
        .range(latRange)

      const contours = d3.contours()
        .size([temperatureGrid[0].length, temperatureGrid.length]) // Grid dimensions
        .thresholds([15, 18, 21, 24, 27, 30])
        (temperatureGrid.flat()) // Flatten 2D array to 1D
        
        // Convert contours to GeoJSON format
        const contourFeatures: Feature<MultiPolygon, { value: number }>[] = contours.map(contour => ({
          type: "Feature",
          properties: { value: contour.value },
          geometry: {
            type: "MultiPolygon",
            coordinates: contour.coordinates.map(polygon =>
              polygon.map(ring =>
                ring.map(([x, y]) => [xScale(x), yScale(y)])   // Convert grid to lon/lat
              )
            )
          }
        }))
        
        const geojson: FeatureCollection<MultiPolygon, { value: number }> = {
          type: "FeatureCollection",
          features: contourFeatures
        }

        // Add GeoJSON as a source in Mapbox
        if (!map.getSource('contours')) {
          map.addSource('contours', {
            type: 'geojson',
            data: geojson
          })
        }

        // Add a layer to style the contours
      if (!map.getLayer('contours')) {
        map.addLayer({
          id: 'contours',
          type: 'fill',
          source: 'contours',
          paint: {
            'fill-color': [
              'interpolate',
              ['linear'],
              ['get', 'value'],
              15, '#ffffb2',
              18, '#fecb5c',
              21, '#fd8d3c',
              24, '#f03b20',
              27, '#bd0026'
            ],
            'fill-opacity': 0.6
          }
        })
      }

      // Cleanup on component unmount
      return () => {
        if (map.getLayer('contours')) map.removeLayer('contours')
        if (map.getSource('contours')) map.removeSource('contours')
      }

    })

  },[map])
  
  const startMap = useCallback(() => {
    if (!mapContainerRef.current) return

    const mapInstance = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: mapParams.style,
      center: mapParams.center,
      zoom: mapParams.zoom
    })

    setMap(mapInstance)

    return () => mapInstance.remove()
  }, [])

  useEffect(() => startMap(), [startMap])
  useEffect(() => addContours(), [addContours])

  const renderMap = () => {
    return (
      <div style={{
        position: 'relative',
        right: '-100px',
        display: 'flex',
        flexDirection: 'column',
        width: '1000px',
        height: '500px',
        backgroundColor: 'purple',
        margin: '10px',
        padding: '5px'
      }}>
        <div
          className="mymap-container"
          style={{
            backgroundColor: "aqua",
            width: "100%",
            height: "100%",
            flex: 1,
          }}
          ref={mapContainerRef}
        ></div>
      </div>
    )
  }

  const render = () => {
    return (
      <div style={{ backgroundColor: "#EAEAEA", height:"100%", width:"100%" }}>
        { renderMap() }
      </div>
    )
  }

  return render()
}

export default HmapHome
