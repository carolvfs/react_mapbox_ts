import React from 'react'
import { Routes, Route } from 'react-router-dom'

// import paths from '../consts/route-paths'
import WorldMap from '../views/world-map/WorldMap'
import SideBySide from '../views/side-by-side/Home'
import Path from '../views/path/home/Home'

// const homePath    = `${paths.home}`

const MyRoutes = () => {

    return (
        <Routes>
            <Route path='/' element={<WorldMap/>} />
            <Route path='/sidebyside' element={<SideBySide/>} />
            <Route path='/path' element={<Path/>} />
        </Routes>
    )
}

export default MyRoutes