import { useState, useEffect } from "react"
import { ChevronDown, ChevronRight, ArrowLeft, Loader, Save, AlertCircle } from 'lucide-react'
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

export default function DriverDetails({ selectedDriverId, onBack, onUpdate }) {
  const [driver, setDriver] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)
  
  const [expandedSections, setExpandedSections] = useState({
    details: true,
    personalDetails: false,
    idDetails: false,
  })

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    drivingExperience: '',
    licenseNumber: '',
    countryOfIssue: '',
    drivingLicenseIssuedOn: '',
    drivingLicenseExpeiresOn: '',
    emergencyContact: '',
    dateOfBirth: '',
    feedback: '',
    notes: '',
    passportType: '',
    country: '',
    issuedBy: '',
    registrationAddress: '',
    taxpayerId: '',
    idSeriesAndNumber: '',
    primaryStateRegistrationNumber: '',
    postCode: '',
    iDIssuedOn: '',
    iDexpiresOn: '',
  })

  // Fetch driver details - WORKAROUND: Get all drivers and find the specific one
  const fetchDriverDetails = async (driverId) => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('Fetching driver details for ID:', driverId)
      
      // WORKAROUND: Since the individual driver API doesn't work correctly,
      // we'll fetch all drivers and find the specific one
      const response = await apiClient.get('/taxipark/drivers')
      console.log('All drivers API response:', response)
      
      const allDrivers = response.drivers || []
      console.log('All drivers:', allDrivers)
      
      // Find the specific driver by userId
      const specificDriver = allDrivers.find(d => {
        const driverUserId = d.userId || d.User?.id
        console.log(`Comparing driver ${d.User?.name} - ID: ${driverUserId} with requested ID: ${driverId}`)
        return String(driverUserId) === String(driverId)
      })
      
      console.log('Found specific driver:', specificDriver)
      
      if (!specificDriver) {
        throw new Error(`Driver with ID ${driverId} not found`)
      }
      
      setDriver(specificDriver)
      
      // Update form data with the specific driver's information
      const userData = specificDriver.User || {}
      
      setFormData({
        name: userData.name || '',
        phone: userData.phone || '',
        address: specificDriver.address || '',
        drivingExperience: specificDriver.drivingExperience || '',
        licenseNumber: specificDriver.licenseNumber || '',
        countryOfIssue: specificDriver.countryOfIssue || '',
        drivingLicenseIssuedOn: specificDriver.drivingLicenseIssuedOn ? 
          specificDriver.drivingLicenseIssuedOn.split('T')[0] : '',
        drivingLicenseExpeiresOn: specificDriver.drivingLicenseExpeiresOn ? 
          specificDriver.drivingLicenseExpeiresOn.split('T')[0] : '',
        emergencyContact: specificDriver.emergencyContact || '',
        dateOfBirth: specificDriver.dateOfBirth ? 
          specificDriver.dateOfBirth.split('T')[0] : '',
        feedback: specificDriver.feedback || '',
        notes: specificDriver.notes || '',
        passportType: specificDriver.passportType || '',
        country: specificDriver.country || '',
        issuedBy: specificDriver.issuedBy || '',
        registrationAddress: specificDriver.registrationAddress || '',
        taxpayerId: specificDriver.taxpayerId || '',
        idSeriesAndNumber: specificDriver.idSeriesAndNumber || '',
        primaryStateRegistrationNumber: specificDriver.primaryStateRegistrationNumber || '',
        postCode: specificDriver.postCode || '',
        iDIssuedOn: specificDriver.iDIssuedOn ? 
          specificDriver.iDIssuedOn.split('T')[0] : '',
        iDexpiresOn: specificDriver.iDexpiresOn ? 
          specificDriver.iDexpiresOn.split('T')[0] : '',
      })
      
      console.log('Form data set:', formData)
      
    } catch (err) {
      console.error('Error fetching driver details:', err)
      setError(`Failed to fetch driver details: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  // Fetch driver details when selectedDriverId changes
  useEffect(() => {
    console.log('DriverDetails useEffect - selectedDriverId:', selectedDriverId)
    if (selectedDriverId) {
      fetchDriverDetails(selectedDriverId)
    } else {
      setError('No driver ID provided')
      setLoading(false)
    }
  }, [selectedDriverId])

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
    if (!selectedDriverId) {
      showToast('No driver ID available for update', 'error')
      return
    }

    try {
      setSaving(true)
      console.log('Updating driver with ID:', selectedDriverId)
      console.log('Form data to save:', formData)
      
      // Use the correct API route: PUT /taxipark/drivers/:driverId
      const response = await apiClient.put(`/taxipark/drivers/${selectedDriverId}`, formData)
      console.log('Update response:', response)
      
      showToast('Driver details updated successfully', 'success')
      
      if (onUpdate) {
        onUpdate()
      }
      
      // Refresh driver data to show updated information
      await fetchDriverDetails(selectedDriverId)
      
    } catch (err) {
      console.error('Error updating driver:', err)
      showToast(`Failed to update driver: ${err.message}`, 'error')
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
          <span>Loading driver details (ID: {selectedDriverId})...</span>
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
            Requested driver ID: {selectedDriverId}
          </div>
          <div className="text-gray-400 text-xs">
            Using workaround: Fetching all drivers and filtering by ID
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => selectedDriverId && fetchDriverDetails(selectedDriverId)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              disabled={!selectedDriverId}
            >
              Try Again
            </button>
            <button
              onClick={onBack}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
            >
              Back to Drivers
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Show message if no driver data
  if (!driver) {
    return (
      <div className="flex-1 bg-gray-900 text-white flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4 text-center">
          <AlertCircle className="w-12 h-12 text-yellow-400" />
          <div className="text-yellow-400 text-lg">Driver not found</div>
          <div className="text-gray-400 text-sm">Requested driver ID: {selectedDriverId}</div>
          <button
            onClick={onBack}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            Back to Drivers
          </button>
        </div>
      </div>
    )
  }

  // Extract driver information
  const userData = driver.User || {}
  const driverName = userData.name || 'Unknown Driver'
  const driverEmail = userData.email || 'N/A'
  const driverPhone = userData.phone || 'N/A'
  const actualDriverId = driver.userId || driver.User?.id

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
            Back to Drivers
          </button>
          <span>Drivers</span>
          <span className="mx-2">→</span>
          <span className="text-white">Driver's Details</span>
          <span className="mx-2 text-gray-500">(Requested ID: {selectedDriverId})</span>
        </div>

        {/* Driver Profile */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full bg-gray-600 flex items-center justify-center text-white font-bold text-xl">
              {driverName.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">{driverName}</h1>
              <p className="text-gray-400">Driver • License: {driver.licenseNumber || 'N/A'}</p>
              <p className="text-gray-500 text-sm">Actual Driver ID: {actualDriverId}</p>
              <p className="text-gray-500 text-xs">
                {String(actualDriverId) === String(selectedDriverId) ? 
                  '✅ Correct driver loaded' : 
                  '❌ ID mismatch detected'
                }
              </p>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            driver.connectionStatus 
              ? 'bg-green-600 text-white' 
              : 'bg-gray-600 text-gray-300'
          }`}>
            ● {driver.connectionStatus ? 'Active' : 'Inactive'}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-5 gap-4 p-4 bg-gray-800 rounded-lg">
          <div className="text-center">
            <p className="text-gray-400 text-sm mb-1">Connection Status</p>
            <p className="text-white font-semibold">{driver.connectionStatus ? 'Online' : 'Offline'}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-400 text-sm mb-1">Email</p>
            <p className="text-white font-semibold text-xs">{driverEmail}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-400 text-sm mb-1">Phone</p>
            <p className="text-white font-semibold text-xs">{driverPhone}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-400 text-sm mb-1">Taxi Park ID</p>
            <p className="text-white font-semibold">{driver.taxiParkId || 'N/A'}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-400 text-sm mb-1">Price per km</p>
            <p className="text-white font-semibold">BYN {driver.currentFarePerKm || '0'}</p>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-6xl mx-auto">
        <div className="space-y-4">
          {/* Details Section */}
          <div className="border border-gray-700 rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection("details")}
              className="w-full flex items-center justify-between p-4 bg-gray-800 hover:bg-gray-700 transition-colors text-left"
            >
              <span className="text-white font-medium">Basic Details</span>
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
                    <label className="block text-sm text-gray-300 mb-2">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Phone Number</label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Driver License Number</label>
                    <input
                      type="text"
                      name="licenseNumber"
                      value={formData.licenseNumber}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Country of Issue</label>
                    <input
                      type="text"
                      name="countryOfIssue"
                      value={formData.countryOfIssue}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Driving Experience</label>
                    <input
                      type="text"
                      name="drivingExperience"
                      value={formData.drivingExperience}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 mb-2">License Issued On</label>
                    <input
                      type="date"
                      name="drivingLicenseIssuedOn"
                      value={formData.drivingLicenseIssuedOn}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 mb-2">License Expires On</label>
                    <input
                      type="date"
                      name="drivingLicenseExpeiresOn"
                      value={formData.drivingLicenseExpeiresOn}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Date of Birth</label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Emergency Contact</label>
                    <input
                      type="text"
                      name="emergencyContact"
                      value={formData.emergencyContact}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm text-gray-300 mb-2">Address</label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm text-gray-300 mb-2">Notes</label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Personal Details Section */}
          <div className="border border-gray-700 rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection("personalDetails")}
              className="w-full flex items-center justify-between p-4 bg-gray-800 hover:bg-gray-700 transition-colors text-left"
            >
              <span className="text-white font-medium">Personal Details</span>
              {expandedSections.personalDetails ? (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronRight className="w-5 h-5 text-gray-400" />
              )}
            </button>

            {expandedSections.personalDetails && (
              <div className="p-6 bg-gray-800 border-t border-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Passport Type</label>
                    <input
                      type="text"
                      name="passportType"
                      value={formData.passportType}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Country</label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Issued By</label>
                    <input
                      type="text"
                      name="issuedBy"
                      value={formData.issuedBy}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Taxpayer ID</label>
                    <input
                      type="text"
                      name="taxpayerId"
                      value={formData.taxpayerId}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm text-gray-300 mb-2">Registration Address</label>
                    <textarea
                      name="registrationAddress"
                      value={formData.registrationAddress}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ID Details Section */}
          <div className="border border-gray-700 rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection("idDetails")}
              className="w-full flex items-center justify-between p-4 bg-gray-800 hover:bg-gray-700 transition-colors text-left"
            >
              <span className="text-white font-medium">ID Details</span>
              {expandedSections.idDetails ? (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronRight className="w-5 h-5 text-gray-400" />
              )}
            </button>

            {expandedSections.idDetails && (
              <div className="p-6 bg-gray-800 border-t border-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">ID Series and Number</label>
                    <input
                      type="text"
                      name="idSeriesAndNumber"
                      value={formData.idSeriesAndNumber}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Primary State Registration Number</label>
                    <input
                      type="text"
                      name="primaryStateRegistrationNumber"
                      value={formData.primaryStateRegistrationNumber}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Post Code</label>
                    <input
                      type="text"
                      name="postCode"
                      value={formData.postCode}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 mb-2">ID Issued On</label>
                    <input
                      type="date"
                      name="iDIssuedOn"
                      value={formData.iDIssuedOn}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 mb-2">ID Expires On</label>
                    <input
                      type="date"
                      name="iDexpiresOn"
                      value={formData.iDexpiresOn}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Save Button */}
          <div className="flex justify-center pt-6">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving || !selectedDriverId}
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
