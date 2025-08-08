"use client"

import { useState, useEffect, useMemo } from "react"
import { Filter, RotateCcw, Loader, AlertCircle, Star } from 'lucide-react'
import axios from 'axios'


export default function RideReport() {
  const [reportData, setReportData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Filters
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [selectedDriver, setSelectedDriver] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("")
  const [uniqueDrivers, setUniqueDrivers] = useState([])

  
  const [offset, setOffset] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const limit = 40


  const API_BASE_URL = 'http://localhost:3000/api'


  const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: { 'Content-Type': 'application/json' },
  })

  apiClient.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('authToken') || 'mock-token'
      if (token) config.headers.Authorization = `Bearer ${token}`
      return config
    },
    (error) => Promise.reject(error)
  )

  apiClient.interceptors.response.use(
    (response) => response.data,
    (error) => {
      const message = error.response?.data?.error || error.message || 'Network error'
      return Promise.reject(new Error(message))
    }
  )


  const showToast = (message, type = 'info') => {
    let container = document.querySelector('.toast-container')
    if (!container) {
      container = document.createElement('div')
      container.className = 'toast-container'
      container.style.cssText = `
        position: fixed;
        top: 16px;
        right: 16px;
        z-index: 10000;
        display: flex;
        flex-direction: column;
        gap: 10px;
      `
      document.body.appendChild(container)
    }
    const toast = document.createElement('div')
    toast.textContent = message
    const base = `
      padding: 10px 14px;
      border-radius: 6px;
      color: white;
      font-weight: 500;
      box-shadow: 0 4px 12px rgba(0,0,0,.15);
      transform: translateX(100%);
      transition: transform .3s ease;
      max-width: 300px;
      word-wrap: break-word;
      font-size: 13px;
    `
    const typeStyles = {
      success: 'background-color:#10b981;',
      error: 'background-color:#ef4444;',
      info: 'background-color:#3b82f6;',
      warning: 'background-color:#f59e0b;',
    }
    toast.style.cssText = base + (typeStyles[type] || typeStyles.info)
    container.appendChild(toast)
    setTimeout(() => { toast.style.transform = 'translateX(0)' }, 10)
    setTimeout(() => {
      toast.style.transform = 'translateX(100%)'
      setTimeout(() => {
        if (container.contains(toast)) container.removeChild(toast)
      }, 300)
    }, 3500)
  }

  // Default last 7 days
  useEffect(() => {
    const today = new Date()
    const sevenDaysAgo = new Date(today)
    sevenDaysAgo.setDate(today.getDate() - 7)
    setStartDate(sevenDaysAgo.toISOString().split('T')[0])
    setEndDate(today.toISOString().split('T')[0])
  }, [])

  // Fetch on dates change (reset pagination)
  useEffect(() => {
    if (!startDate || !endDate) return
    setOffset(0)
    setHasMore(true)
    fetchRideReport(true, 0)
  }, [startDate, endDate])

  const fetchRideReport = async (reset = false, useOffset = offset) => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiClient.post('/taxipark/report/ride', {
        startDate,
        endDate,
        offset: useOffset
      })
      const rides = response.report || []

      if (reset) {
        setReportData(rides)
      } else {
        setReportData(prev => [...prev, ...rides])
      }

      
      setHasMore(rides.length === limit)

     
      const merged = reset ? rides : [...reportData, ...rides]
      const names = [...new Set(merged.map(r => r?.driver?.User?.name).filter(Boolean))]
      setUniqueDrivers(names)

      if (reset && rides.length === 0) {
        showToast('No rides found for the selected range', 'info')
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch ride report')
      showToast(err.message || 'Failed to fetch ride report', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleLoadMore = () => {
    if (!hasMore) return
    const next = offset + limit
    setOffset(next)
    fetchRideReport(false, next)
  }

  const handleResetFilter = () => {
    const today = new Date()
    const sevenDaysAgo = new Date(today)
    sevenDaysAgo.setDate(today.getDate() - 7)
    setStartDate(sevenDaysAgo.toISOString().split('T')[0])
    setEndDate(today.toISOString().split('T')[0])
    setSelectedDriver("")
    setSelectedStatus("")
  }


  const filteredData = useMemo(() => {
    let rows = reportData
    if (selectedDriver) {
      rows = rows.filter(r => r?.driver?.User?.name === selectedDriver)
    }
    if (selectedStatus) {
      rows = rows.filter(r => (r?.status || '').toLowerCase() === selectedStatus.toLowerCase())
    }
    return rows
  }, [reportData, selectedDriver, selectedStatus])

  // Helpers
  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A'
    try {
      return new Date(dateString).toLocaleString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      })
    } catch {
      return 'N/A'
    }
  }

  const formatLocation = (lat, lng) => {
    if (typeof lat !== 'number' || typeof lng !== 'number') return 'N/A'
    return `${lat.toFixed(4)}, ${lng.toFixed(4)}`
  }

  const badgeClass = (status) => {
    const s = (status || '').toLowerCase()
    const base = 'px-2 py-1 rounded text-xs font-medium'
    if (s === 'completed' || s === 'complete') return `${base} bg-green-900 text-green-300`
    if (s === 'cancelled') return `${base} bg-red-900 text-red-300`
    if (s === 'ongoing' || s === 'active') return `${base} bg-yellow-900 text-yellow-300`
    return `${base} bg-gray-900 text-gray-300`
  }

  const mockRating = () => (Math.random() * 2 + 3).toFixed(1)

  
  const COL_W = 220 
  const VISIBLE_COLS = 5
  const TABLE_COLS = 10
  const TABLE_W = COL_W * TABLE_COLS 
  const CARD_W = COL_W * VISIBLE_COLS 

  if (loading && reportData.length === 0) {
    return (
      <div className="flex-1 p-6 flex items-center justify-center">
        <div className="flex items-center space-x-2 text-white">
          <Loader className="w-6 h-6 animate-spin" />
          <span>Loading ride report...</span>
        </div>
      </div>
    )
  }

  if (error && reportData.length === 0) {
    return (
      <div className="flex-1 p-6 flex items-center justify-center">
        <div className="flex items-center space-x-2 text-red-400">
          <AlertCircle className="w-6 h-6" />
          <span>{error}</span>
          <button
            onClick={() => fetchRideReport(true, 0)}
            className="ml-4 px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 py-4 px-3 bg-gray-900">
     
      <div className="mx-auto" style={{ width: `${CARD_W}px` }}>
        <h1 className="text-xl font-semibold mb-4 text-white">Ride Report</h1>

        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center gap-2 bg-gray-700 text-gray-300 border border-gray-600 rounded-lg px-3 py-2">
            <Filter className="w-4 h-4" />
            <span className="text-sm">Filter By</span>
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="startDate" className="text-gray-300 text-xs">From:</label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-gray-700 text-white px-2 py-2 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />

            <label htmlFor="endDate" className="text-gray-300 text-xs">To:</label>
            <input
              type="date"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-gray-700 text-white px-2 py-2 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />

            <select
              value={selectedDriver}
              onChange={(e) => setSelectedDriver(e.target.value)}
              className="bg-gray-700 text-white px-2 py-2 rounded-lg border border-gray-600 text-sm"
            >
              <option value="">All Drivers</option>
              {uniqueDrivers.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-gray-700 text-white px-2 py-2 rounded-lg border border-gray-600 text-sm"
            >
              <option value="">All Status</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="ongoing">Ongoing</option>
              <option value="active">Active</option>
            </select>

            {/* <button
              onClick={() => fetchRideReport(true, 0)}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-3 py-2 text-sm"
            >
              Apply
            </button> */}
          </div>

          <button
            onClick={handleResetFilter}
            className="flex items-center gap-1 text-orange-400 hover:text-orange-300 px-3 py-2 rounded-lg text-sm"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset</span>
          </button>
        </div>

        {/* Active filter tag (dates) */}
        {startDate && endDate && (
          <div className="flex items-center bg-gray-700 text-gray-200 px-3 py-2 rounded-lg text-xs mb-4 w-fit">
            Report from {new Date(startDate).toLocaleDateString()} to {new Date(endDate).toLocaleDateString()}
          </div>
        )}

      
        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto" style={{ width: `${CARD_W}px` }}>
            <table style={{ width: `${TABLE_W}px` }}>
              <thead className="bg-gray-700">
                <tr>
                  <th className="text-left p-3 text-gray-300 font-medium text-xs" style={{ width: COL_W }}>Status</th>
                  <th className="text-left p-3 text-gray-300 font-medium text-xs" style={{ width: COL_W }}>Driver's Name</th>
                  <th className="text-left p-3 text-gray-300 font-medium text-xs" style={{ width: COL_W }}>Vehicle Code</th>
                  <th className="text-left p-3 text-gray-300 font-medium text-xs" style={{ width: COL_W }}>Pickup Details</th>
                  <th className="text-left p-3 text-gray-300 font-medium text-xs" style={{ width: COL_W }}>Destination Details</th>
                  <th className="text-left p-3 text-gray-300 font-medium text-xs" style={{ width: COL_W }}>Mileage, km</th>
                  <th className="text-left p-3 text-gray-300 font-medium text-xs" style={{ width: COL_W }}>Price, km</th>
                  <th className="text-left p-3 text-gray-300 font-medium text-xs" style={{ width: COL_W }}>Earning</th>
                  <th className="text-left p-3 text-gray-300 font-medium text-xs" style={{ width: COL_W }}>Ratings by Passenger</th>
                  <th className="text-left p-3 text-gray-300 font-medium text-xs" style={{ width: COL_W }}>Ratings by Driver</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length > 0 ? (
                  filteredData.map((ride) => (
                    <tr key={ride.rideId} className="border-t border-gray-700 hover:bg-gray-750">
                      {/* Status */}
                      <td className="p-3" style={{ width: COL_W }}>
                        <span className={badgeClass(ride.status)}>
                          {ride?.status ? ride.status.charAt(0).toUpperCase() + ride.status.slice(1) : 'Unknown'}
                        </span>
                      </td>
                      {/* Driver */}
                      <td className="p-3 text-white text-sm" style={{ width: COL_W }}>
                        {ride?.driver?.User?.name || 'Unknown Driver'}
                      </td>
                      {/* Vehicle Code */}
                      <td className="p-3 text-white text-sm" style={{ width: COL_W }}>
                        <span className="font-mono">{ride?.vehicle?.code || 'N/A'}</span>
                      </td>
                      {/* Pickup Details */}
                      <td className="p-3 text-white text-sm" style={{ width: COL_W }}>
                        <div className="truncate">{formatLocation(ride?.pickupLocation?.lat, ride?.pickupLocation?.lng)}</div>
                        <div className="text-xs text-gray-400">{formatDateTime(ride?.pickupTime)}</div>
                      </td>
                      {/* Destination Details */}
                      <td className="p-3 text-white text-sm" style={{ width: COL_W }}>
                        <div className="truncate">{formatLocation(ride?.dropoffLocation?.lat, ride?.dropoffLocation?.lng)}</div>
                        <div className="text-xs text-gray-400">
                          {ride?.dropoffTime ? formatDateTime(ride.dropoffTime) : 'In progress'}
                        </div>
                      </td>
                      {/* Mileage */}
                      <td className="p-3 text-white text-sm font-mono" style={{ width: COL_W }}>
                        {(ride?.distance ?? 0).toFixed(1)}
                      </td>
                      {/* Price, km */}
                      <td className="p-3 text-white text-sm font-mono" style={{ width: COL_W }}>
                        {(ride?.farePerKm ?? 0).toFixed(2)}
                      </td>
                      {/* Earning */}
                      <td className="p-3 text-white text-sm font-mono" style={{ width: COL_W }}>
                        {(ride?.earning ?? 0).toFixed(2)}
                      </td>
                      {/* Ratings by Passenger */}
                      <td className="p-3" style={{ width: COL_W }}>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-400 fill-current" />
                          <span className="text-white text-sm">{mockRating()}</span>
                        </div>
                      </td>
                      {/* Ratings by Driver */}
                      <td className="p-3" style={{ width: COL_W }}>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-400 fill-current" />
                          <span className="text-white text-sm">{mockRating()}</span>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="10" className="text-center py-10 text-gray-400">
                      No rides found for the selected period
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

         
          <div className="text-center text-gray-400 text-xs py-2 border-t border-gray-700">
            {'\u2190'} Scroll to view more columns {'\u2192'}
          </div>
        </div>

       
        <div className="flex items-center justify-between mt-4">
          <span className="text-gray-400 text-xs">Showing {filteredData.length} rides</span>
          {hasMore && (
            <button
              onClick={handleLoadMore}
              disabled={loading}
              className="px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 text-sm"
            >
              {loading ? 'Loading...' : 'Load More'}
            </button>
          )}
        </div>
      </div>

      <style jsx>{`
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .hover\\:bg-gray-750:hover {
          background-color: rgba(55, 65, 81, 0.5);
        }
      `}</style>
    </div>
  )
}
