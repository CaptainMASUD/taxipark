import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Bell, User, ChevronDown, LogOut } from 'lucide-react'

// Language options with flags
const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' }
]

// Auth utility functions
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

export default function Navbar({ onLogout }) {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showLanguageMenu, setShowLanguageMenu] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0]) // Default to English

  useEffect(() => {
    // Get user data from localStorage on component mount
    const userData = getUserFromStorage()
    setUser(userData)

    // Get saved language preference
    const savedLanguage = localStorage.getItem('selectedLanguage')
    if (savedLanguage) {
      const lang = languages.find(l => l.code === savedLanguage)
      if (lang) setSelectedLanguage(lang)
    }
  }, [])

  const handleLogout = () => {
    clearUserFromStorage()
    setUser(null)
    setShowUserMenu(false)
    
    // Call the onLogout prop if provided
    if (onLogout) {
      onLogout()
    }
    
    // Navigate to login page
    navigate('/login')
  }

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language)
    setShowLanguageMenu(false)
    localStorage.setItem('selectedLanguage', language.code)
    // Here you would typically trigger a language change in your app
    console.log('Language changed to:', language.name)
  }

  return (
    <header className="bg-gray-800 p-4 border-b border-gray-700">
      <div className="flex items-center justify-between">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search"
            className="bg-gray-700 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative">
            <Bell className="w-6 h-6 text-gray-300 hover:text-white cursor-pointer transition-colors" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-xs rounded-full w-4 h-4 flex items-center justify-center text-white font-medium">
              4
            </span>
          </div>

          {/* Language Selector */}
          <div className="relative">
            <div 
              className="flex items-center space-x-2 cursor-pointer hover:bg-gray-700 p-2 rounded-lg transition-colors"
              onClick={() => setShowLanguageMenu(!showLanguageMenu)}
            >
              <span className="text-lg">{selectedLanguage.flag}</span>
              <span className="text-sm text-white hidden sm:block">{selectedLanguage.name}</span>
              <ChevronDown className="w-4 h-4 text-gray-300" />
            </div>

            {/* Language Dropdown */}
            {showLanguageMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-64 overflow-y-auto">
                <div className="py-2">
                  {languages.map((language) => (
                    <button
                      key={language.code}
                      onClick={() => handleLanguageChange(language)}
                      className={`w-full flex items-center px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${
                        selectedLanguage.code === language.code ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                      }`}
                    >
                      <span className="text-lg mr-3">{language.flag}</span>
                      <span>{language.name}</span>
                      {selectedLanguage.code === language.code && (
                        <div className="ml-auto w-2 h-2 bg-blue-600 rounded-full"></div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="relative">
            <div 
              className="flex items-center space-x-2 cursor-pointer hover:bg-gray-700 p-2 rounded-lg transition-colors"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                <User className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm text-white hidden sm:block">
                {user ? user.name : 'Guest'}
              </span>
              <ChevronDown className="w-4 h-4 text-gray-300" />
            </div>

            {/* User Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="py-2">
                  {user && (
                    <>
                      <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                            <User className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                            <p className="text-xs text-gray-500">{user.email}</p>
                          </div>
                        </div>
                        {user.role && (
                          <div className="mt-2">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 capitalize">
                              {user.role}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="px-4 py-2 border-b border-gray-200">
                        <p className="text-xs text-gray-500">
                          <span className="font-medium">Phone:</span> {user.phone || 'N/A'}
                        </p>
                        <p className="text-xs text-gray-500">
                          <span className="font-medium">ID:</span> {user.userId}
                        </p>
                      </div>
                    </>
                  )}
                  
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    <span className="font-medium">Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Click outside to close menus */}
      {(showUserMenu || showLanguageMenu) && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => {
            setShowUserMenu(false)
            setShowLanguageMenu(false)
          }}
        />
      )}
    </header>
  )
}
