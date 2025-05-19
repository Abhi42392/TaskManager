import React, { useState } from 'react'
import { Routes, Route, NavLink } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import AddAgent from './pages/AddAgent'
import AddCSV from './pages/AddCSV'
import Sidebar from './components/Sidebar'
import { useContext } from 'react'
import { GlobalContext } from './context/GlobalContextProvider'
import { assets } from './assets/assets'

const App = () => {
  const { token, handleLogout } = useContext(GlobalContext)

  // Controls mobile menu visibility
  const [showMenu, setShowMenu] = useState(false)

  // If not logged in, show login page only
  if (!token) return <Login />

  return (
    <>
      {/* Hamburger menu icon for small screens */}
      <img
        src={assets.menu_icon}
        alt="menu"
        className='w-7 mx-1 sm:hidden m-4'
        onClick={() => { setShowMenu(true) }}
      />

      {/* Main app layout: Sidebar + content */}
      <div className='flex'>
        {/* Sidebar for larger screens */}
        <Sidebar />

        {/* Page content */}
        <div className='flex-1 w-full overflow-x-hidden'>
          <Routes>
            <Route path='/login' element={<Login />} />
            <Route path='/' element={<Dashboard />} />
            <Route path='/add-agent' element={<AddAgent />} />
            <Route path='/add-work' element={<AddCSV />} />
          </Routes>
        </div>
      </div>

      {/* Mobile slide-in menu */}
      <div className={`
        ${showMenu ? 'fixed w-full' : 'h-0 w-0'}
        md:hidden left-0 top-0 bottom-0 z-20 
        overflow-hidden bg-white transition-all
      `}>
        {/* Close icon */}
        <img
          onClick={() => { setShowMenu(false) }}
          src={assets.cross_icon}
          alt="cross icon"
          className='h-6 m-4'
        />

        {/* Mobile navigation links */}
        <ul className='flex flex-col items-center mobile-menu space-y-3 mt-14'>
          <NavLink onClick={() => setShowMenu(false)} to={"/"}><p>Dashboard</p></NavLink>
          <NavLink onClick={() => setShowMenu(false)} to={"/add-agent"}><p>Add Agent</p></NavLink>
          <NavLink onClick={() => setShowMenu(false)} to={"/add-work"}><p>Upload File</p></NavLink>
          
          {/* Logout button */}
          <button
            className='bg-[#2753ad] text-white rounded-md cursor-pointer py-1 px-4'
            onClick={handleLogout}
          >
            Logout
          </button>
        </ul>
      </div>
    </>
  )
}

export default App
