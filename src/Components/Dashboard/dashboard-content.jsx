"use client"

import { useState, useEffect } from "react"
import { User, Info, Loader, AlertCircle } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar } from "recharts"
import axios from 'axios'

const API_BASE_URL = 'http://localhost:3000/api'

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add request interceptor to include auth token
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

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.error || error.message || 'Network error'
    return Promise.reject(new Error(message))
  }
)

// Sample data for charts (keeping existing charts)
const activityData = [
  { name: "Sun", value: 5 },
  { name: "Mon", value: 18 },
  { name: "Tues", value: 12 },
  { name: "Wed", value: 8 },
  { name: "Thurs", value: 15 },
  { name: "Fri", value: 20 },
]

const tripTotalData = [
  { name: "Sat", value: 8 },
  { name: "Sun", value: 12 },
  { name: "Mon", value: 10 },
  { name: "Tues", value: 15 },
  { name: "Wed", value: 18 },
  { name: "Thurs", value: 14 },
  { name: "Fri", value: 22 },
]

const hoursOnlineData = [
  { name: "Sat", value: 2 },
  { name: "Sun", value: 8 },
  { name: "Mon", value: 6 },
  { name: "Tues", value: 10 },
  { name: "Wed", value: 12 },
  { name: "Thurs", value: 9 },
  { name: "Fri", value: 15 },
]

const tripsBarData = [
  { name: "Mon", value: 180 },
  { name: "Tues", value: 220 },
  { name: "Wed", value: 160 },
  { name: "Thurs", value: 190 },
  { name: "Fri", value: 140 },
  { name: "Sat", value: 120 },
]

export default function DashboardContent() {
  const [drivers, setDrivers] = useState([])
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [user, setUser] = useState(null)

  // Get user data from localStorage
  useEffect(() => {
    try {
      const userStr = localStorage.getItem('user')
      if (userStr) {
        const userData = JSON.parse(userStr)
        setUser(userData)
      }
    } catch (error) {
      console.error('Error getting user data:', error)
    }
  }, [])

  // Fetch drivers and vehicles data
  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Fetch drivers and vehicles in parallel
      const [driversResponse, vehiclesResponse] = await Promise.all([
        apiClient.get('/taxipark/drivers'),
        apiClient.get('/taxipark/vehicles')
      ])
      
      console.log('Drivers response:', driversResponse)
      console.log('Vehicles response:', vehiclesResponse)
      
      setDrivers(driversResponse.drivers || [])
      setVehicles(vehiclesResponse.vehicles || [])
      
    } catch (err) {
      console.error('Error fetching dashboard data:', err)
      setError(err.message || 'Failed to fetch dashboard data')
    } finally {
      setLoading(false)
    }
  }

  // Calculate metrics
  const activeDrivers = drivers.filter(driver => driver.connectionStatus).length
  const totalDrivers = drivers.length
  const totalVehicles = vehicles.length
  const activeVehicles = vehicles.filter(vehicle => vehicle.connectionStatus).length

  // Get recent drivers (last 5)
  const recentDrivers = drivers.slice(0, 5)

  if (loading) {
    return (
      <main className="flex-1 p-6 overflow-auto">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center space-x-2 text-white">
            <Loader className="w-6 h-6 animate-spin" />
            <span>Loading dashboard...</span>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="flex-1 p-6 overflow-auto">
      <h1 className="text-2xl font-bold mb-6 text-white">Dashboard</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Taxi Park Info */}
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mr-4">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">
                {user?.name || 'Taxi Park'}
              </h2>
              <p className="text-gray-400 text-sm">
                Id: {user?.userId || '0000000000000000'}
              </p>
              {user?.email && (
                <p className="text-gray-400 text-xs">{user.email}</p>
              )}
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-400">{activeDrivers}</p>
              <p className="text-gray-400 text-sm">Active Drivers</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-400">{activeVehicles}</p>
              <p className="text-gray-400 text-sm">Active Vehicles</p>
            </div>
          </div>
        </div>

        {/* Activity Chart */}
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Activity</h3>
            <button className="text-blue-400 text-sm hover:text-blue-300">Report →</button>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} />
                <YAxis stroke="#9CA3AF" fontSize={12} />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#FBBF24"
                  strokeWidth={2}
                  dot={{ fill: "#FBBF24", strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Connected Drivers List */}
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <h3 className="text-lg font-semibold mr-2 text-white">Connected Drivers</h3>
              <Info className="w-4 h-4 text-gray-400" />
            </div>
            <span className="text-blue-400 text-sm">{activeDrivers} online</span>
          </div>
          
          {error ? (
            <div className="flex items-center justify-center h-48 text-red-400">
              <AlertCircle className="w-6 h-6 mr-2" />
              <span>{error}</span>
            </div>
          ) : (
            <div className="space-y-3 max-h-48 overflow-y-auto">
              {drivers.filter(driver => driver.connectionStatus).length > 0 ? (
                drivers
                  .filter(driver => driver.connectionStatus)
                  .slice(0, 8)
                  .map((driver) => (
                    <div key={driver.userId} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="text-white font-medium text-sm">
                            {driver.User?.name || 'Unknown Driver'}
                          </p>
                          <p className="text-gray-400 text-xs">
                            ID: {driver.userId}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span className="text-green-400 text-xs">Online</span>
                      </div>
                    </div>
                  ))
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <User className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No drivers currently online</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Hours Online */}
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <h3 className="text-lg font-semibold mr-2 text-white">Hours Online</h3>
              <Info className="w-4 h-4 text-gray-400" />
            </div>
            <button className="text-blue-400 text-sm hover:text-blue-300">Report →</button>
          </div>
          <div className="flex items-center mb-4">
            <span className="text-red-400 text-sm mr-2">-20%</span>
            <span className="text-2xl font-bold text-white">367 Hours</span>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={hoursOnlineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} />
                <YAxis stroke="#9CA3AF" fontSize={12} />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#10B981"
                  strokeWidth={2}
                  dot={{ fill: "#10B981", strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trips Bar Chart */}
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <h3 className="text-lg font-semibold mr-2 text-white">Trips</h3>
              <Info className="w-4 h-4 text-gray-400" />
            </div>
            <button className="text-blue-400 text-sm hover:text-blue-300">Report →</button>
          </div>
          <div className="mb-4">
            <span className="text-lg font-semibold text-white">Completed: 2103</span>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={tripsBarData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} />
                <YAxis stroke="#9CA3AF" fontSize={12} />
                <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Live Metrics */}
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Live Metrics</h3>
            <button 
              onClick={fetchDashboardData}
              className="text-blue-400 text-sm hover:text-blue-300"
            >
              Refresh
            </button>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Active Drivers</span>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-semibold text-green-400">{activeDrivers}</span>
                <span className="text-gray-500">/ {totalDrivers}</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Active Vehicles</span>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-semibold text-blue-400">{activeVehicles}</span>
                <span className="text-gray-500">/ {totalVehicles}</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Total Vehicles</span>
              <span className="text-xl font-semibold text-white">{totalVehicles}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Revenue Today</span>
              <span className="text-xl font-semibold text-green-400">$2,847</span>
            </div>
            
            {/* Connection Rate */}
            <div className="pt-4 border-t border-gray-700">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-400">Driver Connection Rate</span>
                <span className="text-sm text-white">
                  {totalDrivers > 0 ? Math.round((activeDrivers / totalDrivers) * 100) : 0}%
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${totalDrivers > 0 ? (activeDrivers / totalDrivers) * 100 : 0}%` 
                  }}
                ></div>
              </div>
            </div>
          </div>
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
      `}</style>
    </main>
  )
}
