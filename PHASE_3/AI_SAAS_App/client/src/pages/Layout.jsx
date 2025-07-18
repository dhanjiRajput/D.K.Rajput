import React from 'react'
import { Outlet } from 'react-router-dom'

const Layout = () => {
  return (
    <div>
      <h2>AI Layout Header</h2>
      {/* This is where child route components will be rendered */}
      <Outlet />
    </div>
  )
}

export default Layout