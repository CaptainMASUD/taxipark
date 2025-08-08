"use client"

import { useState, useEffect } from "react"
import { Filter, RotateCcw, Loader, AlertCircle } from 'lucide-react'
import axios from 'axios' // Import axios directly

export default function EarningReport() {
  const [reportData, setReportData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  // API Base URL (moved from lib/api.js)
  const API_BASE_URL =  'http://localhost:3000/api'

  // Create axios instance (moved from lib/api.js)
  const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  })

  // Add request interceptor to include auth token (moved from lib/api.js)
  apiClient.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('authToken') || 'mock-token'
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )

  // Add response interceptor for error handling (moved from lib/api.js)
  apiClient.interceptors.response.use(
    (response) => response.data,
    (error) => {
      const message = error.response?.data?.error || error.message || 'Network error'
      return Promise.reject(new Error(message))
    }
  )

  // Simple toast notification (moved from utils/toast.js)
  const showToast = (message, type = 'info') => {
    let toastContainer = document.querySelector('.toast-container')
    if (!toastContainer) {
      toastContainer = document.createElement('div')
      toastContainer.className = 'toast-container'
      toastContainer.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        display: flex;
        flex-direction: column;
        gap: 10px;
      `
      document.body.appendChild(toastContainer)
    }
    
    const toast = document.createElement('div')
    toast.textContent = message
    
    const baseStyles = `
      padding: 12px 16px;
      border-radius: 6px;
      color: white;
      font-weight: 500;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      transform: translateX(100%);
      transition: transform 0.3s ease;
      max-width: 300px;
      word-wrap: break-word;
    `
    
    const typeStyles = {
      success: 'background-color: #10b981;',
      error: 'background-color: #ef4444;',
      info: 'background-color: #3b82f6;',
      warning: 'background-color: #f59e0b;'
    }
    
    toast.style.cssText = baseStyles + (typeStyles[type] || typeStyles.info)
    
    toastContainer.appendChild(toast)
    
    // Animate in
    setTimeout(() => {
      toast.style.transform = 'translateX(0)'
    }, 10)
    
    // Remove after 4 seconds
    setTimeout(() => {
      toast.style.transform = 'translateX(100%)'
      setTimeout(() => {
        if (toastContainer.contains(toast)) {
          toastContainer.removeChild(toast)
        }
      }, 300)
    }, 4000)
  }

  useEffect(() => {
    // Set default date range for the last 7 days
    const today = new Date()
    const sevenDaysAgo = new Date(today)
    sevenDaysAgo.setDate(today.getDate() - 7)

    setStartDate(sevenDaysAgo.toISOString().split('T')[0])
    setEndDate(today.toISOString().split('T')[0])
  }, [])

  useEffect(() => {
    if (startDate && endDate) {
      fetchEarningReport()
    }
  }, [startDate, endDate])

  const fetchEarningReport = async () => {
    try {
      setLoading(true)
      setError(null)
      // Direct API call using the local apiClient
      const response = await apiClient.post('/taxipark/report/earning', { startDate, endDate })
      setReportData(response.report || [])
    } catch (err) {
      setError(err.message || 'Failed to fetch earning report')
      showToast(err.message || 'Failed to fetch earning report', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleResetFilter = () => {
    const today = new Date()
    const sevenDaysAgo = new Date(today)
    sevenDaysAgo.setDate(today.getDate() - 7)

    setStartDate(sevenDaysAgo.toISOString().split('T')[0])
    setEndDate(today.toISOString().split('T')[0])
  }

  if (loading) {
    return (
      <div className="flex-1 p-6 flex items-center justify-center">
        <div className="flex items-center space-x-2 text-white">
          <Loader className="w-6 h-6 animate-spin" />
          <span>Loading earning report...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex-1 p-6 flex items-center justify-center">
        <div className="flex items-center space-x-2 text-red-400">
          <AlertCircle className="w-6 h-6" />
          <span>{error}</span>
          <button onClick={fetchEarningReport} className="ml-4 px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600">
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 p-6 overflow-auto">
      <h1 className="text-2xl font-bold mb-6 text-white">Driver's Earning Report</h1>

      {/* Filter Bar */}
      <div className="flex items-center space-x-4 mb-4">
        <div className="flex items-center space-x-2 bg-gray-700 text-gray-300 border border-gray-600 rounded-lg px-4 py-2">
          <Filter className="w-4 h-4" />
          <span>Filter By</span>
        </div>

        <div className="flex items-center space-x-2">
          <label htmlFor="startDate" className="text-gray-300 text-sm">From:</label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <label htmlFor="endDate" className="text-gray-300 text-sm">To:</label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={fetchEarningReport}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2"
          >
            Apply
          </button>
        </div>

        <button className="flex items-center space-x-2 text-orange-400 hover:text-orange-300 px-4 py-2 rounded-lg" onClick={handleResetFilter}>
          <RotateCcw className="w-4 h-4" />
          <span>Reset Filter</span>
        </button>
      </div>

      {/* Active Filter Tag - Displaying selected dates */}
      {startDate && endDate && (
        <div className="flex items-center bg-gray-700 text-gray-300 px-3 py-2 rounded-lg text-sm mb-6 w-fit">
          <span>{`Report from ${new Date(startDate).toLocaleDateString()} to ${new Date(endDate).toLocaleDateString()}`}</span>
        </div>
      )}

      {/* Earning Table */}
      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-700">
            <tr>
              <th className="text-left p-4 text-gray-300 font-medium">Driver's Name</th>
              <th className="text-left p-4 text-gray-300 font-medium">Vehicle Code</th>
              <th className="text-left p-4 text-gray-300 font-medium">Mileage, km</th>
              <th className="text-left p-4 text-gray-300 font-medium">Total Earning</th>
            </tr>
          </thead>
          <tbody>
            {reportData.length > 0 ? (
              reportData.map((earning, index) => (
                <tr key={earning.drive.userId || index} className="border-t border-gray-700 hover:bg-gray-750">
                  <td className="p-4">
                    <a href="#" className="text-blue-400 hover:underline font-medium">
                      {earning.drive.User?.name || 'N/A'}
                    </a>
                  </td>
                  <td className="p-4 text-white">{earning.vehicle?.code || 'N/A'}</td>
                  <td className="p-4 text-white">{earning.totalMileage.toFixed(2)}</td>
                  <td className="p-4 text-white">BYN {earning.totalEarning.toFixed(2)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-8 text-gray-400">
                  No earning data found for the selected period.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination - Placeholder for now */}
      <div className="flex items-center justify-between mt-6">
        <span className="text-gray-400 text-sm">Showing {reportData.length} entries</span>
        <div className="flex items-center space-x-2">
          <button className="px-3 py-1 bg-gray-700 text-gray-300 rounded hover:bg-gray-600 disabled:opacity-50" disabled>Previous</button>
          <button className="px-3 py-1 bg-blue-600 text-white rounded">1</button>
          <button className="px-3 py-1 bg-gray-700 text-gray-300 rounded hover:bg-gray-600 disabled:opacity-50" disabled>Next</button>
        </div>
      </div>
    </div>
  )
}
