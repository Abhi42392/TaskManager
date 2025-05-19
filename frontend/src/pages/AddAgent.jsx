import React, { useContext, useState } from 'react';
import 'react-phone-input-2/lib/style.css'; // Styles for the phone input
import PhoneInput from 'react-phone-input-2'; // External phone input component
import axios from 'axios'; // For making HTTP requests
import { GlobalContext } from '../context/GlobalContextProvider'; // Global context for backend URL and token

const AddAgent = () => {
  // Form states
  const [phone, setPhone] = useState(""); // Stores phone number
  const [countryCode, setCountryCode] = useState(""); // Stores selected country code
  const [name, setName] = useState(""); // Agent name
  const [email, setEmail] = useState(""); // Agent email
  const [password, setPassword] = useState(""); // Agent password

  // UI state
  const [error, setError] = useState(""); // Error message
  const [isLoading, setIsLoading] = useState(false); // Loading state

  // Accessing global context values
  const { backendUrl, token } = useContext(GlobalContext);

  // Handles form submission
  const handleSubmit = async () => {
    try {
      setIsLoading(true); // Start loading

      // Send POST request to backend to add new agent
      const response = await axios.post(`${backendUrl}/api/admin/add-agent`, {
        name,
        email,
        password,
        phone,
        countryCode,
      }, {
        headers: { token }, // Send token in headers for authentication
      });

      console.log("Agent added:", response.data);

      // If the backend responds with success=false, throw an error
      if (!response.data.success) {
        throw new Error(response.data.message);
      }

    } catch (err) {
      console.log("Error adding agent:", err.message);
      setError(err.message || "Something went wrong"); // Show error message

    } finally {
      // Reset form fields and UI state
      setCountryCode("");
      setEmail("");
      setError("");
      setName("");
      setPassword("");
      setPhone("");
      setIsLoading(false);
    }
  };

  return (
    <div className='mx-auto w-[300px] mt-32 flex flex-col space-y-4'>
      {/* Name Input */}
      <input
        type="text"
        required
        placeholder='Name'
        className='border-2 border-gray-500 px-3 py-2 rounded-sm'
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      {/* Email Input */}
      <input
        type="email"
        required
        placeholder='Email'
        className='border-2 border-gray-500 px-3 py-2 rounded-sm mb-4'
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      {/* Phone Number Input with Country Code */}
      <PhoneInput
        country={'in'}
        value={phone}
        onChange={(value, country) => {
          setPhone(value); // Full phone number
          setCountryCode(country.dialCode); // Set country code separately
        }}
        inputClass="w-full border-2 rounded-sm py-2 px-3"
        containerClass="w-full"
      />

      {/* Password Input */}
      <input
        type="password"
        required
        placeholder='Password'
        className='border-2 border-gray-500 px-3 py-2 rounded-sm mb-4'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {/* Error Message */}
      {error && <p className='text-red-600 text-center'>{error}</p>}

      {/* Submit Button */}
      <button
        className='bg-[#2b5ec2] text-white py-1 rounded-sm cursor-pointer'
        onClick={handleSubmit}
      >
        <span className='flex items-center justify-center'>
          {/* Loading Spinner */}
          {isLoading && (
            <div className="h-4 w-4 rounded-full border-2 border-white border-t-[#2753ad] mr-2 animate-spin"></div>
          )}
          <p>Add Agent</p>
        </span>
      </button>
    </div>
  );
};

export default AddAgent;
