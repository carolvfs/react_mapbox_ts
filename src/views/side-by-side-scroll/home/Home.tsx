import React, { useCallback, useEffect, useState } from "react"
import Map from "../map/Map"
import MapCompare from "../map-compare/MapCompare"
import MapSideBySide from "../map-side-by-side/MapSideBySide"
import LateralPanel from "../lateral-panel/LateralPanel"
import SideBySideControl, { Mode } from "../side-by-side-control/SideBySideControl"
import { DataLoader } from "../data-loader/DataLoader"

const Home: React.FC = () => {
  const screenOptions:Mode[] = ["single-screen", "side-by-side", "split-screen"]
  const [mode, setMode] = useState<Mode>(screenOptions[0])

  const [layers, setLayers] = useState<any>([])
  const [mapInfo, setMapInfo] = useState<any>({})

  const renderMap = () => {
    return (
      <div style={{ position: "absolute", width:"1000px", height:"500px", backgroundColor:"purple", margin:"10px", padding: "5px" }}>
        <div style={{ position: "absolute", width:"1000px", height:"500px"}}>
          { mode === screenOptions[0] 
            ? <Map 
                mapInfo={mapInfo}
                layers={layers}
                timeStamp={"26"}
                /> 
            : mode === screenOptions[1] 
              ? <MapSideBySide/> 
              : <MapCompare/> 
          }
        </div>
      </div>
    )
  }

  const updateLayers = useCallback(async () => {
    const _layers = await DataLoader.getLayers()
    setLayers(_layers)
  },[])

  const updateMapInfo = useCallback(async () => {
    const _mapInfo = await DataLoader.getMapInfo()
    setMapInfo(_mapInfo)
  },[])

  // useEffect(() => {
  //   updateLayers()
  // },[updateLayers])

  // useEffect(() => {  updateMapInfo() },[updateMapInfo])



  return (
    <div className="home" id="home" style={{ width:"100%", height:"100%" }}>
      <LateralPanel side="right" isHidden={false}>
        <SideBySideControl mode={mode} onModeChange={setMode} />
      </LateralPanel>
      {renderMap()}
    </div>
  )
}

export default Home