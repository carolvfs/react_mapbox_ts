import "./LateralPanel.css"
import React from "react"


const LateralPanel = (props:any) => {
   
  return (
    <React.Fragment>
      <div className={`${props.side}-panel ${props.isHidden ? props.side+'-panel-hidden' : ''}`}>
        <div style={{zIndex: 1001, overflowY: "auto", overflowX: "hidden", fontSize: "24px", height: "100%"}}>
          {props.children}
        </div>
      </div>
    </React.Fragment>
  )
}

export default LateralPanel