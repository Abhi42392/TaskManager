import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { assets } from '../assets/assets'
import { useContext } from 'react'
import { GlobalContext } from '../context/GlobalContextProvider'

const Sidebar = () => {
  // Access logout function from global context
  const { handleLogout } = useContext(GlobalContext)

  // Toggle for mobile/responsive use (currently unused)
  const [showMenu, setShowMenu] = useState(false)

  return (
    <>
      {/* Sidebar container */}
      <div className='
        flex flex-col justify-between 
        h-[100vh] 
        lg:w-[18vw] md:w-[6vw] min-w-fit 
        bg-white rounded-tr-3xl rounded-br-3xl 
        shadow-[0_4px_20px_rgba(0,0,0,0.2)]
        border border-gray-100 p-4 
        max-sm:hidden' // hide sidebar on very small screens
      >
        {/* Navigation links */}
        <div className='flex flex-col'>
          
          {/* Dashboard Link */}
          <NavLink
            to={"/"}
            className={({ isActive }) =>
              isActive
                ? "text-[#212121] font-semibold bg-[#efefef] rounded-2xl py-1 px-4"
                : "text-[#6f6f6f] py-1 px-4"
            }
          >
            <div className='flex justify-between items-center'>
              <p className='hidden lg:block'>Dashboard</p>
              <img src={assets.dashboard} alt="dashboard" className='w-5 h-5' />
            </div>
          </NavLink>

          {/* Add Agent Link */}
          <NavLink
            to={"/add-agent"}
            className={({ isActive }) =>
              isActive
                ? "text-[#212121] font-semibold bg-[#efefef] rounded-2xl py-1 px-4 my-2"
                : "text-[#6f6f6f] py-1 px-4 my-2"
            }
          >
            <div className='flex justify-between items-center'>
              <p className='hidden lg:block'>Add Agent</p>
              <img src={assets.addagent} alt="add agent" className='w-5 h-5' />
            </div>
          </NavLink>

          {/* Upload File Link */}
          <NavLink
            to={"/add-work"}
            className={({ isActive }) =>
              isActive
                ? "text-[#212121] font-semibold bg-[#efefef] rounded-2xl py-1 px-4"
                : "text-[#6f6f6f] py-1 px-4"
            }
          >
            <div className='flex justify-between items-center'>
              <p className='hidden lg:block'>Upload File</p>
              <img src={assets.addwork} alt="add work" className='w-5 h-5' />
            </div>
          </NavLink>
        </div>

        {/* Spacer to push logout button to bottom */}
        <div className='flex-1'></div>

        {/* Logout button */}
        <button
          className='bg-[#2753ad] text-white rounded-md cursor-pointer py-1'
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </>
  )
}

export default Sidebar
