import React, { useRef, useState, useCallback, useEffect } from "react"
import { Feature, FeatureCollection, Geometry, MultiPolygon } from 'geojson'
import mapboxgl from "mapbox-gl"
import * as d3 from 'd3'

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN as string

import * as turf from '@turf/turf';

interface GeoJSONFeature {
    type: 'Feature';
    geometry: {
        type: 'Point';
        coordinates: [number, number]; // [longitude, latitude]
    };
    properties: {
        value: number;
    };
}

// interface FeatureCollection {
//     type: 'FeatureCollection';
//     features: GeoJSONFeature[];
// }

function generateGridData(
    minLat: number,
    maxLat: number,
    minLong: number,
    maxLong: number,
    resolutionKm: number
): FeatureCollection {
    // Define the bounding box [west, south, east, north]
    const bbox: [number, number, number, number] = [minLong, minLat, maxLong, maxLat];

    // Create a grid of points over the bounding box at the specified resolution
    const options = { units: 'kilometers' };
    const pointGrid = turf.pointGrid(bbox, resolutionKm, options);

    // Add random values to each point
    const features: GeoJSONFeature[] = pointGrid.features.map(point => ({
        type: 'Feature',
        geometry: {
            type: 'Point',
            coordinates: point.geometry.coordinates as [number, number],
        },
        properties: {
            value: parseFloat((Math.random() * 15 + 15).toFixed(2)), // Value between 15 and 30
        },
    }));

    const featureCollection: FeatureCollection = {
        type: 'FeatureCollection',
        features: features,
    };

    return featureCollection;
}

// Specified coordinates
const lat1 = 42.71095181139068;
const long1 = -86.59473127307957;
const lat2 = 37.789759778822095;
const long2 = -91.04185707934711;

// Determine min and max latitudes and longitudes
const minLat = Math.min(lat1, lat2);
const maxLat = Math.max(lat1, lat2);
const minLong = Math.min(long1, long2);
const maxLong = Math.max(long1, long2);

// Use the function
const resolutionKm = 3;    // 3 km resolution
const geojsonData = generateGridData(minLat, maxLat, minLong, maxLong, resolutionKm);

// Function to download data as a file in the browser
function downloadData(data: any, filename: string, type: string) {
    const file = new Blob([data], { type: type });
    const a = document.createElement('a');
    const url = URL.createObjectURL(file);
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }, 0);
}

function getColorForValue(value: number): { r: number; g: number; b: number; a: number } {
  const minValue = 15;
  const maxValue = 30;

  const t = (value - minValue) / (maxValue - minValue);

  const color = d3.interpolateViridis(t);
  const rgb = d3.rgb(color);

  return { r: rgb.r, g: rgb.g, b: rgb.b, a: 255 };
}

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

    // Process the data
    const points = geojsonData.features.map((feature: any) => ({
      x: feature.geometry.coordinates[0],
      y: feature.geometry.coordinates[1],
      value: feature.properties.value,
    }));

    // Define the grid extent and resolution
    const xExtent = d3.extent(points, (d) => d.x) as [number, number];
    const yExtent = d3.extent(points, (d) => d.y) as [number, number];

    const gridWidth = 500;
    const gridHeight = 500;

    const xScale = d3.scaleLinear().domain(xExtent).range([0, gridWidth]);
    const yScale = d3.scaleLinear().domain(yExtent).range([0, gridHeight]);

    // Create a grid and interpolate the data
    const gridData: number[] = new Array(gridWidth * gridHeight).fill(0);

    // Simple interpolation (inverse distance weighting)
    for (let xi = 0; xi < gridWidth; xi++) {
      for (let yi = 0; yi < gridHeight; yi++) {
        const x = xScale.invert(xi);
        const y = yScale.invert(yi);

        let numerator = 0;
        let denominator = 0;

        points.forEach((point) => {
          const distance = Math.hypot(point.x - x, point.y - y);
          const weight = 1 / (distance || 1e-6); // Avoid division by zero
          numerator += weight * point.value;
          denominator += weight;
        });

        const value = numerator / denominator;
        gridData[yi * gridWidth + xi] = value;
      }
    }

    // Create and draw on the canvas
    const canvas = document.createElement('canvas');
    canvas.width = gridWidth;
    canvas.height = gridHeight;
    const context = canvas.getContext('2d')!;

    const imageData = context.createImageData(gridWidth, gridHeight);

    for (let i = 0; i < gridData.length; i++) {
      const value = gridData[i];
      const color = getColorForValue(value);

      imageData.data[i * 4] = color.r;
      imageData.data[i * 4 + 1] = color.g;
      imageData.data[i * 4 + 2] = color.b;
      imageData.data[i * 4 + 3] = color.a;
    }

    context.putImageData(imageData, 0, 0);

   
    // Wait for the map's style to load before adding the contours
    map.on("style.load", () => {

      const canvasBounds = [
        [xExtent[0], yExtent[1]],
        [xExtent[1], yExtent[1]],
        [xExtent[1], yExtent[0]],
        [xExtent[0], yExtent[0]],
      ];

      
        // Add GeoJSON as a source in Mapbox
        if (!map.getSource('contours')) {
          map.addSource('contours', {
            type: 'canvas',
            canvas: canvas,
            coordinates: canvasBounds,
            animate: false,
          })
        }

        // Add a layer to style the contours
      if (!map.getLayer('contours')) {
        map.addLayer({
          id: 'contours',
          type: 'raster',
          source: 'contours',
          paint: {
            'raster-opacity': 1,
          },
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
