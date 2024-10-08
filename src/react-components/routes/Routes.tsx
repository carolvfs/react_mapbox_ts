import React from 'react'
import { Routes, Route, useMatch } from 'react-router-dom'

import paths from '../../consts/route-paths'
import Home from '../home/Home'

const homePath    = `${paths.home}`

const MyRoutes = () => {

    return (
        <Routes>
            <Route path='/' element={<Home/>} />
        </Routes>
    )
}

export default MyRoutes