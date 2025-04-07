import React, { useRef, useState, useCallback, useEffect } from "react"
import { Feature, FeatureCollection, Geometry, MultiPolygon } from 'geojson'
import mapboxgl from "mapbox-gl"
import * as d3 from 'd3-contour'
import { scaleLinear } from 'd3-scale'

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN as string

// Import necessary libraries
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
const geoJSONData = generateGridData(minLat, maxLat, minLong, maxLong, resolutionKm);

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

// Convert GeoJSON data to string
const geoJSONString = JSON.stringify(geoJSONData, null, 2);
console.log(geoJSONString)
// Trigger download in the browser
// downloadData(geoJSONString, 'grid_data.geojson', 'application/json');