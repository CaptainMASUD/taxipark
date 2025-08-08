"use client"

import { Car, Users, FileText, DollarSign, ShoppingCart, MapPin, Settings, LogOut, ChevronDown, ChevronRight } from 'lucide-react'
import { useState } from "react"
import { useNavigate } from 'react-router-dom'

const sidebarItems = [
  { name: "Dashboard", icon: FileText, type: "link" },
  { name: "Staff", icon: Users, type: "link" },
  { name: "Vehicles", icon: Car, type: "link" },
  {
    name: "Report",
    icon: FileText,
    type: "parent",
    children: [
      { name: "Earning Report", icon: DollarSign, type: "link" },
      { name: "Order Report", icon: ShoppingCart, type: "link" },
      { name: "Ride Report", icon: MapPin, type: "link" },
    ],
  },
  { name: "Settings", icon: Settings, type: "link", bottom: true },
  { name: "Logout", icon: LogOut, type: "logout", bottom: true },
]

// Auth utility functions (same as navbar)
const clearUserFromStorage = () => {
  try {
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
    localStorage.removeItem('selectedLanguage')
  } catch (error) {
    console.error('Error clearing user data:', error)
  }
}

export default function Sidebar({ activeTab, onTabChange, onLogout }) {
  const navigate = useNavigate()
  const [reportExpanded, setReportExpanded] = useState(false)

  const handleLogout = () => {
    // Clear user data from localStorage
    clearUserFromStorage()
    
    // Call the onLogout prop if provided
    if (onLogout) {
      onLogout()
    }
    
    // Navigate to login page
    navigate('/login')
  }

  const handleItemClick = (item) => {
    if (item.type === "parent" && item.name === "Report") {
      setReportExpanded(!reportExpanded)
    } else if (item.type === "logout") {
      handleLogout()
    } else {
      onTabChange(item.name)
    }
  }

  return (
    <div className="w-64 bg-gray-800 flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-gray-700">
        <h1 className="text-xl font-bold text-blue-400">Auto Float</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {sidebarItems
            .filter((item) => !item.bottom)
            .map((item, index) => (
              <li key={index}>
                {item.type === "link" && (
                  <button
                    onClick={() => handleItemClick(item)}
                    className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-colors ${
                      item.name === activeTab
                        ? "bg-blue-600 text-white"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white"
                    }`}
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    {item.name}
                  </button>
                )}

                {item.type === "parent" && (
                  <>
                    <button
                      onClick={() => handleItemClick(item)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-colors ${
                        reportExpanded 
                          ? "bg-gray-700 text-white" 
                          : "text-gray-300 hover:bg-gray-700 hover:text-white"
                      }`}
                    >
                      <div className="flex items-center">
                        <item.icon className="w-5 h-5 mr-3" />
                        {item.name}
                      </div>
                      {reportExpanded ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </button>

                    {reportExpanded && item.children && (
                      <ul className="ml-6 mt-2 space-y-2">
                        {item.children.map((childItem, childIndex) => (
                          <li key={childIndex}>
                            <button
                              onClick={() => handleItemClick(childItem)}
                              className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-colors ${
                                childItem.name === activeTab
                                  ? "bg-blue-600 text-white"
                                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
                              }`}
                            >
                              <childItem.icon className="w-5 h-5 mr-3" />
                              {childItem.name}
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                )}
              </li>
            ))}
        </ul>
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-gray-700">
        {sidebarItems
          .filter((item) => item.bottom)
          .map((item, index) => (
            <button
              key={index}
              onClick={() => handleItemClick(item)}
              className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors mb-2 last:mb-0 ${
                item.type === "logout"
                  ? "text-red-400 hover:bg-red-900/20 hover:text-red-300"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.name}
            </button>
          ))}
      </div>
    </div>
  )
}
