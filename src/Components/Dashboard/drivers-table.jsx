import { useState, useEffect } from "react"
import { Search, Plus, MoreHorizontal, ChevronDown, Edit, Loader, AlertCircle, X } from 'lucide-react'
import axios from 'axios'
import DriverDetails from './driver-details'
import AddDriverForm from './add-driver-form'

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

// API functions
const driversApi = {
  getAll: () => apiClient.get('/taxipark/drivers'),
  getById: (driverId) => apiClient.get(`/taxipark/drivers/${driverId}`),
  create: (data) => apiClient.post('/taxipark/drivers', data),
  updateConnections: (connections) => apiClient.put('/taxipark/driver_connection', { connections }),
  updateFares: (fares) => apiClient.put('/taxipark/driver_current_fare_per_km', { fares }),
}

// Simple toast notification
const showToast = (message, type = 'info') => {
  const toast = document.createElement('div')
  toast.textContent = message
  toast.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 12px 16px;
    border-radius: 6px;
    color: white;
    font-weight: 500;
    z-index: 10000;
    transform: translateX(100%);
    transition: transform 0.3s ease;
    ${type === 'success' ? 'background-color: #10b981;' : 
      type === 'error' ? 'background-color: #ef4444;' : 
      'background-color: #3b82f6;'}
  `
  
  document.body.appendChild(toast)
  
  setTimeout(() => {
    toast.style.transform = 'translateX(0)'
  }, 10)
  
  setTimeout(() => {
    toast.style.transform = 'translateX(100%)'
    setTimeout(() => {
      if (document.body.contains(toast)) {
        document.body.removeChild(toast)
      }
    }, 300)
  }, 4000)
}

// Loading Modal Component
const LoadingModal = ({ isOpen, message }) => {
  if (!isOpen) return null
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-8 flex flex-col items-center space-y-4">
        <Loader className="w-8 h-8 animate-spin text-blue-500" />
        <p className="text-white text-lg">{message}</p>
      </div>
    </div>
  )
}

export default function DriversTable() {
  const [drivers, setDrivers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDrivers, setSelectedDrivers] = useState(new Set())
  const [bulkUpdating, setBulkUpdating] = useState(false)
  const [selectedDriverId, setSelectedDriverId] = useState(null)
  const [showDriverDetails, setShowDriverDetails] = useState(false)
  const [showAddDriver, setShowAddDriver] = useState(false)
  const [loadingDriverDetails, setLoadingDriverDetails] = useState(false)

  useEffect(() => {
    fetchDrivers()
  }, [])

  const fetchDrivers = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await driversApi.getAll()
      setDrivers(response.drivers || [])
    } catch (err) {
      setError(err.message || 'Failed to fetch drivers')
      showToast('Failed to fetch drivers', 'error')
    } finally {
      setLoading(false)
    }
  }

  const filteredDrivers = drivers.filter(driver =>
    driver.User?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    driver.User?.phone.includes(searchTerm) ||
    (driver.licenseNumber && driver.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const handleSelectDriver = (driverId, checked) => {
    const newSelected = new Set(selectedDrivers)
    if (checked) {
      newSelected.add(driverId)
    } else {
      newSelected.delete(driverId)
    }
    setSelectedDrivers(newSelected)
  }

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedDrivers(new Set(filteredDrivers.map(d => d.userId)))
    } else {
      setSelectedDrivers(new Set())
    }
  }

  const handleConnectionChange = async (driverId, isConnected) => {
    try {
      await driversApi.updateConnections([{ driverId, isConnected }])
      setDrivers(prev => prev.map(driver => 
        driver.userId === driverId 
          ? { ...driver, connectionStatus: isConnected }
          : driver
      ))
      showToast('Driver connection status updated', 'success')
    } catch (err) {
      showToast('Failed to update connection status', 'error')
    }
  }

  const handleFareChange = async (driverId, farePerKm) => {
    if (farePerKm < 0) return
    
    try {
      await driversApi.updateFares([{ driverId, farePerKm }])
      setDrivers(prev => prev.map(driver => 
        driver.userId === driverId 
          ? { ...driver, currentFarePerKm: farePerKm }
          : driver
      ))
      showToast('Driver fare updated', 'success')
    } catch (err) {
      showToast('Failed to update fare', 'error')
    }
  }

  const handleBulkConnectionUpdate = async (isConnected) => {
    if (selectedDrivers.size === 0) return
    
    try {
      setBulkUpdating(true)
      const connections = Array.from(selectedDrivers).map(driverId => ({
        driverId,
        isConnected
      }))
      
      await driversApi.updateConnections(connections)
      
      setDrivers(prev => prev.map(driver => 
        selectedDrivers.has(driver.userId)
          ? { ...driver, connectionStatus: isConnected }
          : driver
      ))
      
      setSelectedDrivers(new Set())
      showToast(`Updated ${connections.length} drivers`, 'success')
    } catch (err) {
      showToast('Failed to update drivers', 'error')
    } finally {
      setBulkUpdating(false)
    }
  }

  const handleDriverClick = (driver) => {
    console.log('Driver clicked:', driver)
    console.log('Driver userId:', driver.userId)
    
    const driverId = driver.userId || driver.User?.id
    if (driverId) {
      setSelectedDriverId(driverId)
      setShowDriverDetails(true)
    } else {
      showToast('Driver ID not found', 'error')
    }
  }

  const handleAddDriver = () => {
    setShowAddDriver(true)
  }

  const handleAddDriverSubmit = async (formData) => {
    try {
      await driversApi.create(formData)
      showToast('Driver added successfully', 'success')
      setShowAddDriver(false)
      fetchDrivers() // Refresh the drivers list
    } catch (err) {
      showToast(err.message || 'Failed to add driver', 'error')
    }
  }

  const handleBackToTable = () => {
    setShowDriverDetails(false)
    setSelectedDriverId(null)
  }

  const handleDriverUpdate = () => {
    fetchDrivers() // Refresh the drivers list after update
  }

  if (loading) {
    return (
      <div className="flex-1 p-6 flex items-center justify-center">
        <div className="flex items-center space-x-2 text-white">
          <Loader className="w-6 h-6 animate-spin" />
          <span>Loading drivers...</span>
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
          <button 
            onClick={fetchDrivers}
            className="ml-4 px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  // Show add driver form if selected
  if (showAddDriver) {
    return (
      <AddDriverForm 
        onBack={() => setShowAddDriver(false)}
        onSubmit={handleAddDriverSubmit}
      />
    )
  }

  // Show driver details if selected
  if (showDriverDetails && selectedDriverId) {
    return (
      <DriverDetails 
        selectedDriverId={selectedDriverId}
        onBack={handleBackToTable}
        onUpdate={handleDriverUpdate}
      />
    )
  }

  return (
    <>
      <div className="flex-1 p-6 overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">Drivers</h1>
          <button
            onClick={handleAddDriver}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Driver</span>
          </button>
        </div>

        {/* Search and Bulk Actions */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search drivers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-gray-700 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
              />
            </div>
            <button 
              onClick={fetchDrivers}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>

          {selectedDrivers.size > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-gray-300 text-sm">
                {selectedDrivers.size} selected
              </span>
              <button
                onClick={() => handleBulkConnectionUpdate(true)}
                disabled={bulkUpdating}
                className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm transition-colors disabled:opacity-50"
              >
                {bulkUpdating && <Loader className="w-3 h-3 mr-1 animate-spin inline" />}
                Connect All
              </button>
              <button
                onClick={() => handleBulkConnectionUpdate(false)}
                disabled={bulkUpdating}
                className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition-colors disabled:opacity-50"
              >
                Disconnect All
              </button>
            </div>
          )}
        </div>

        {/* Table */}
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="text-left p-4 text-gray-300 font-medium">
                  <input 
                    type="checkbox"
                    className="rounded bg-gray-600 border-gray-500"
                    checked={selectedDrivers.size === filteredDrivers.length && filteredDrivers.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                  />
                </th>
                <th className="text-left p-4 text-gray-300 font-medium">Full Name</th>
                <th className="text-left p-4 text-gray-300 font-medium">Phone Number</th>
                <th className="text-left p-4 text-gray-300 font-medium">Email</th>
                <th className="text-left p-4 text-gray-300 font-medium">Driver's License</th>
                <th className="text-left p-4 text-gray-300 font-medium">Connection</th>
                <th className="text-left p-4 text-gray-300 font-medium">Current Price/km</th>
                <th className="text-left p-4 text-gray-300 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDrivers.map((driver) => (
                <tr key={driver.userId} className="border-t border-gray-700 hover:bg-gray-750">
                  <td className="p-4">
                    <input 
                      type="checkbox"
                      className="rounded bg-gray-600 border-gray-500"
                      checked={selectedDrivers.has(driver.userId)}
                      onChange={(e) => handleSelectDriver(driver.userId, e.target.checked)}
                    />
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-white font-medium">
                        {driver.User?.name?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                      <button
                        onClick={() => handleDriverClick(driver)}
                        className="text-white font-medium hover:text-blue-400 transition-colors text-left"
                      >
                        {driver.User?.name || 'Unknown'}
                      </button>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-blue-400">{driver.User?.phone || 'N/A'}</span>
                      <div className={`w-2 h-2 rounded-full ${
                        driver.connectionStatus ? 'bg-green-400' : 'bg-gray-400'
                      }`}></div>
                    </div>
                  </td>
                  <td className="p-4 text-gray-300">{driver.User?.email || 'N/A'}</td>
                  <td className="p-4 text-gray-300">{driver.licenseNumber || 'N/A'}</td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <select
                        value={driver.connectionStatus ? 'Active' : 'Inactive'}
                        onChange={(e) => handleConnectionChange(driver.userId, e.target.value === 'Active')}
                        className="bg-gray-700 text-white border border-gray-600 rounded px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </div>
                  </td>
                  <td className="p-4">
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      value={driver.currentFarePerKm || 0}
                      onChange={(e) => handleFareChange(driver.userId, parseFloat(e.target.value) || 0)}
                      className="bg-gray-700 text-white border border-gray-600 rounded px-2 py-1 w-20 text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => handleDriverClick(driver)}
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => showToast(`More options for ${driver.User?.name}`, 'info')}
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredDrivers.length === 0 && !loading && (
          <div className="text-center py-8 text-gray-400">
            {searchTerm ? 'No drivers found matching your search.' : 'No drivers found.'}
          </div>
        )}

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
          <span className="text-gray-400 text-sm">
            Showing {filteredDrivers.length} of {drivers.length} drivers
          </span>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1 bg-gray-700 text-gray-300 rounded hover:bg-gray-600 disabled:opacity-50" disabled>
              Previous
            </button>
            <button className="px-3 py-1 bg-blue-600 text-white rounded">1</button>
            <button className="px-3 py-1 bg-gray-700 text-gray-300 rounded hover:bg-gray-600 disabled:opacity-50" disabled>
              Next
            </button>
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

      {/* Loading Modal */}
      <LoadingModal 
        isOpen={loadingDriverDetails} 
        message="Loading driver details..." 
      />
    </>
  )
}
