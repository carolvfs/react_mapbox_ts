import React from "react"
import MapComponent from "../map-path/MapPath"

const Home: React.FC = () => {
  return (
    <div className="home" id="home" style={{ width:"100%", height:"100%" }}>
      <MapComponent/>
    </div>
  )
}

export default Home