import React, { useState } from 'react'
import axios from 'axios'
import { useContext } from 'react'
import { GlobalContext } from '../context/GlobalContextProvider'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const navigate = useNavigate()

  // UI & state management
  const [isLogin, setIsLogin] = useState(true) // Toggle between login and signup
  const [error, setError] = useState("") // Error message
  const [isLoding, setIsLoding] = useState(false) // Loading spinner state
  const [email, setEmail] = useState("") // Email input
  const [password, setPassword] = useState("") // Password input
  const [confirmPassword, setConfirmPassword] = useState("") // Confirm password for signup

  // Global context
  const { backendUrl, setToken } = useContext(GlobalContext)

  // Form submission handler
  const handleSubmit = async () => {
    setIsLoding(true);
    try {
      let url = backendUrl + "/api/admin";

      if (isLogin) {
        url += "/login"; // Login endpoint
      } else {
        if (password !== confirmPassword) {
          setError("Password does not match"); // Handle mismatch
          setIsLoding(false);
          return;
        }
        url += "/register"; // Registration endpoint
      }

      // API request
      const response = await axios.post(url, { email, password });

      if (response.data.success) {
        setError("");
        localStorage.setItem("token", response.data.token); // Store token locally
        setToken(response.data.token); // Update global token
        navigate("/"); // Redirect to homepage
      } else {
        throw new Error(response.data.message);
      }
    } catch (err) {
      console.log(err.message || "Something went wrong");
      setError(err.message || "Something went wrong"); // Set error message
    } finally {
      // Reset fields
      setConfirmPassword("");
      setEmail("");
      setIsLoding(false);
      setPassword("");
    }
  };

  return (
    <div className='w-[100vw] h-[100vh] flex bg-white fixed inset-0 z-50'>
      <div className='mx-auto my-auto text-center'>
        {/* Heading based on login/signup */}
        {isLogin ?
          <h1 className='text-3xl '>Hello Again!</h1> :
          <h1 className='text-3xl '>Hey there!</h1>
        }

        {/* Input form */}
        <div className='flex flex-col w-[300px] mt-8  mb-10'>
          <input
            type="email"
            required
            placeholder='Email'
            className='border-2 border-gray-500 px-3 py-2 rounded-sm mb-4'
            value={email}
            onChange={(e) => { setEmail(e.target.value) }}
          />
          <input
            type="password"
            required
            placeholder='Enter password'
            className='border-2 border-gray-500 px-3 py-2 rounded-sm'
            value={password}
            onChange={(e) => { setPassword(e.target.value) }}
          />
          {/* Confirm password only in signup mode */}
          {!isLogin && <input
            type="password"
            required
            placeholder='Confirm password'
            className='border-2 border-gray-500 px-3 py-2 rounded-sm  mt-4'
            value={confirmPassword}
            onChange={(e) => { setConfirmPassword(e.target.value) }}
          />}
          
          {/* Show error if any */}
          {error && <p className='text-red-600 '>{error}</p>}

          {/* Login / Signup button */}
          {isLogin ?
            <button
              className='bg-[#2753ad] py-1 rounded-sm text-white mt-4 cursor-pointer'
              onClick={handleSubmit}
            >
              <span className='flex items-center justify-center'>
                {/* Spinner when loading */}
                {isLoding && <div className="h-4 w-4 rounded-full border-2 border-white  border-t-[#2753ad] mr-2 animate-spin"></div>}
                <p>Login</p>
              </span>
            </button>
            :
            <button
              className='bg-[#2753ad] py-1 rounded-sm text-white mt-4 cursor-pointer'
              onClick={handleSubmit}
            >
              Create account
            </button>
          }
        </div>

        {/* Switch between login and signup */}
        {isLogin ?
          <p className='text-center'>Don't have an account?
            <span
              className='ml-2 cursor-pointer font-semibold text-[#2b5ec2]'
              onClick={() => { setIsLogin(false) }}
            >Sign up</span>
          </p>
          :
          <p className='text-center'>Already have an account?
            <span
              className='ml-2 cursor-pointer font-semibold text-[#2b5ec2]'
              onClick={() => { setIsLogin(true) }}
            >Sign in</span>
          </p>
        }
      </div>
    </div>
  )
}

export default Login
