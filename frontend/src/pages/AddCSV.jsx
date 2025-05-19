import React, { useContext, useState } from 'react';
import axios from 'axios';
import { assets } from '../assets/assets'; // Asset images (e.g., add work image)
import { GlobalContext } from '../context/GlobalContextProvider'; // Global config context

const AddCSV = () => {
  const [file, setFile] = useState(null); // State to store selected file

  // Getting backend URL and auth token from context
  const { backendUrl, token } = useContext(GlobalContext);

  // Handle file input change
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile); // Save selected file to state
    }
  };

  // Handle upload button click
  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file first.');
      return;
    }

    // Create form data to send as multipart/form-data
    const formData = new FormData();
    formData.append('file', file); // Append file to form data

    try {
      // Send POST request to upload file
      const res = await axios.post(`${backendUrl}/api/admin/upload-file`, formData, {
        headers: {
          token // Authorization token
        },
      });

      if (res.data.success) {
        console.log('Upload complete');
        alert('File uploaded successfully');
        setFile(null); // Reset file input
      } else {
        alert('Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Error uploading file');
    }
  };

  return (
    <div className="w-full">
      {/* Upload section with image as trigger */}
      <div className="flex justify-center mt-10">
        <label htmlFor="media" className="flex flex-col space-y-4">
          {/* Image to click and trigger file selection */}
          <img
            src={assets.addworkmain}
            alt="add work"
            className="max-sm:w-32 w-52 cursor-pointer"
          />
        </label>

        {/* Hidden file input */}
        <input
          type="file"
          id="media"
          hidden
          accept=".csv, .xlsx, .xls" // Accept CSV and Excel formats
          onChange={handleFileChange}
        />
      </div>

      {/* If file is selected, show file name and upload button */}
      {file ? (
        <div className="w-full flex flex-col items-center mt-3 space-y-4">
          <p className="text-gray-600">{file.name}</p>
          <button
            onClick={handleUpload}
            className="bg-[#2b5ec2] text-white px-8 py-1 rounded-sm cursor-pointer"
          >
            Submit
          </button>
        </div>
      ) : (
        <p className="text-center mt-4">Choose file</p> // Prompt if no file is selected
      )}
    </div>
  );
};

export default AddCSV;
