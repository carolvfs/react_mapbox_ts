import React, { useRef, useState, useCallback, useEffect } from "react"
import mapboxgl from "mapbox-gl"
import axios from "axios"
import simpleheat from "simpleheat"

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN as string

const mapParams = {
  style: "mapbox://styles/carolvfs/clxnzay8z02qh01qkhftqheen",
  center: [-98.20, 38.96] as [number, number],
  zoom: 3,
  geoFile: "./Yearly_Precipitation_Sum.json"

}

const AddImageHome = () => {
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

  const addHeatmap = useCallback(() => {
    if (!map || !geojsonData) return

    // Extract data for heatmap
    // const points = geojsonData.features
    //   .filter((feature) => feature.geometry.type === "Point")
    //   .map((feature) => {
    //     const [lon, lat] = feature.geometry.coordinates;

    //     let value = 1

    //     if(feature.properties) {
    //       value = feature.properties["1980"]
    //       // console.log(value)
    //     }
    //     return [lon, lat, value];
    //   });

    const points = geojsonData.features
  .filter((feature) => feature.geometry.type === "Point")
  .map((feature) => {
    if (feature.geometry.type === "Point") {
      const [lon, lat] = feature.geometry.coordinates;

      let value = 1;

      if (feature.properties) {
        value = feature.properties["1980"]; // Replace "1980" with the actual key for your value
      }
      return [lon, lat, value];
    }

    return null; // Return null if the geometry type isn't Point
  })
  .filter((point): point is [number, number, number] => point !== null);

    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 1024;
    const heat = simpleheat(canvas);
    heat.data(points); // Pass points to simpleheat
    heat.max(1300); // Set max value for the heatmap
    heat.radius(20, 15); // Adjust radius and blur
    heat.draw();
      // console.log(points)
    const heatmapImage = canvas.toDataURL("image/png")
    console.log("Heatmap Image URL:", heatmapImage);


    const bounds = geojsonData.features.reduce(
      (acc, feature) => {
        if (feature.geometry.type === "Point") {
          const [lon, lat] = feature.geometry.coordinates;
          return {
            minLon: Math.min(acc.minLon, lon),
            maxLon: Math.max(acc.maxLon, lon),
            minLat: Math.min(acc.minLat, lat),
            maxLat: Math.max(acc.maxLat, lat),
          };
        }
        return acc;
      },
      {
        minLon: Infinity,
        maxLon: -Infinity,
        minLat: Infinity,
        maxLat: -Infinity,
      }
    );
    

    const imageCoordinates: [[number, number], [number, number], [number, number], [number, number]] = [
      [bounds.minLon, bounds.maxLat], // Top-left
      [bounds.maxLon, bounds.maxLat], // Top-right
      [bounds.maxLon, bounds.minLat], // Bottom-right
      [bounds.minLon, bounds.minLat], // Bottom-left
    ];
    
    console.log("Image Coordinates:", imageCoordinates);


    const addHmap = () => {
      if (!map.getSource('heatmap-source')) {
        map.addSource('heatmap-source', {
          type: "image",
          url: heatmapImage,
          coordinates: imageCoordinates,
        });
      }

      if (!map.getLayer('heatmap-layer')) {
        map.addLayer({
          id: "heatmap-layer",
          type: "raster",
          source: "heatmap-source",
          paint: {
            // "raster-opacity": 0.8,
            "raster-opacity": 1.0,
          },
        });
      }
      console.log("Source exists:", map.getSource('heatmap-source'));
      console.log("Layer exists:", map.getLayer('heatmap-layer'));
      console.log(map.getLayoutProperty('heatmap-layer', 'visibility'));


    }

    // Add the heatmap as an image source to the map
    if (map.isStyleLoaded()) {
      addHmap();
    } else {
      map.on('load', addHmap);
    }

  },[map, geojsonData])

  useEffect(() => {
    if (!hasFetchedData.current) {
      fetchData()
      hasFetchedData.current = true
    }
  }, [fetchData])

  useEffect(() => startMap(), [startMap])
  useEffect(() => addHeatmap(), [addHeatmap])


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

export default AddImageHome
