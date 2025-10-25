import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { selectLanguageCode, setLanguage } from '../../Redux/LanguageSlice/languageSlice'
import tjson from './json/navbar.json'
import { Search, Bell, User, ChevronDown, LogOut } from 'lucide-react'

// EN & RU only
const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
]

// Auth utils
const getUserFromStorage = () => {
  try {
    const token = localStorage.getItem('authToken')
    const userStr = localStorage.getItem('user')
    if (token && userStr) {
      const user = JSON.parse(userStr)
      return { ...user, token }
    }
    return null
  } catch {
    return null
  }
}

const clearUserFromStorage = () => {
  try {
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
  } catch {}
}

export default function Navbar({ onLogout }) {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  // i18n
  const langCode = useSelector(selectLanguageCode) // 'en' | 'ru'
  const t = useMemo(() => tjson?.[langCode] || tjson.en, [langCode])
  const selectedLanguage = useMemo(
    () => languages.find(l => l.code === langCode) || languages[0],
    [langCode]
  )
  const tr = (tpl = '', vars = {}) =>
    tpl.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, k) => `${vars[k] ?? ''}`)

  const [user, setUser] = useState(null)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showLanguageMenu, setShowLanguageMenu] = useState(false)

  useEffect(() => {
    setUser(getUserFromStorage())
  }, [])

  const handleLogout = () => {
    clearUserFromStorage()
    setUser(null)
    setShowUserMenu(false)
    onLogout?.()
    navigate('/login')
  }

  const handleLanguageChange = (language) => {
    dispatch(setLanguage(language.code))
    setShowLanguageMenu(false)
  }

  return (
    <header className="bg-gray-800 p-4 border-b border-gray-700">
      <div className="flex items-center justify-between">
        {/* Search */}
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4"
            aria-hidden="true"
          />
          <input
            type="text"
            placeholder={t.search.placeholder}
            aria-label={t.search.aria_label}
            className="bg-gray-700 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative" role="button" aria-label={t.notifications.aria_label}>
            <Bell className="w-6 h-6 text-gray-300 hover:text-white cursor-pointer transition-colors" />
            <span
              className="absolute -top-1 -right-1 bg-red-500 text-xs rounded-full w-4 h-4 flex items-center justify-center text-white font-medium"
              title={tr(t.notifications.badge_alt, { count: 4 })}
              aria-label={tr(t.notifications.badge_alt, { count: 4 })}
            >
              4
            </span>
          </div>

          {/* Language Selector */}
          <div className="relative">
            <button
              className="flex items-center space-x-2 hover:bg-gray-700 p-2 rounded-lg transition-colors"
              aria-label={t.language.menu_aria_label}
              onClick={() => setShowLanguageMenu(!showLanguageMenu)}
            >
              <span className="text-lg">{selectedLanguage.flag}</span>
              <span className="text-sm text-white hidden sm:block">
                {selectedLanguage.name}
              </span>
              <ChevronDown className="w-4 h-4 text-gray-300" aria-hidden="true" />
            </button>

            {showLanguageMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="py-2">
                  {languages.map((language) => {
                    const active = language.code === langCode
                    return (
                      <button
                        key={language.code}
                        onClick={() => handleLanguageChange(language)}
                        className={`w-full flex items-center px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${
                          active ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                        }`}
                      >
                        <span className="text-lg mr-3">{language.flag}</span>
                        <span>{language.name}</span>
                        {active && (
                          <div className="ml-auto w-2 h-2 bg-blue-600 rounded-full" />
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              className="flex items-center space-x-2 hover:bg-gray-700 p-2 rounded-lg transition-colors"
              aria-label={t.user_menu.open_menu}
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                <User className="w-5 h-5 text-white" aria-hidden="true" />
              </div>
              <span className="text-sm text-white hidden sm:block">
                {user ? user.name : t.user_menu.greeting_guest}
              </span>
              <ChevronDown className="w-4 h-4 text-gray-300" aria-hidden="true" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="py-2">
                  {user && (
                    <>
                      <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                            <User className="w-6 h-6 text-white" aria-hidden="true" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                            <p className="text-xs text-gray-500">{user.email}</p>
                          </div>
                        </div>
                        {user.role && (
                          <div className="mt-2">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 capitalize">
                              {tr(t.user_menu.profile_card.role_badge, { role: user.role })}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="px-4 py-2 border-b border-gray-200">
                        <p className="text-xs text-gray-500">
                          <span className="font-medium">{t.user_menu.profile_card.phone_label}</span>{' '}
                          {user.phone || 'N/A'}
                        </p>
                        <p className="text-xs text-gray-500">
                          <span className="font-medium">{t.user_menu.profile_card.id_label}</span>{' '}
                          {user.userId}
                        </p>
                      </div>
                    </>
                  )}

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    aria-label={t.user_menu.logout.aria_label}
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    <span className="font-medium">{t.user_menu.logout.label}</span>
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
          aria-label={t.overlay.click_outside_to_close}
          onClick={() => {
            setShowUserMenu(false)
            setShowLanguageMenu(false)
          }}
        />
      )}
    </header>
  )
}
