import React from 'react'
import { Routes, Route, useMatch } from 'react-router-dom'

import paths from '../consts/route-paths'
import WorldMap from '../views/world-map/WorldMap'

// const homePath    = `${paths.home}`

const MyRoutes = () => {

    return (
        <Routes>
            <Route path='/' element={<WorldMap/>} />
        </Routes>
    )
}

export default MyRoutes