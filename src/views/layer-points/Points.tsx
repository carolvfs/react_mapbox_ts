import React, { useRef, useState, useCallback, useEffect } from "react"
import { Feature, FeatureCollection, Geometry, MultiPolygon } from 'geojson'
import mapboxgl from "mapbox-gl"
import axios from "axios"

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN as string

const mapParams = {
  style: "mapbox://styles/carolvfs/clxnzay8z02qh01qkhftqheen",
  center: [-98.20, 38.96] as [number, number],
  zoom: 3,
  // geoFile: "./Yearly_tmax.json"//'/temperature.geojson',
  geoFile: "./Yearly_Precipitation_Sum.json"//'/temperature.geojson',

}

const PointsHome = () => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null)
  const [map, setMap] = useState<mapboxgl.Map | null>(null)
  const [geojsonData, setGeojsonData] = useState<GeoJSON.FeatureCollection | null>(null)
  const hasFetchedData = useRef(false)

  const fetchData = useCallback(() => {
    (async () => {
      const response = await axios.get(mapParams.geoFile)
      if (response.data) setGeojsonData(response.data)
    })()

  },[])

  const addContours = useCallback(() => {
    if (!map || !geojsonData) return;
  
    const addLayer = () => {
      // Add GeoJSON as a source in Mapbox
      if (!map.getSource('my-points')) {
        map.addSource('my-points', {
          type: 'geojson',
          data: geojsonData
        });
      }
  
      // Add a layer to style the contours
      if (!map.getLayer('my-points')) {
        map.addLayer({
          id: 'my-points',
          type: 'circle',
          source: 'my-points',
          paint: {
            "circle-radius": 1.0,
            "circle-color": [
              'interpolate',
              ['linear'],
              ['get', '1980'],
              800, '#ffffb2',
              850, '#fecb5c',
              900, '#fd8d3c',
              950, '#f03b20',
              1000, '#bd0026'
            ],
          }
        });
      }
    };
  
    if (map.isStyleLoaded()) {
      addLayer();
    } else {
      map.on('load', addLayer);
    }
  
    // Cleanup on component unmount
    return () => {
      if (map.getLayer('my-points')) map.removeLayer('my-points');
      if (map.getSource('my-points')) map.removeSource('my-points');
    };
  }, [map, geojsonData]);
  
  
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

  useEffect(() => {
    
    if (!hasFetchedData.current) {
      fetchData()
      hasFetchedData.current = true
    }
    
  }, [fetchData])

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

export default PointsHome
