import { useState, useEffect } from "react"
import { Search, Plus, MoreHorizontal, ChevronDown, Edit, Loader, AlertCircle } from 'lucide-react'
import axios from 'axios'
import VehicleDetails from './VehicleDetails'
import AddVehicleForm from './add-vehicle-form'

const API_BASE_URL = 'http://localhost:3000/api'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

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

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.error || error.message || 'Network error'
    return Promise.reject(new Error(message))
  }
)

const vehiclesApi = {
  getAll: () => apiClient.get('/taxipark/vehicles'),
  getById: (vehicleId) => apiClient.get(`/taxipark/vehicles/${vehicleId}`),
  create: (data) => apiClient.post('/taxipark/vehicles', data),
  update: (vehicleId, data) => apiClient.put(`/taxipark/vehicles/${vehicleId}`, data),
  updateConnections: (connections) => apiClient.put('/taxipark/vehicle_connection', { connections }),
}

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

export default function VehiclesTable() {
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedVehicles, setSelectedVehicles] = useState(new Set())
  const [bulkUpdating, setBulkUpdating] = useState(false)
  const [selectedVehicleId, setSelectedVehicleId] = useState(null)
  const [showVehicleDetails, setShowVehicleDetails] = useState(false)
  const [showAddVehicle, setShowAddVehicle] = useState(false)
  const [loadingVehicleDetails, setLoadingVehicleDetails] = useState(false)

  useEffect(() => {
    fetchVehicles()
  }, [])

  const fetchVehicles = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await vehiclesApi.getAll()
      console.log('Fetched vehicles:', response.vehicles)
      setVehicles(response.vehicles || [])
    } catch (err) {
      setError(err.message || 'Failed to fetch vehicles')
      showToast('Failed to fetch vehicles', 'error')
    } finally {
      setLoading(false)
    }
  }

  const filteredVehicles = vehicles.filter(vehicle =>
    vehicle.make?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.plateNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.color?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.code?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSelectVehicle = (vehicleId, checked) => {
    const newSelected = new Set(selectedVehicles)
    if (checked) {
      newSelected.add(vehicleId)
    } else {
      newSelected.delete(vehicleId)
    }
    setSelectedVehicles(newSelected)
  }

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedVehicles(new Set(filteredVehicles.map(v => v.id)))
    } else {
      setSelectedVehicles(new Set())
    }
  }

  const handleConnectionChange = async (vehicleId, isConnected) => {
    try {
      await vehiclesApi.updateConnections([{ vehicleId, isConnected }])
      setVehicles(prev => prev.map(vehicle => 
        vehicle.id === vehicleId 
          ? { ...vehicle, connectionStatus: isConnected }
          : vehicle
      ))
      showToast('Vehicle connection status updated', 'success')
    } catch (err) {
      showToast('Failed to update connection status', 'error')
    }
  }

  const handleBulkConnectionUpdate = async (isConnected) => {
    if (selectedVehicles.size === 0) return
    
    try {
      setBulkUpdating(true)
      const connections = Array.from(selectedVehicles).map(vehicleId => ({
        vehicleId,
        isConnected
      }))
      
      await vehiclesApi.updateConnections(connections)
      
      setVehicles(prev => prev.map(vehicle => 
        selectedVehicles.has(vehicle.id)
          ? { ...vehicle, connectionStatus: isConnected }
          : vehicle
      ))
      
      setSelectedVehicles(new Set())
      showToast(`Updated ${connections.length} vehicles`, 'success')
    } catch (err) {
      showToast('Failed to update vehicles', 'error')
    } finally {
      setBulkUpdating(false)
    }
  }

  const handleVehicleClick = (vehicle) => {
    console.log('Vehicle clicked:', vehicle)
    console.log('Vehicle ID:', vehicle.id)
    
    if (vehicle.id) {
      setSelectedVehicleId(vehicle.id)
      setShowVehicleDetails(true)
    } else {
      showToast('Vehicle ID not found', 'error')
    }
  }

  const handleAddVehicle = () => {
    setShowAddVehicle(true)
  }

  const handleAddVehicleSubmit = async (formData) => {
    try {
      await vehiclesApi.create(formData)
      showToast('Vehicle added successfully', 'success')
      setShowAddVehicle(false)
      fetchVehicles() 
    } catch (err) {
      showToast(err.message || 'Failed to add vehicle', 'error')
    }
  }

  const handleBackToTable = () => {
    setShowVehicleDetails(false)
    setSelectedVehicleId(null)
  }

  const handleVehicleUpdate = () => {
    fetchVehicles() 
  }

  if (loading) {
    return (
      <div className="flex-1 p-6 flex items-center justify-center">
        <div className="flex items-center space-x-2 text-white">
          <Loader className="w-6 h-6 animate-spin" />
          <span>Loading vehicles...</span>
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
            onClick={fetchVehicles} 
            className="ml-4 px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  
  if (showAddVehicle) {
    return (
      <AddVehicleForm 
        onBack={() => setShowAddVehicle(false)}
        onSubmit={handleAddVehicleSubmit}
      />
    )
  }

  
  if (showVehicleDetails && selectedVehicleId) {
    return (
      <VehicleDetails 
        selectedVehicleId={selectedVehicleId}
        onBack={handleBackToTable}
        onUpdate={handleVehicleUpdate}
      />
    )
  }

  return (
    <>
      <div className="flex-1 p-6 overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">Vehicles</h1>
          <button
            onClick={handleAddVehicle}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Vehicle</span>
          </button>
        </div>

       
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search vehicles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-gray-700 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
              />
            </div>
            <button 
              onClick={fetchVehicles}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>

          {selectedVehicles.size > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-gray-300 text-sm">
                {selectedVehicles.size} selected
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

      
        {vehicles.length > 0 && (
          <div className="mb-4 p-2 bg-gray-800 rounded text-xs text-gray-400">
            Debug: Found {vehicles.length} vehicles. First vehicle ID: {vehicles[0]?.id || 'undefined'}
          </div>
        )}

       
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="text-left p-4 text-gray-300 font-medium">
                  <input 
                    type="checkbox" 
                    className="rounded bg-gray-600 border-gray-500"
                    checked={selectedVehicles.size === filteredVehicles.length && filteredVehicles.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                  />
                </th>
                <th className="text-left p-4 text-gray-300 font-medium">Make & Model</th>
                <th className="text-left p-4 text-gray-300 font-medium">Plate Number</th>
                <th className="text-left p-4 text-gray-300 font-medium">Color</th>
                <th className="text-left p-4 text-gray-300 font-medium">Seats</th>
                <th className="text-left p-4 text-gray-300 font-medium">VIN</th>
                <th className="text-left p-4 text-gray-300 font-medium">Connection</th>
                <th className="text-left p-4 text-gray-300 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredVehicles.map((vehicle) => (
                <tr key={vehicle.id} className="border-t border-gray-700 hover:bg-gray-750">
                  <td className="p-4">
                    <input 
                      type="checkbox" 
                      className="rounded bg-gray-600 border-gray-500"
                      checked={selectedVehicles.has(vehicle.id)}
                      onChange={(e) => handleSelectVehicle(vehicle.id, e.target.checked)}
                    />
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-lg bg-gray-600 flex items-center justify-center text-white font-medium">
                        🚗
                      </div>
                      <div>
                        <button
                          onClick={() => handleVehicleClick(vehicle)}
                          className="text-white font-medium hover:text-blue-400 transition-colors text-left"
                        >
                          {vehicle.make} {vehicle.model}
                        </button>
                        <p className="text-gray-400 text-sm">Code: {vehicle.code || 'N/A'}</p>
                        <div className="text-xs text-gray-400">ID: {vehicle.id || 'N/A'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-blue-400 font-mono">{vehicle.plateNumber || 'N/A'}</span>
                      <div className={`w-2 h-2 rounded-full ${
                        vehicle.connectionStatus ? 'bg-green-400' : 'bg-gray-400'
                      }`}></div>
                    </div>
                  </td>
                  <td className="p-4 text-gray-300">{vehicle.color || 'N/A'}</td>
                  <td className="p-4 text-gray-300">{vehicle.seats || 'N/A'}</td>
                  <td className="p-4 text-gray-300 font-mono text-sm">
                    {vehicle.VIN ? `${vehicle.VIN.substring(0, 8)}...` : 'N/A'}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <select
                        value={vehicle.connectionStatus ? 'Active' : 'Inactive'}
                        onChange={(e) => handleConnectionChange(vehicle.id, e.target.value === 'Active')}
                        className="bg-gray-700 text-white border border-gray-600 rounded px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => handleVehicleClick(vehicle)}
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => showToast(`More options for ${vehicle.make} ${vehicle.model}`, 'info')}
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

        {filteredVehicles.length === 0 && !loading && (
          <div className="text-center py-8 text-gray-400">
            {searchTerm ? 'No vehicles found matching your search.' : 'No vehicles found.'}
          </div>
        )}

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
          <span className="text-gray-400 text-sm">
            Showing {filteredVehicles.length} of {vehicles.length} vehicles
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

    
      <LoadingModal 
        isOpen={loadingVehicleDetails} 
        message="Loading vehicle details..." 
      />
    </>
  )
}
