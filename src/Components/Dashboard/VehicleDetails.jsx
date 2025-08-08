import { useState, useEffect } from "react"
import { ChevronDown, ChevronRight, ArrowLeft, Loader, Save, AlertCircle } from 'lucide-react'
import axios from 'axios'

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

export default function VehicleDetails({ selectedVehicleId, onBack, onUpdate }) {
  const [vehicle, setVehicle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)
  
  const [expandedSections, setExpandedSections] = useState({
    details: true,
    specifications: false,
    documentation: false,
  })

  const [formData, setFormData] = useState({
    plateNumber: '',
    model: '',
    make: '',
    color: '',
    seats: '',
    VIN: '',
    bodyNumber: '',
    license: '',
    registrationCertificate: '',
    code: '',
    driverId: '',
  })

  const fetchVehicleDetails = async (vehicleId) => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('Fetching vehicle details for ID:', vehicleId)
      
      try {
        const response = await apiClient.get(`/taxipark/vehicles/${vehicleId}`)
        console.log('Individual vehicle API response:', response)
        
        const vehicleData = response.vehicle || response.vehicles || response
        console.log('Vehicle data:', vehicleData)
        
        if (vehicleData) {
          setVehicle(vehicleData)
          updateFormData(vehicleData)
          return
        }
      } catch (individualError) {
        console.log('Individual API failed, trying workaround:', individualError.message)
      }
      
      const response = await apiClient.get('/taxipark/vehicles')
      console.log('All vehicles API response:', response)
      
      const allVehicles = response.vehicles || []
      console.log('All vehicles:', allVehicles)
      
      const specificVehicle = allVehicles.find(v => {
        console.log(`Comparing vehicle ${v.make} ${v.model} - ID: ${v.id} with requested ID: ${vehicleId}`)
        return String(v.id) === String(vehicleId)
      })
      
      console.log('Found specific vehicle:', specificVehicle)
      
      if (!specificVehicle) {
        throw new Error(`Vehicle with ID ${vehicleId} not found`)
      }
      
      setVehicle(specificVehicle)
      updateFormData(specificVehicle)
      
    } catch (err) {
      console.error('Error fetching vehicle details:', err)
      setError(`Failed to fetch vehicle details: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const updateFormData = (vehicleData) => {
    setFormData({
      plateNumber: vehicleData.plateNumber || '',
      model: vehicleData.model || '',
      make: vehicleData.make || '',
      color: vehicleData.color || '',
      seats: vehicleData.seats || '',
      VIN: vehicleData.VIN || '',
      bodyNumber: vehicleData.bodyNumber || '',
      license: vehicleData.license || '',
      registrationCertificate: vehicleData.registrationCertificate || '',
      code: vehicleData.code || '',
      driverId: vehicleData.driverId || '',
    })
  }

  useEffect(() => {
    console.log('VehicleDetails useEffect - selectedVehicleId:', selectedVehicleId)
    if (selectedVehicleId) {
      fetchVehicleDetails(selectedVehicleId)
    } else {
      setError('No vehicle ID provided')
      setLoading(false)
    }
  }, [selectedVehicleId])

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSave = async () => {
    if (!selectedVehicleId) {
      showToast('No vehicle ID available for update', 'error')
      return
    }

    try {
      setSaving(true)
      console.log('Updating vehicle with ID:', selectedVehicleId)
      console.log('Form data to save:', formData)
      
      const response = await apiClient.put(`/taxipark/vehicles/${selectedVehicleId}`, formData)
      console.log('Update response:', response)
      
      showToast('Vehicle details updated successfully', 'success')
      
      if (onUpdate) {
        onUpdate()
      }
      
      await fetchVehicleDetails(selectedVehicleId)
      
    } catch (err) {
      console.error('Error updating vehicle:', err)
      showToast(`Failed to update vehicle: ${err.message}`, 'error')
    } finally {
      setSaving(false)
    }
  }

  // Show loading state
  if (loading) {
    return (
      <div className="flex-1 bg-gray-900 text-white flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader className="w-6 h-6 animate-spin" />
          <span>Loading vehicle details (ID: {selectedVehicleId})...</span>
        </div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="flex-1 bg-gray-900 text-white flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4 text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-400" />
          <div className="text-red-400 text-lg">{error}</div>
          <div className="text-gray-400 text-sm">
            Requested vehicle ID: {selectedVehicleId}
          </div>
          <div className="text-gray-400 text-xs">
            Using workaround: Fetching all vehicles and filtering by ID
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => selectedVehicleId && fetchVehicleDetails(selectedVehicleId)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              disabled={!selectedVehicleId}
            >
              Try Again
            </button>
            <button
              onClick={onBack}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
            >
              Back to Vehicles
            </button>
          </div>
        </div>
      </div>
    )
  }


  if (!vehicle) {
    return (
      <div className="flex-1 bg-gray-900 text-white flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4 text-center">
          <AlertCircle className="w-12 h-12 text-yellow-400" />
          <div className="text-yellow-400 text-lg">Vehicle not found</div>
          <div className="text-gray-400 text-sm">Requested vehicle ID: {selectedVehicleId}</div>
          <button
            onClick={onBack}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            Back to Vehicles
          </button>
        </div>
      </div>
    )
  }


  const vehicleName = `${vehicle.make || 'Unknown'} ${vehicle.model || 'Vehicle'}`
  const actualVehicleId = vehicle.id

  return (
    <div className="flex-1 bg-gray-900 text-white overflow-auto">
      {/* Header */}
      <div className="border-b border-gray-700 p-6">
        <div className="flex items-center text-sm text-gray-400 mb-6">
          <button 
            onClick={onBack}
            className="flex items-center text-blue-400 hover:text-blue-300 mr-4"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Vehicles
          </button>
          <span>Vehicles</span>
          <span className="mx-2">→</span>
          <span className="text-white">Vehicle Details</span>
          <span className="mx-2 text-gray-500">(Requested ID: {selectedVehicleId})</span>
        </div>

        {/* Vehicle Profile */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-lg bg-gray-600 flex items-center justify-center text-white font-bold text-2xl">
              🚗
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">{vehicleName}</h1>
              <p className="text-gray-400">Plate: {vehicle.plateNumber || 'N/A'} • Code: {vehicle.code || 'N/A'}</p>
             
             
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            vehicle.connectionStatus 
              ? 'bg-green-600 text-white' 
              : 'bg-gray-600 text-gray-300'
          }`}>
            ● {vehicle.connectionStatus ? 'Active' : 'Inactive'}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-5 gap-4 p-4 bg-gray-800 rounded-lg">
          <div className="text-center">
            <p className="text-gray-400 text-sm mb-1">Connection Status</p>
            <p className="text-white font-semibold">{vehicle.connectionStatus ? 'Online' : 'Offline'}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-400 text-sm mb-1">Make</p>
            <p className="text-white font-semibold">{vehicle.make || 'N/A'}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-400 text-sm mb-1">Model</p>
            <p className="text-white font-semibold">{vehicle.model || 'N/A'}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-400 text-sm mb-1">Seats</p>
            <p className="text-white font-semibold">{vehicle.seats || 'N/A'}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-400 text-sm mb-1">Taxi Park ID</p>
            <p className="text-white font-semibold">{vehicle.taxiParkId || 'N/A'}</p>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-6xl mx-auto">
        <div className="space-y-4">
         
          <div className="border border-gray-700 rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection("details")}
              className="w-full flex items-center justify-between p-4 bg-gray-800 hover:bg-gray-700 transition-colors text-left"
            >
              <span className="text-white font-medium">Vehicle Details</span>
              {expandedSections.details ? (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronRight className="w-5 h-5 text-gray-400" />
              )}
            </button>

            {expandedSections.details && (
              <div className="p-6 bg-gray-800 border-t border-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Plate Number</label>
                    <input
                      type="text"
                      name="plateNumber"
                      value={formData.plateNumber}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Vehicle Code</label>
                    <input
                      type="text"
                      name="code"
                      value={formData.code}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Make</label>
                    <input
                      type="text"
                      name="make"
                      value={formData.make}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Model</label>
                    <input
                      type="text"
                      name="model"
                      value={formData.model}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Color</label>
                    <input
                      type="text"
                      name="color"
                      value={formData.color}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Number of Seats</label>
                    <input
                      type="number"
                      name="seats"
                      value={formData.seats}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm text-gray-300 mb-2">Driver ID</label>
                    <input
                      type="text"
                      name="driverId"
                      value={formData.driverId}
                      onChange={handleInputChange}
                      placeholder="Enter driver ID or leave empty"
                      className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

         
          <div className="border border-gray-700 rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection("specifications")}
              className="w-full flex items-center justify-between p-4 bg-gray-800 hover:bg-gray-700 transition-colors text-left"
            >
              <span className="text-white font-medium">Technical Specifications</span>
              {expandedSections.specifications ? (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronRight className="w-5 h-5 text-gray-400" />
              )}
            </button>

            {expandedSections.specifications && (
              <div className="p-6 bg-gray-800 border-t border-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">VIN (Vehicle Identification Number)</label>
                    <input
                      type="text"
                      name="VIN"
                      value={formData.VIN}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Body Number</label>
                    <input
                      type="text"
                      name="bodyNumber"
                      value={formData.bodyNumber}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

         
          <div className="border border-gray-700 rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection("documentation")}
              className="w-full flex items-center justify-between p-4 bg-gray-800 hover:bg-gray-700 transition-colors text-left"
            >
              <span className="text-white font-medium">Documentation</span>
              {expandedSections.documentation ? (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronRight className="w-5 h-5 text-gray-400" />
              )}
            </button>

            {expandedSections.documentation && (
              <div className="p-6 bg-gray-800 border-t border-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">License Information</label>
                    <textarea
                      name="license"
                      value={formData.license}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Registration Certificate</label>
                    <textarea
                      name="registrationCertificate"
                      value={formData.registrationCertificate}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="border border-gray-700 rounded-lg overflow-hidden">
            <div className="p-4 bg-gray-800">
              <span className="text-white font-medium">System Information</span>
            </div>
            <div className="p-6 bg-gray-800 border-t border-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Vehicle ID</label>
                  <div className="w-full bg-gray-700 text-gray-400 px-4 py-3 rounded-lg border border-gray-600">
                    {vehicle.id}
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Taxi Park ID</label>
                  <div className="w-full bg-gray-700 text-gray-400 px-4 py-3 rounded-lg border border-gray-600">
                    {vehicle.taxiParkId || 'N/A'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          
          <div className="flex justify-center pt-6">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving || !selectedVehicleId}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg transition-colors font-medium flex items-center space-x-2 disabled:opacity-50"
            >
              {saving && <Loader className="w-4 h-4 animate-spin" />}
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save Details'}</span>
            </button>
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
    </div>
  )
}
