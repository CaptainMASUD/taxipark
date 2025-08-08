import React from 'react'
import { Outlet } from "react-router-dom"
import Navbar from "../Navbar/Navbar"
import FooterComponent from '../Footer/Footer'
import { ShopProvider } from '../../Context/ShopContext'

function Layout() {
  return (
    <ShopProvider>
      {/* <Navbar/> */}
      <Outlet/>
      {/* <FooterComponent/> */}
    </ShopProvider>
  )
}

export default Layout
