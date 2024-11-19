import React from "react"

const ElementWrapper = (props: any) => {
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
      {props.children}
    </div>
  )
}

export default ElementWrapper