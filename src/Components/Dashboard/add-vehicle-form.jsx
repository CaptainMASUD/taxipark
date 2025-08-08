import { useState } from "react"
import { ChevronDown, ChevronRight, ArrowLeft, Save, Loader, Plus, X } from 'lucide-react'

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

export default function AddVehicleForm({ onBack, onSubmit }) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    // Details section - matching controller fields
    status: "active",
    plateNumber: "",
    make: "",
    VIN: "",
    model: "",
    bodyNumber: "",
    color: "",
    license: "",
    seats: "",
    registrationCertificate: "",
    
    // Vehicle Code section
    code: "",
    
    // Facilities section - will be handled separately for VehicleFacilitiy model
    facilities: [""], // Start with one default input
    
    // Additional fields that might be needed
    driverId: "",
  })

  const [expandedSections, setExpandedSections] = useState({
    details: true,
    vehicleCode: false,
    facilities: false,
    optionsBrandings: false,
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

  const addFacility = () => {
    setFormData((prev) => ({
      ...prev,
      facilities: [...prev.facilities, ""]
    }))
  }

  const removeFacility = (index) => {
    setFormData((prev) => ({
      ...prev,
      facilities: prev.facilities.filter((_, i) => i !== index)
    }))
  }

  const updateFacility = (index, value) => {
    setFormData((prev) => ({
      ...prev,
      facilities: prev.facilities.map((facility, i) => i === index ? value : facility)
    }))
  }

  const validateForm = () => {
    const errors = []
    
    if (!formData.plateNumber.trim()) errors.push("License plate number is required")
    if (!formData.make.trim()) errors.push("Make is required")
    if (!formData.model.trim()) errors.push("Model is required")
    if (!formData.VIN.trim()) errors.push("VIN is required")
    
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
      const submitData = {
        plateNumber: formData.plateNumber,
        make: formData.make,
        model: formData.model,
        color: formData.color,
        seats: formData.seats ? parseInt(formData.seats) : null,
        VIN: formData.VIN,
        bodyNumber: formData.bodyNumber,
        license: formData.license,
        registrationCertificate: formData.registrationCertificate,
        code: formData.code,
        driverId: formData.driverId || null,
        facilities: formData.facilities.filter(f => f.trim() !== "")
      }
      await onSubmit(submitData)
      showToast('Vehicle added successfully!', 'success')
    } catch (err) {
      showToast(err.message || 'Failed to add vehicle', 'error')
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
            Back to Vehicles
          </button>
          <span>Vehicles</span>
          <span className="mx-2">→</span>
          <span className="text-white">Add New Vehicle</span>
        </div>
        <h1 className="text-2xl font-bold text-white">Add New Vehicle</h1>
      </div>

      <div className="p-6 max-w-6xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Vehicle Details Section */}
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
                  {/* Left Column */}
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm text-gray-300 mb-2">Status</label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
                        required
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="maintenance">Under Maintenance</option>
                        <option value="retired">Retired</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-300 mb-2">Make</label>
                      <select
                        name="make"
                        value={formData.make}
                        onChange={handleInputChange}
                        className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
                        required
                      >
                        <option value="">Select Make</option>
                        <option value="Toyota">Toyota</option>
                        <option value="Honda">Honda</option>
                        <option value="BMW">BMW</option>
                        <option value="Mercedes-Benz">Mercedes-Benz</option>
                        <option value="Audi">Audi</option>
                        <option value="Volkswagen">Volkswagen</option>
                        <option value="Ford">Ford</option>
                        <option value="Chevrolet">Chevrolet</option>
                        <option value="Nissan">Nissan</option>
                        <option value="Hyundai">Hyundai</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-300 mb-2">Model</label>
                      <select
                        name="model"
                        value={formData.model}
                        onChange={handleInputChange}
                        className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
                        required
                      >
                        <option value="">Select Model</option>
                        <option value="Camry">Camry</option>
                        <option value="Corolla">Corolla</option>
                        <option value="Civic">Civic</option>
                        <option value="Accord">Accord</option>
                        <option value="X5">X5</option>
                        <option value="3 Series">3 Series</option>
                        <option value="C-Class">C-Class</option>
                        <option value="A4">A4</option>
                        <option value="Golf">Golf</option>
                        <option value="Focus">Focus</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-300 mb-2">Color</label>
                      <select
                        name="color"
                        value={formData.color}
                        onChange={handleInputChange}
                        className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
                      >
                        <option value="">Select Color</option>
                        <option value="White">White</option>
                        <option value="Black">Black</option>
                        <option value="Silver">Silver</option>
                        <option value="Gray">Gray</option>
                        <option value="Blue">Blue</option>
                        <option value="Red">Red</option>
                        <option value="Green">Green</option>
                        <option value="Yellow">Yellow</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-300 mb-2">Seat Number</label>
                      <input
                        type="number"
                        name="seats"
                        value={formData.seats}
                        onChange={handleInputChange}
                        placeholder="4"
                        min="1"
                        max="50"
                        className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm text-gray-300 mb-2">License plate Number *</label>
                      <input
                        type="text"
                        name="plateNumber"
                        value={formData.plateNumber}
                        onChange={handleInputChange}
                        placeholder="DL-1420190012345"
                        className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-300 mb-2">VIN *</label>
                      <input
                        type="text"
                        name="VIN"
                        value={formData.VIN}
                        onChange={handleInputChange}
                        placeholder="DL-1420190012345"
                        className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500 font-mono"
                        maxLength="17"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-300 mb-2">Body Number</label>
                      <input
                        type="text"
                        name="bodyNumber"
                        value={formData.bodyNumber}
                        onChange={handleInputChange}
                        placeholder="DL-1420190012345"
                        className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-300 mb-2">License</label>
                      <input
                        type="text"
                        name="license"
                        value={formData.license}
                        onChange={handleInputChange}
                        placeholder="DL-1420190012345"
                        className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-300 mb-2">Vehicle Registration Certificate</label>
                      <input
                        type="text"
                        name="registrationCertificate"
                        value={formData.registrationCertificate}
                        onChange={handleInputChange}
                        placeholder="DL-1420190012345"
                        className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Vehicle Code Section */}
          <div className="border border-gray-700 rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection("vehicleCode")}
              className="w-full flex items-center justify-between p-4 bg-gray-800 hover:bg-gray-700 transition-colors text-left"
            >
              <span className="text-white font-medium">Vehicle Code</span>
              {expandedSections.vehicleCode ? (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronRight className="w-5 h-5 text-gray-400" />
              )}
            </button>

            {expandedSections.vehicleCode && (
              <div className="p-6 bg-gray-800 border-t border-gray-700">
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Vehicle Code</label>
                  <input
                    type="text"
                    name="code"
                    value={formData.code}
                    onChange={handleInputChange}
                    placeholder="Enter a unique code for the vehicle"
                    className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Facilities Section */}
          <div className="border border-gray-700 rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection("facilities")}
              className="w-full flex items-center justify-between p-4 bg-gray-800 hover:bg-gray-700 transition-colors text-left"
            >
              <span className="text-white font-medium">Facilities</span>
              {expandedSections.facilities ? (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronRight className="w-5 h-5 text-gray-400" />
              )}
            </button>

            {expandedSections.facilities && (
              <div className="p-6 bg-gray-800 border-t border-gray-700">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="block text-sm text-gray-300">Add</label>
                    <button
                      type="button"
                      onClick={addFacility}
                      className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition-colors text-sm"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add</span>
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {formData.facilities.map((facility, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <input
                          type="text"
                          value={facility}
                          onChange={(e) => updateFacility(index, e.target.value)}
                          placeholder="Please add from here"
                          className="flex-1 bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
                        />
                        {formData.facilities.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeFacility(index)}
                            className="text-red-400 hover:text-red-300 p-2"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Options & Brandings Section */}
          <div className="border border-gray-700 rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection("optionsBrandings")}
              className="w-full flex items-center justify-between p-4 bg-gray-800 hover:bg-gray-700 transition-colors text-left"
            >
              <span className="text-white font-medium">Options & Brandings</span>
              {expandedSections.optionsBrandings ? (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronRight className="w-5 h-5 text-gray-400" />
              )}
            </button>

            {expandedSections.optionsBrandings && (
              <div className="p-6 bg-gray-800 border-t border-gray-700">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Transmission</label>
                    <input
                      type="text"
                      name="transmission"
                      value={formData.transmission}
                      onChange={handleInputChange}
                      placeholder="Please add from here"
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
              <span>Add Vehicle</span>
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
