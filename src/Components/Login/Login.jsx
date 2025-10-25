import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { selectLanguageCode, setLanguage } from '../../Redux/LanguageSlice/languageSlice'
import { Eye, EyeOff, Lock, Mail, User, AlertCircle, Loader, LogOut, Search, ChevronDown } from 'lucide-react'
import axios from 'axios'
import tjson from '../Dashboard/json/login.json'

const API_BASE_URL = 'http://localhost:3000/api'


const LANG_OPTIONS = [
  { code: 'en' },
  { code: 'ru' },
]

// Create axios instance for auth
const authApi = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

// Tiny template helper
const tr = (tpl = '', vars = {}) =>
  tpl.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, k) => `${vars[k] ?? ''}`)

// Simple toast notification
const showToast = (message, type = 'info') => {
  const toast = document.createElement('div')
  toast.textContent = message
  toast.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 12px 16px;
    border-radius: 8px;
    color: white;
    font-weight: 500;
    z-index: 10000;
    transform: translateX(100%);
    transition: transform 0.3s ease;
    max-width: 300px;
    word-wrap: break-word;
    font-size: 14px;
    ${
      type === 'success'
        ? 'background-color: #10b981;'
        : type === 'error'
        ? 'background-color: #ef4444;'
        : 'background-color: #3b82f6;'
    }
  `
  document.body.appendChild(toast)
  setTimeout(() => { toast.style.transform = 'translateX(0)' }, 10)
  setTimeout(() => {
    toast.style.transform = 'translateX(100%)'
    setTimeout(() => {
      if (document.body.contains(toast)) document.body.removeChild(toast)
    }, 300)
  }, 4000)
}

// Auth utility functions
const saveUserToStorage = (userData) => {
  try {
    localStorage.setItem('authToken', userData.token)
    localStorage.setItem('user', JSON.stringify({
      userId: userData.userId,
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      role: userData.role
    }))
  } catch (error) {
    console.error('Error saving user data:', error)
  }
}

const getUserFromStorage = () => {
  try {
    const token = localStorage.getItem('authToken')
    const userStr = localStorage.getItem('user')
    if (token && userStr) {
      const user = JSON.parse(userStr)
      return { ...user, token }
    }
    return null
  } catch (error) {
    console.error('Error getting user data:', error)
    clearUserFromStorage()
    return null
  }
}

const clearUserFromStorage = () => {
  try {
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
  } catch (error) {
    console.error('Error clearing user data:', error)
  }
}

// ------------------ Drivers Table (uses some localized strings) ------------------
const DriversTable = ({ user, onLogout, t }) => {
  const [drivers, setDrivers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDrivers, setSelectedDrivers] = useState(new Set())
  const [bulkUpdating, setBulkUpdating] = useState(false)

  const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${user.token}`
    },
  })

  const driversApi = {
    getAll: () => apiClient.get('/taxipark/drivers'),
    updateConnections: (connections) => apiClient.put('/taxipark/driver_connection', { connections }),
    updateFares: (fares) => apiClient.put('/taxipark/driver_current_fare_per_km', { fares }),
  }

  useEffect(() => { fetchDrivers() }, [])

  const fetchDrivers = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await driversApi.getAll()
      setDrivers(response.data.drivers || [])
    } catch (err) {
      setError(err.response?.data?.error || err.message || t.toast.drivers_fetch_failed)
      showToast(t.toast.drivers_fetch_failed, 'error')
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
    if (checked) newSelected.add(driverId)
    else newSelected.delete(driverId)
    setSelectedDrivers(newSelected)
  }

  const handleSelectAll = (checked) => {
    if (checked) setSelectedDrivers(new Set(filteredDrivers.map(d => d.userId)))
    else setSelectedDrivers(new Set())
  }

  const handleConnectionChange = async (driverId, isConnected) => {
    try {
      await driversApi.updateConnections([{ driverId, isConnected }])
      setDrivers(prev => prev.map(driver =>
        driver.userId === driverId ? { ...driver, connectionStatus: isConnected } : driver
      ))
      showToast(t.toast.conn_updated, 'success')
    } catch {
      showToast(t.toast.conn_failed, 'error')
    }
  }

  const handleFareChange = async (driverId, farePerKm) => {
    if (farePerKm < 0) return
    try {
      await driversApi.updateFares([{ driverId, farePerKm }])
      setDrivers(prev => prev.map(driver =>
        driver.userId === driverId ? { ...driver, currentFarePerKm: farePerKm } : driver
      ))
      showToast(t.toast.fare_updated, 'success')
    } catch {
      showToast(t.toast.fare_failed, 'error')
    }
  }

  const handleBulkConnectionUpdate = async (isConnected) => {
    if (selectedDrivers.size === 0) return
    try {
      setBulkUpdating(true)
      const connections = Array.from(selectedDrivers).map(driverId => ({ driverId, isConnected }))
      await driversApi.updateConnections(connections)
      setDrivers(prev => prev.map(driver =>
        selectedDrivers.has(driver.userId) ? { ...driver, connectionStatus: isConnected } : driver
      ))
      setSelectedDrivers(new Set())
      showToast(tr(t.toast.drivers_bulk_updated, { count: connections.length }), 'success')
    } catch {
      showToast(t.toast.drivers_bulk_failed, 'error')
    } finally {
      setBulkUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="flex items-center space-x-2 text-white">
          <Loader className="w-6 h-6 animate-spin" />
          <span>{t.loading.drivers}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 shadow-lg border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-white">{t.drivers.dashboard_title}</h1>
              <p className="text-gray-400">{tr(t.drivers.welcome_back, { name: user.name })}</p>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>{t.drivers.logout}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Controls */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-6 border border-gray-700">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder={t.drivers.search_placeholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400"
              />
            </div>
            {selectedDrivers.size > 0 && (
              <div className="flex gap-2">
                <button
                  onClick={() => handleBulkConnectionUpdate(true)}
                  disabled={bulkUpdating}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                >
                  {tr(t.drivers.connect_selected, { count: selectedDrivers.size })}
                </button>
                <button
                  onClick={() => handleBulkConnectionUpdate(false)}
                  disabled={bulkUpdating}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
                >
                  {t.drivers.disconnect_selected}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Drivers Table */}
        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-700">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left">
                    <input
                      type="checkbox"
                      checked={selectedDrivers.size === filteredDrivers.length && filteredDrivers.length > 0}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="w-4 h-4 text-blue-600 bg-gray-600 border-gray-500 rounded focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    {t.drivers.table.driver}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    {t.drivers.table.license}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    {t.drivers.table.status}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    {t.drivers.table.fare_km}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {filteredDrivers.map((driver) => (
                  <tr key={driver.userId} className="hover:bg-gray-750">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedDrivers.has(driver.userId)}
                        onChange={(e) => handleSelectDriver(driver.userId, e.target.checked)}
                        className="w-4 h-4 text-blue-600 bg-gray-600 border-gray-500 rounded focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-white">{driver.User?.name || 'N/A'}</div>
                        <div className="text-sm text-gray-400">{driver.User?.phone || 'N/A'}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{driver.licenseNumber || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={driver.connectionStatus || false}
                          onChange={(e) => handleConnectionChange(driver.userId, e.target.checked)}
                          className="sr-only"
                        />
                        <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          driver.connectionStatus ? 'bg-green-600' : 'bg-gray-600'
                        }`}>
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            driver.connectionStatus ? 'translate-x-6' : 'translate-x-1'
                          }`} />
                        </div>
                      </label>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={driver.currentFarePerKm || 0}
                        onChange={(e) => handleFareChange(driver.userId, parseFloat(e.target.value) || 0)}
                        className="w-20 px-2 py-1 text-sm bg-gray-700 border border-gray-600 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredDrivers.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400">{t.drivers.table.no_results}</p>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .hover\\:bg-gray-750:hover { background-color: rgba(55, 65, 81, 0.5); }
      `}</style>
    </div>
  )
}

// ------------------ Login Page WITH Language Toggler + JSON strings ------------------
export default function LoginPage() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const langCode = useSelector(selectLanguageCode) // 'en' | 'ru'
  const t = useMemo(() => tjson?.[langCode] || tjson.en, [langCode])

  const selectedLanguage = useMemo(
    () => ({
      code: langCode,
      name: t.lang[langCode].name,
      flag: t.lang[langCode].flag
    }),
    [langCode, t]
  )

  const [showLanguageMenu, setShowLanguageMenu] = useState(false)

  const [user, setUser] = useState(null)
  const [appLoading, setAppLoading] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    const savedUser = getUserFromStorage()
    if (savedUser) {
      setUser(savedUser)
      navigate('/') // Navigate to home if already logged in
    }
    setAppLoading(false)
  }, [navigate])

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }))
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.email.trim()) newErrors.email = t.errors.email_required
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = t.errors.email_invalid
    if (!formData.password) newErrors.password = t.errors.password_required
    else if (formData.password.length < 6) newErrors.password = t.errors.password_min
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setLoading(true)
    try {
      const response = await authApi.post('/auth/login', {
        email: formData.email,
        password: formData.password
      })
      const userData = {
        userId: response.data.userId,
        name: response.data.name,
        email: response.data.email,
        phone: response.data.phone,
        role: response.data.role,
        token: response.data.token
      }
      saveUserToStorage(userData)
      setUser(userData)
      showToast(tr(t.toast.welcome, { name: response.data.name }), 'success')
      navigate('/')
    } catch (error) {
      const message = error.response?.data?.error || error.message || t.toast.generic_error
      showToast(message, 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    clearUserFromStorage()
    setUser(null)
    showToast(t.toast.logout_success, 'success')
  }

  const handleLanguageChange = (code) => {
    dispatch(setLanguage(code))
    setShowLanguageMenu(false)
  }

  if (appLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="flex items-center space-x-2 text-white">
          <Loader className="w-6 h-6 animate-spin" />
          <span>{t.loading.app}</span>
        </div>
      </div>
    )
  }

  // Show dashboard if user is logged in
  if (user) {
    return <DriversTable user={user} onLogout={handleLogout} t={t} />
  }

  // Login page
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 relative">
      {/* Top-right language toggler */}
      <div className="absolute top-4 right-4 z-50">
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowLanguageMenu(v => !v)}
            className="flex items-center space-x-2 cursor-pointer hover:bg-gray-800 p-2 rounded-lg transition-colors border border-gray-700"
            aria-haspopup="menu"
            aria-expanded={showLanguageMenu}
            title={t.lang.menu_label}
          >
            <span className="text-lg">{selectedLanguage.flag}</span>
            <span className="text-sm text-white hidden sm:block">{selectedLanguage.name}</span>
            <ChevronDown className="w-4 h-4 text-gray-300" />
          </button>

          {showLanguageMenu && (
            <div
              className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
              role="menu"
            >
              <div className="py-2">
                {LANG_OPTIONS.map((opt) => {
                  const active = opt.code === langCode
                  const item = t.lang[opt.code]
                  return (
                    <button
                      key={opt.code}
                      onClick={() => handleLanguageChange(opt.code)}
                      className={`w-full flex items-center px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${
                        active ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                      }`}
                      role="menuitem"
                    >
                      <span className="text-lg mr-3">{item.flag}</span>
                      <span>{item.name}</span>
                      {active && <div className="ml-auto w-2 h-2 bg-blue-600 rounded-full" />}
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Click outside to close language menu */}
      {showLanguageMenu && (
        <div className="fixed inset-0 z-40" onClick={() => setShowLanguageMenu(false)} />
      )}

      <div className="w-full max-w-md">
        <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-700">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <User className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">{t.header.title}</h1>
            <p className="text-gray-400">{t.header.subtitle}</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                {t.form.email_label}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="email"
                  type="email"
                  placeholder={t.form.email_placeholder}
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full pl-11 pr-4 py-3 bg-gray-700 border-2 rounded-xl text-base transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400 ${
                    errors.email ? 'border-red-500' : 'border-gray-600 focus:border-blue-500'
                  }`}
                />
              </div>
              {errors.email && (
                <div className="flex items-center mt-2 text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  {errors.email}
                </div>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                {t.form.password_label}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder={t.form.password_placeholder}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={`w-full pl-11 pr-12 py-3 bg-gray-700 border-2 rounded-xl text-base transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400 ${
                    errors.password ? 'border-red-500' : 'border-gray-600 focus:border-blue-500'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <div className="flex items-center mt-2 text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  {errors.password}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-400">{t.form.remember_me}</span>
              </label>
              <button
                type="button"
                className="text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors"
              >
                {t.form.forgot_password}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-xl font-semibold text-base hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-70 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] disabled:hover:scale-100 flex items-center justify-center space-x-2 shadow-lg"
            >
              {loading && <Loader className="w-5 h-5 animate-spin" />}
              <span>{t.form.sign_in}</span>
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-gray-400 text-sm">
              {t.footer.no_account}{' '}
              <button className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                {t.footer.sign_up}
              </button>
            </p>
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
