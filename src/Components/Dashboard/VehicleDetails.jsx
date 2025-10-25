"use client"

import { useState, useEffect, useMemo } from "react"
import { useSelector } from "react-redux"
import { selectLanguageCode } from "../../Redux/LanguageSlice/languageSlice"
import tjson from "./json/VehicleDetails.json"

import { ChevronDown, ChevronRight, ArrowLeft, Loader, Save, AlertCircle } from 'lucide-react'
import axios from 'axios'

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
  const toast = document.createElement('div')
  toast.textContent = message
  toast.style.cssText = `
    position: fixed; top: 20px; right: 20px;
    padding: 12px 16px; border-radius: 6px; color: white; font-weight: 500;
    z-index: 10000; transform: translateX(100%); transition: transform .3s ease;
    ${type === 'success' ? 'background-color:#10b981;' : type === 'error' ? 'background-color:#ef4444;' : 'background-color:#3b82f6;'}
  `
  document.body.appendChild(toast)
  setTimeout(() => { toast.style.transform = 'translateX(0)' }, 10)
  setTimeout(() => {
    toast.style.transform = 'translateX(100%)'
    setTimeout(() => { if (document.body.contains(toast)) document.body.removeChild(toast) }, 300)
  }, 4000)
}

export default function VehicleDetails({ selectedVehicleId, onBack, onUpdate }) {
  // i18n
  const langCode = useSelector(selectLanguageCode) // 'en' | 'ru'
  const t = useMemo(() => tjson?.[langCode] || tjson.en, [langCode])
  const tr = (tpl = '', vars = {}) =>
    (tpl || '').replace(/\{\{\s*(\w+)\s*\}\}/g, (_, k) => `${vars[k] ?? ''}`)

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

      // Try single vehicle endpoint first
      try {
        const response = await apiClient.get(`/taxipark/vehicles/${vehicleId}`)
        const vehicleData = response.vehicle || response.vehicles || response
        if (vehicleData) {
          setVehicle(vehicleData)
          updateFormData(vehicleData)
          return
        }
      } catch {
        // Fallback to list + filter
      }

      const response = await apiClient.get('/taxipark/vehicles')
      const allVehicles = response.vehicles || []
      const specificVehicle = allVehicles.find(v => String(v.id) === String(vehicleId))
      if (!specificVehicle) throw new Error(tr(t.errors.no_id) || `Vehicle ${vehicleId} not found`)

      setVehicle(specificVehicle)
      updateFormData(specificVehicle)
    } catch (err) {
      setError(`${t.errors.generic_prefix} ${err.message}`)
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
    if (selectedVehicleId) {
      fetchVehicleDetails(selectedVehicleId)
    } else {
      setError(t.errors.no_id)
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedVehicleId, langCode])

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    if (!selectedVehicleId) {
      showToast(t.toasts.no_id_update, 'error')
      return
    }
    try {
      setSaving(true)
      await apiClient.put(`/taxipark/vehicles/${selectedVehicleId}`, formData)
      showToast(t.toasts.update_success, 'success')
      onUpdate?.()
      await fetchVehicleDetails(selectedVehicleId)
    } catch (err) {
      showToast(tr(t.toasts.update_error, { message: err.message }), 'error')
    } finally {
      setSaving(false)
    }
  }

  // Loading
  if (loading) {
    return (
      <div className="flex-1 bg-gray-900 text-white flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader className="w-6 h-6 animate-spin" />
          <span>{tr(t.loading.vehicle, { id: selectedVehicleId })}</span>
        </div>
      </div>
    )
  }

  // Error
  if (error) {
    return (
      <div className="flex-1 bg-gray-900 text-white flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4 text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-400" />
          <div className="text-red-400 text-lg">{error}</div>
          <div className="text-gray-400 text-sm">
            {tr(t.breadcrumbs.requested_id, { id: selectedVehicleId })}
          </div>
          <div className="text-gray-400 text-xs">{t.errors.workaround_note}</div>
          <div className="flex space-x-4">
            <button
              onClick={() => selectedVehicleId && fetchVehicleDetails(selectedVehicleId)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              disabled={!selectedVehicleId}
            >
              {t.buttons.try_again}
            </button>
            <button
              onClick={onBack}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
            >
              {t.buttons.back_to_vehicles}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Empty
  if (!vehicle) {
    return (
      <div className="flex-1 bg-gray-900 text-white flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4 text-center">
          <AlertCircle className="w-12 h-12 text-yellow-400" />
          <div className="text-yellow-400 text-lg">{t.empty.not_found_title}</div>
          <div className="text-gray-400 text-sm">
            {tr(t.empty.not_found_subtitle, { id: selectedVehicleId })}
          </div>
          <button
            onClick={onBack}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            {t.buttons.back_to_vehicles}
          </button>
        </div>
      </div>
    )
  }

  const vehicleName = tr(t.profile.title, { make: vehicle.make || 'Unknown', model: vehicle.model || 'Vehicle' })

  return (
    <div className="flex-1 bg-gray-900 text-white overflow-auto">
      {/* Header */}
      <div className="border-b border-gray-700 p-6">
        <div className="flex items-center text-sm text-gray-400 mb-6">
          <button
            onClick={onBack}
            className="flex items-center text-blue-400 hover:text-blue-300 mr-4"
            aria-label={t.breadcrumbs.back}
            title={t.breadcrumbs.back}
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            {t.breadcrumbs.back}
          </button>
          <span>{t.breadcrumbs.root}</span>
          <span className="mx-2">→</span>
          <span className="text-white">{t.breadcrumbs.details}</span>
          <span className="mx-2 text-gray-500">{tr(t.breadcrumbs.requested_id, { id: selectedVehicleId })}</span>
        </div>

        {/* Vehicle Profile */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-lg bg-gray-600 flex items-center justify-center text-white text-2xl">🚗</div>
            <div>
              <h1 className="text-2xl font-bold text-white">{vehicleName}</h1>
              <p className="text-gray-400">
                {tr(t.profile.plate_and_code, {
                  plate: vehicle.plateNumber || 'N/A',
                  code: vehicle.code || 'N/A'
                })}
              </p>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            vehicle.connectionStatus ? 'bg-green-600 text-white' : 'bg-gray-600 text-gray-300'
          }`}>
            ● {vehicle.connectionStatus ? t.status.badge_active : t.status.badge_inactive}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-5 gap-4 p-4 bg-gray-800 rounded-lg">
          <div className="text-center">
            <p className="text-gray-400 text-sm mb-1">{t.stats.connection_status}</p>
            <p className="text-white font-semibold">
              {vehicle.connectionStatus ? t.status.online : t.status.offline}
            </p>
          </div>
          <div className="text-center">
            <p className="text-gray-400 text-sm mb-1">{t.stats.make}</p>
            <p className="text-white font-semibold">{vehicle.make || 'N/A'}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-400 text-sm mb-1">{t.stats.model}</p>
            <p className="text-white font-semibold">{vehicle.model || 'N/A'}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-400 text-sm mb-1">{t.stats.seats}</p>
            <p className="text-white font-semibold">{vehicle.seats || 'N/A'}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-400 text-sm mb-1">{t.stats.taxi_park_id}</p>
            <p className="text-white font-semibold">{vehicle.taxiParkId || 'N/A'}</p>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-6xl mx-auto">
        <div className="space-y-4">
          {/* Vehicle Details */}
          <div className="border border-gray-700 rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection("details")}
              className="w-full flex items-center justify-between p-4 bg-gray-800 hover:bg-gray-700 transition-colors text-left"
              aria-label={expandedSections.details ? tr(t.aria.toggle_section_close, { section: t.sections.vehicle_details }) : tr(t.aria.toggle_section_open, { section: t.sections.vehicle_details })}
              aria-expanded={expandedSections.details}
            >
              <span className="text-white font-medium">{t.sections.vehicle_details}</span>
              {expandedSections.details ? <ChevronDown className="w-5 h-5 text-gray-400" /> : <ChevronRight className="w-5 h-5 text-gray-400" />}
            </button>

            {expandedSections.details && (
              <div className="p-6 bg-gray-800 border-t border-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Field label={t.fields.plate_number} name="plateNumber" value={formData.plateNumber} onChange={handleInputChange} />
                  <Field label={t.fields.vehicle_code} name="code" value={formData.code} onChange={handleInputChange} />
                  <Field label={t.fields.make} name="make" value={formData.make} onChange={handleInputChange} />
                  <Field label={t.fields.model} name="model" value={formData.model} onChange={handleInputChange} />
                  <Field label={t.fields.color} name="color" value={formData.color} onChange={handleInputChange} />
                  <Field type="number" label={t.fields.seats} name="seats" value={formData.seats} onChange={handleInputChange} />
                  <Field label={t.fields.driver_id} name="driverId" value={formData.driverId} onChange={handleInputChange} placeholder={t.placeholders.driver_id} className="md:col-span-2" />
                </div>
              </div>
            )}
          </div>

          {/* Specifications */}
          <div className="border border-gray-700 rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection("specifications")}
              className="w-full flex items-center justify-between p-4 bg-gray-800 hover:bg-gray-700 transition-colors text-left"
              aria-label={expandedSections.specifications ? tr(t.aria.toggle_section_close, { section: t.sections.specifications }) : tr(t.aria.toggle_section_open, { section: t.sections.specifications })}
              aria-expanded={expandedSections.specifications}
            >
              <span className="text-white font-medium">{t.sections.specifications}</span>
              {expandedSections.specifications ? <ChevronDown className="w-5 h-5 text-gray-400" /> : <ChevronRight className="w-5 h-5 text-gray-400" />}
            </button>

            {expandedSections.specifications && (
              <div className="p-6 bg-gray-800 border-t border-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Field label={t.fields.vin_full} name="VIN" value={formData.VIN} onChange={handleInputChange} inputClassName="font-mono" />
                  <Field label={t.fields.body_number} name="bodyNumber" value={formData.bodyNumber} onChange={handleInputChange} />
                </div>
              </div>
            )}
          </div>

          {/* Documentation */}
          <div className="border border-gray-700 rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection("documentation")}
              className="w-full flex items-center justify-between p-4 bg-gray-800 hover:bg-gray-700 transition-colors text-left"
              aria-label={expandedSections.documentation ? tr(t.aria.toggle_section_close, { section: t.sections.documentation }) : tr(t.aria.toggle_section_open, { section: t.sections.documentation })}
              aria-expanded={expandedSections.documentation}
            >
              <span className="text-white font-medium">{t.sections.documentation}</span>
              {expandedSections.documentation ? <ChevronDown className="w-5 h-5 text-gray-400" /> : <ChevronRight className="w-5 h-5 text-gray-400" />}
            </button>

            {expandedSections.documentation && (
              <div className="p-6 bg-gray-800 border-t border-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <TextArea label={t.fields.license_info} name="license" value={formData.license} onChange={handleInputChange} rows={3} />
                  <TextArea label={t.fields.registration_certificate} name="registrationCertificate" value={formData.registrationCertificate} onChange={handleInputChange} rows={3} />
                </div>
              </div>
            )}
          </div>

          {/* System Info */}
          <div className="border border-gray-700 rounded-lg overflow-hidden">
            <div className="p-4 bg-gray-800">
              <span className="text-white font-medium">{t.sections.system_info}</span>
            </div>
            <div className="p-6 bg-gray-800 border-t border-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ReadOnly label={t.fields.vehicle_id} value={vehicle.id} />
                <ReadOnly label={t.fields.taxi_park_id} value={vehicle.taxiParkId || 'N/A'} />
              </div>
            </div>
          </div>

          {/* Save */}
          <div className="flex justify-center pt-6">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving || !selectedVehicleId}
              aria-label={t.aria.save_details}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg transition-colors font-medium flex items-center space-x-2 disabled:opacity-50"
            >
              {saving && <Loader className="w-4 h-4 animate-spin" />}
              <Save className="w-4 h-4" />
              <span>{saving ? t.buttons.saving : t.buttons.save}</span>
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}

/** Small presentational helpers **/
function Field({ label, name, value, onChange, type = "text", placeholder, className = "", inputClassName = "" }) {
  return (
    <div className={className}>
      <label className="block text-sm text-gray-300 mb-2">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        className={`w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500 ${inputClassName}`}
      />
    </div>
  )
}

function TextArea({ label, name, value, onChange, rows = 3 }) {
  return (
    <div>
      <label className="block text-sm text-gray-300 mb-2">{label}</label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        rows={rows}
        className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
      />
    </div>
  )
}

function ReadOnly({ label, value }) {
  return (
    <div>
      <label className="block text-sm text-gray-300 mb-2">{label}</label>
      <div className="w-full bg-gray-700 text-gray-400 px-4 py-3 rounded-lg border border-gray-600">
        {value}
      </div>
    </div>
  )
}
