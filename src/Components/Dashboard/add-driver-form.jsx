import { useState } from "react"
import { ChevronDown, ChevronRight, ArrowLeft, Save, Loader } from 'lucide-react'

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

export default function AddDriverForm({ onBack, onSubmit }) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    // Basic Information
    name: "",
    email: "",
    phone: "",
    password: "",
    address: "",
    emergencyContact: "",
    dateOfBirth: "",
    
    // License Information
    licenseNumber: "",
    countryOfIssue: "",
    drivingLicenseIssuedOn: "",
    drivingLicenseExpeiresOn: "",
    drivingExperience: "",
    
    // Personal Details
    passportType: "",
    country: "",
    issuedBy: "",
    registrationAddress: "",
    taxpayerId: "",
    
    // ID Details
    idSeriesAndNumber: "",
    primaryStateRegistrationNumber: "",
    postCode: "",
    iDIssuedOn: "",
    iDexpiresOn: "",
    
    // Additional
    notes: "",
    feedback: "",
    status: "active"
  })

  const [expandedSections, setExpandedSections] = useState({
    details: true,
    personalDetails: false,
    idDetails: false,
  })

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

  const validateForm = () => {
    const errors = []
    
    if (!formData.name.trim()) errors.push("Name is required")
    if (!formData.email.trim()) errors.push("Email is required")
    if (!formData.phone.trim()) errors.push("Phone is required")
    if (!formData.password.trim()) errors.push("Password is required")
    if (formData.password.length < 6) errors.push("Password must be at least 6 characters")
    
    if (errors.length > 0) {
      errors.forEach(error => showToast(error, 'error'))
      return false
    }
    
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    try {
      setLoading(true)
      await onSubmit(formData)
    } catch (err) {
      showToast(err.message || 'Failed to add driver', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex-1 bg-gray-900 text-white overflow-auto">
      {/* Header */}
      <div className="border-b border-gray-700 p-6">
        <div className="flex items-center text-sm text-gray-400 mb-4">
          <button 
            onClick={onBack}
            className="flex items-center text-blue-400 hover:text-blue-300 mr-4"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Drivers
          </button>
          <span>Drivers</span>
          <span className="mx-2">→</span>
          <span className="text-white">Add New Driver</span>
        </div>
        <h1 className="text-2xl font-bold text-white">Add New Driver</h1>
      </div>

      <div className="p-6 max-w-6xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Basic Details Section */}
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
                    <label className="block text-sm text-gray-300 mb-2">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter full name"
                      className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter email address"
                      className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Enter phone number"
                      className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Password *</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Enter password (min 6 characters)"
                      className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Driver License Number</label>
                    <input
                      type="text"
                      name="licenseNumber"
                      value={formData.licenseNumber}
                      onChange={handleInputChange}
                      placeholder="Enter license number"
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
                      placeholder="Enter country of issue"
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
                      placeholder="Enter emergency contact"
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
                      placeholder="e.g., 5 years"
                      className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Status</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="pending">Pending</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm text-gray-300 mb-2">Address</label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Enter full address"
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
                      placeholder="Enter passport type"
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
                      placeholder="Enter country"
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
                      placeholder="Enter issuing authority"
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
                      placeholder="Enter taxpayer ID"
                      className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm text-gray-300 mb-2">Registration Address</label>
                    <textarea
                      name="registrationAddress"
                      value={formData.registrationAddress}
                      onChange={handleInputChange}
                      placeholder="Enter registration address"
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
                      placeholder="Enter ID series and number"
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
                      placeholder="Enter registration number"
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
                      placeholder="Enter post code"
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

                  <div className="md:col-span-2">
                    <label className="block text-sm text-gray-300 mb-2">Notes</label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      placeholder="Enter any additional notes"
                      rows={3}
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
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg transition-colors font-medium flex items-center space-x-2 disabled:opacity-50"
            >
              {loading && <Loader className="w-4 h-4 animate-spin" />}
              <Save className="w-4 h-4" />
              <span>Add Driver</span>
            </button>
          </div>
        </form>
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
