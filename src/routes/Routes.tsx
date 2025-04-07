import React from 'react'
import { Routes, Route } from 'react-router-dom'

// import paths from '../consts/route-paths'
import WorldMap from '../views/world-map/WorldMap'
import SideBySide from '../views/side-by-side/Home'
import Path from '../views/path/home/Home'
import SbsScroll from '../views/side-by-side-scroll/home/Home'
import DrawerWrapper from '../views/drawer-wrapper/DrawerWrapper'
import HmapHome from '../views/hmap/HmapHome'
import AddPointsHome from '../views/add-points.tsx/AddPointsHome'
import AddCustomIconsHome from '../views/add-custom-icon/AddCustomIconsHome'
import AddD3IconHome from '../views/add-d3-icon/AddD3IconHome'
import PointsHome from '../views/layer-points/Points'
import AddImageHome from '../views/add-image/AddImageHome'

// const homePath    = `${paths.home}`

const MyRoutes = () => {

    return (
        <Routes>
            <Route path='/' element={<AddImageHome/>} />
            <Route path='/addpoints' element={<AddPointsHome/>} />
            <Route path='/worldmap' element={<WorldMap/>} />
            <Route path='/sidebyside' element={<SideBySide/>} />
            <Route path='/path' element={<Path/>} />
            <Route path='/sbsscroll' element={<SbsScroll/>} />
            <Route path='/drawer' element={<DrawerWrapper anchor={"right"} buttons={['Home', 'Settings', 'Info']}/>} />
            <Route path='/hmap' element={<HmapHome/>} />
            <Route path='/customicons' element={<AddCustomIconsHome/>} />
            <Route path='/d3icon' element={<AddD3IconHome/>} />
            <Route path='/points' element={<PointsHome/>} />
            <Route path='/addimage' element={<AddImageHome/>} />
        </Routes>
    )
}

export default MyRoutes