import React, { createContext, useState } from 'react'

// Create the context
export const GlobalContext = createContext()

// Create the provider component
const GlobalContextProvider = ({ children }) => {
  // Base URL for backend API
  const backendUrl = "http://localhost:4000"

  // State to manage the token, initialized from localStorage if available
  const [token, setToken] = useState(
    localStorage.getItem('token') ? localStorage.getItem('token') : ''
  )

  // Logout handler: removes token from both state and localStorage
  const handleLogout = () => {
    localStorage.removeItem('token')
    setToken('')
  }

  return (
    // Provide global values to children components
    <GlobalContext.Provider value={{ backendUrl, token, setToken, handleLogout }}>
      {children}
    </GlobalContext.Provider>
  )
}

export default GlobalContextProvider
