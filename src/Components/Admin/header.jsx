"use client"

import { useState } from "react"
import { Menu, Search, Bell, MessageSquare, ChevronDown, X } from 'lucide-react'

const Header = ({ toggleSidebar }) => {
  const [isSearchActive, setIsSearchActive] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)

  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 md:px-6">
      {/* Left section */}
      <div className="flex items-center">
        <button 
          onClick={toggleSidebar}
          className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 focus:outline-none"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Search - Desktop */}
        <div className="hidden md:flex items-center ml-4 relative">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="w-64 pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Search - Mobile */}
      {isSearchActive && (
        <div className="absolute inset-0 bg-white z-20 flex items-center p-4 md:hidden">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              autoFocus
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <button
            onClick={() => setIsSearchActive(false)}
            className="ml-2 p-2 text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Right section */}
      <div className="flex items-center space-x-2">
        {/* Mobile search button */}
        <button
          onClick={() => setIsSearchActive(true)}
          className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 md:hidden"
        >
          <Search className="h-5 w-5" />
        </button>

        {/* Notifications */}
        <div className="relative">
          <button className="p-2 rounded-lg text-gray-600 hover:bg-gray-100">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">
              3
            </span>
          </button>
        </div>

        {/* Messages */}
        <div className="relative">
          <button className="p-2 rounded-lg text-gray-600 hover:bg-gray-100">
            <MessageSquare className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-4 w-4 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">
              5
            </span>
          </button>
        </div>

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100"
          >
            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center text-white font-medium">
              CPT
            </div>
            <div className="hidden md:block text-left">
              <div className="text-sm font-medium text-gray-700">Captains IT</div>
              <div className="text-xs text-gray-500">Admin</div>
            </div>
            <ChevronDown className="h-4 w-4 text-gray-500 hidden md:block" />
          </button>

          {/* Profile dropdown */}
          {isProfileMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-10 border border-gray-200">
              <a
                href="#"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Your Profile
              </a>
              <a
                href="#"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Settings
              </a>
              <a
                href="#"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Sign out
              </a>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
