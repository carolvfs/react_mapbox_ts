import  React, { useEffect, useState } from 'react'
import { Form, Row, Col } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'

export type Mode = 'side-by-side' | 'split-screen' | 'single-screen'

function ControlPanel(props: {mode: Mode; onModeChange: (newMode: Mode) => void}) {

  const [isVisible, setIsVisible] = useState<boolean>(false)

  const handleClick = (mode: Mode) => props.onModeChange(mode as Mode)

  return (
    <div>
      <Row display="inline-block" xs="auto" style={{ zIndex: 1001, fontSize: "16px", marginLeft: '10px', marginTop: '5px', marginBottom: "10px", color: "#696969" }}>        
        <Col>
          <Form.Check
            type={"radio"}
            label={'Single screen'}
            id={'single-screen'}
            checked={props.mode === 'single-screen'}
            onChange={() => handleClick('single-screen')}
          />
        </Col>
        <Col>
        
          <Form.Check
            type={"radio"}
            label={'Side by side'}
            id={'side-by-side'}
            checked={props.mode === 'side-by-side'}
            onChange={() => handleClick('side-by-side')}
            />
        </Col>
        <Col>
          <Form.Check
            type={"radio"}
            label={'Split screen'}
            id={'split-screen'}
            checked={props.mode === 'split-screen'}
            onChange={() => handleClick('split-screen')}
          />
          </Col>
      </Row>
      {isVisible && (
        <div  style={{ zIndex: 1001, fontSize: "16px", marginLeft: '10px', marginTop: '5px', color: "#696969", position:"absolute" }}>
          <Form.Check
            type={"radio"}
            label={'Single screen'}
            id={'single-screen'}
            checked={props.mode === 'single-screen'}
            onChange={() => handleClick('single-screen')}
          />
          <Form.Check
            type={"radio"}
            label={'Side by side'}
            id={'side-by-side'}
            checked={props.mode === 'side-by-side'}
            onChange={() => handleClick('side-by-side')}
          />
          <Form.Check
            type={"radio"}
            label={'Split screen'}
            id={'split-screen'}
            checked={props.mode === 'split-screen'}
            onChange={() => handleClick('split-screen')}
          />
        </div>
      )}
    </div>
  )

}

export default React.memo(ControlPanel)