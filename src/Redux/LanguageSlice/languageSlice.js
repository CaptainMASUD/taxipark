import { createSlice } from "@reduxjs/toolkit"

// Language options with flags - Russian is included
const languages = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "it", name: "Italiano", flag: "🇮🇹" },
  { code: "pt", name: "Português", flag: "🇵🇹" },
  { code: "ru", name: "Русский", flag: "🇷🇺" },
  { code: "zh", name: "中文", flag: "🇨🇳" },
  { code: "ja", name: "日本語", flag: "🇯🇵" },
  { code: "ar", name: "العربية", flag: "🇸🇦" },
]

const translations = {
  en: {
    search: "Search",
    selectLanguage: "Select Language",
    notifications: "Notifications",
    logout: "Logout",
    guest: "Guest",
    phone: "Phone",
    id: "ID",
    language: "Language",
    welcome: "Welcome",
    profile: "Profile",
    settings: "Settings",
    dashboard: "Dashboard",
    menu: "Menu",
  },
  es: {
    search: "Buscar",
    selectLanguage: "Seleccionar Idioma",
    notifications: "Notificaciones",
    logout: "Cerrar Sesión",
    guest: "Invitado",
    phone: "Teléfono",
    id: "ID",
    language: "Idioma",
    welcome: "Bienvenido",
    profile: "Perfil",
    settings: "Configuración",
    dashboard: "Panel",
    menu: "Menú",
  },
  fr: {
    search: "Rechercher",
    selectLanguage: "Sélectionner la Langue",
    notifications: "Notifications",
    logout: "Se Déconnecter",
    guest: "Invité",
    phone: "Téléphone",
    id: "ID",
    language: "Langue",
    welcome: "Bienvenue",
    profile: "Profil",
    settings: "Paramètres",
    dashboard: "Tableau de Bord",
    menu: "Menu",
  },
  de: {
    search: "Suchen",
    selectLanguage: "Sprache Auswählen",
    notifications: "Benachrichtigungen",
    logout: "Abmelden",
    guest: "Gast",
    phone: "Telefon",
    id: "ID",
    language: "Sprache",
    welcome: "Willkommen",
    profile: "Profil",
    settings: "Einstellungen",
    dashboard: "Dashboard",
    menu: "Menü",
  },
  it: {
    search: "Cerca",
    selectLanguage: "Seleziona Lingua",
    notifications: "Notifiche",
    logout: "Disconnetti",
    guest: "Ospite",
    phone: "Telefono",
    id: "ID",
    language: "Lingua",
    welcome: "Benvenuto",
    profile: "Profilo",
    settings: "Impostazioni",
    dashboard: "Dashboard",
    menu: "Menu",
  },
  pt: {
    search: "Pesquisar",
    selectLanguage: "Selecionar Idioma",
    notifications: "Notificações",
    logout: "Sair",
    guest: "Convidado",
    phone: "Telefone",
    id: "ID",
    language: "Idioma",
    welcome: "Bem-vindo",
    profile: "Perfil",
    settings: "Configurações",
    dashboard: "Painel",
    menu: "Menu",
  },
  ru: {
    search: "Поиск",
    selectLanguage: "Выбрать Язык",
    notifications: "Уведомления",
    logout: "Выйти",
    guest: "Гость",
    phone: "Телефон",
    id: "ID",
    language: "Язык",
    welcome: "Добро пожаловать",
    profile: "Профиль",
    settings: "Настройки",
    dashboard: "Панель",
    menu: "Меню",
  },
  zh: {
    search: "搜索",
    selectLanguage: "选择语言",
    notifications: "通知",
    logout: "登出",
    guest: "访客",
    phone: "电话",
    id: "ID",
    language: "语言",
    welcome: "欢迎",
    profile: "个人资料",
    settings: "设置",
    dashboard: "仪表板",
    menu: "菜单",
  },
  ja: {
    search: "検索",
    selectLanguage: "言語を選択",
    notifications: "通知",
    logout: "ログアウト",
    guest: "ゲスト",
    phone: "電話",
    id: "ID",
    language: "言語",
    welcome: "ようこそ",
    profile: "プロフィール",
    settings: "設定",
    dashboard: "ダッシュボード",
    menu: "メニュー",
  },
  ar: {
    search: "بحث",
    selectLanguage: "اختر اللغة",
    notifications: "الإشعارات",
    logout: "تسجيل الخروج",
    guest: "ضيف",
    phone: "الهاتف",
    id: "الهوية",
    language: "اللغة",
    welcome: "مرحبا",
    profile: "الملف الشخصي",
    settings: "الإعدادات",
    dashboard: "لوحة التحكم",
    menu: "القائمة",
  },
}

// Persistence utilities built into the slice
const saveLanguageToStorage = (language) => {
  try {
    localStorage.setItem("selectedLanguage", JSON.stringify(language))
  } catch (error) {
    console.error("Error saving language to storage:", error)
  }
}

const loadLanguageFromStorage = () => {
  try {
    const saved = localStorage.getItem("selectedLanguage")
    if (saved) {
      const parsedLanguage = JSON.parse(saved)
      // Verify the language still exists in our available languages
      const exists = languages.find((lang) => lang.code === parsedLanguage.code)
      return exists || languages[0]
    }
  } catch (error) {
    console.error("Error loading language from storage:", error)
  }
  return languages[0] // Default to English
}

const initialState = {
  currentLanguage: loadLanguageFromStorage(),
  availableLanguages: languages,
  loading: false,
  error: null,
}

const languageSlice = createSlice({
  name: "language",
  initialState,
  reducers: {
    setLanguageStart: (state) => {
      state.loading = true
      state.error = null
    },
    setLanguageSuccess: (state, action) => {
      const language = state.availableLanguages.find((lang) => lang.code === action.payload)
      if (language) {
        state.currentLanguage = language
        // Save to localStorage
        saveLanguageToStorage(language)
        // Dispatch custom event for other parts of the app
        if (typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent("languageChanged", {
              detail: { language },
            }),
          )
        }
      }
      state.loading = false
      state.error = null
    },
    setLanguageError: (state, action) => {
      state.loading = false
      state.error = action.payload
    },
    resetLanguage: (state) => {
      state.currentLanguage = languages[0] // Reset to English
      state.error = null
      saveLanguageToStorage(languages[0])
    },
    addLanguage: (state, action) => {
      const newLanguage = action.payload
      const exists = state.availableLanguages.find((lang) => lang.code === newLanguage.code)
      if (!exists) {
        state.availableLanguages.push(newLanguage)
      }
    },
    removeLanguage: (state, action) => {
      const codeToRemove = action.payload
      state.availableLanguages = state.availableLanguages.filter((lang) => lang.code !== codeToRemove)
      // If current language is removed, reset to English
      if (state.currentLanguage.code === codeToRemove) {
        state.currentLanguage = languages[0]
        saveLanguageToStorage(languages[0])
      }
    },
  },
})

export const getCurrentTranslations = (state) => {
  const currentLangCode = state.language.currentLanguage.code
  return translations[currentLangCode] || translations.en
}

export const { setLanguageStart, setLanguageSuccess, setLanguageError, resetLanguage, addLanguage, removeLanguage } =
  languageSlice.actions

export default languageSlice.reducer
