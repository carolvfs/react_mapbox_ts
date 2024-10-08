import "./WorldMap.css"
import React, { useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
interface LeafletIconOptions {
  iconUrl: string;
  iconSize?: [number, number];
  iconAnchor?: [number, number];
  popupAnchor?: [number, number];
}

const Home: React.FC = () => {
  const mapRef = useRef(null)
  const startCenter = [41.88199188922012, -87.62778901271656] as L.LatLngTuple
  
  // useEffect(() => {
  //   // If you need to access the map instance programmatically, you can use the ref here
  //   console.log(mapRef.current)
  // }, [])

  const renderMarkers = () => {

    const customMarker = new (L.icon as any)({
      iconUrl: "https://unpkg.com/leaflet@1.5.1/dist/images/marker-icon.png",
      // iconSize: [25, 41],
      iconSize: [20, 30],
      iconAnchor: [10, 41],
      popupAnchor: [2, -40]
    } as LeafletIconOptions)

    const markers = [
      { position: [41.719035478403946, -87.97891261584903], label: 'Argonne' },
      { label: "University of Chicago", position:[ 41.789722, -87.599724]},
      { label: "University of Illinois Chicago", position:[ 41.871713525341455, -87.64878082347235]},
      { label: "University of Illinois Springfield", position:[ 39.73137541286711, -89.6174565206494]},
      { label: "UIUC", position:[ 40.1022599866359, -88.22718294788086]},
      { label: "IIT", position:[ 41.83506488283652, -87.62660892320483]},
      { label: "Northwestern", position:[ 42.05662648020408, -87.67525625956009]},
      { label: "Cardiff University", position:[ 51.59983570318919, -3.1967927163595706]},
      { label: "The Hebrew University of Jerusalem", position:[ 31.88766445686484, 35.255907507732424]},
      { label: "Ramaiah Medical College", position:[ 13.030710217802023, 77.56676483021387]},
      { label: "National Taiwan University", position:[ 25.017573789679794, 121.53977326237217]},
      { label: "Tel Aviv University", position:[ 32.11353214197986, 34.804462808077496]},
      { label: "National University of Singapore", position:[ 1.297838016556545, 103.7779825466288]},
      { label: "Deutsches Elektronen-Synchrotron DESY", position:[ 53.5731466126537, 9.881232499942262]},
      { label: "National Autonomous University of Mexico", position:[ 19.319443451809292, -99.18444421579817]},
      { label: "Fermilab", position:[ 41.83871958797379, -88.26159787019316]},
      { label: "Industrial Technology Research Institute", position:[ 24.777944484561733, 121.04306658874049]},
      { label: "National Yang Ming Chiao Tung University", position:[ 24.787149033992424, 120.99752909604742]},
    ]

    return markers.map((marker:any, index: any) => {
      return (
        <Marker position={marker.position} icon={customMarker}>
          <Popup>
          {marker.label}
          </Popup>
        </Marker>
      )
    })

  }
  
  return (
    <div className="home" id="home" style={{ height: "100vh" }}>
      <MapContainer ref={mapRef} center={startCenter} zoom={3} style={{ height: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
        />
        { renderMarkers()}
      </MapContainer>
    </div>
  )
}

export default Home
