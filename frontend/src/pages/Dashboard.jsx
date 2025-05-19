import React, { useContext, useEffect, useState } from 'react'
import { GlobalContext } from '../context/GlobalContextProvider'
import axios from 'axios'

const Dashboard = () => {
  const [leads, setLeads] = useState([]) // State to store all fetched leads

  // Access backend URL and token from global context
  const { backendUrl, token } = useContext(GlobalContext)

  // Function to fetch leads from the backend
  const fetchLeads = async () => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/admin/get-all-leads`,
        {},
        { headers: { token } }
      )
      if (response.data.success) {
        setLeads(response.data.leads) // Update state with fetched leads
      } else {
        throw new Error(response.data.message)
      }
    } catch (err) {
      console.log(err.message || "Something went wrong")
    }
  }

  // Format a date into a readable string
  const formatDate = (date) => {
    return new Date(date).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  // Fetch leads once on component mount
  useEffect(() => {
    fetchLeads()
  }, [])

  return (
    <>
      <div className="w-full h-full md:p-4 overflow-auto">
        {/* Header row of the table */}
        <div className="min-w-[600px] grid md:grid-cols-[50px_0.75fr_1fr_2fr_1fr_1fr] grid-cols-[50px_0.75fr_1fr_2fr_1fr] bg-[#3E3F5B] text-white font-semibold text-sm md:text-lg px-4 py-2 md:rounded-md sticky top-0 z-10">
          <div>Slno</div>
          <div>Name</div>
          <div>Phone</div>
          <div>Notes</div>
          <div className="hidden md:block">Date</div>
          <div>Agent</div>
        </div>

        {/* Lead rows */}
        <div className="min-w-[600px]">
          {leads.map((row, index) => (
            <div
              key={row._id || index}
              className="grid md:grid-cols-[50px_0.75fr_1fr_2fr_1fr_1fr] grid-cols-[50px_0.75fr_1fr_2fr_1fr] px-4 py-2 border-b border-gray-300 text-xs md:text-sm hover:bg-[#F6F1DE]"
            >
              <div>{index + 1}</div>
              <div className="truncate">{row.name}</div>
              <div className="truncate">{row.phone}</div>
              <div className="truncate">{row.notes}</div>
              <div className="truncate hidden md:block">{formatDate(row.date)}</div>
              <div className="truncate">{row.agent.name}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default Dashboard
  