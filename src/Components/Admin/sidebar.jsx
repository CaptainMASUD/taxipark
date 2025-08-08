"use client"

import { useState } from "react"
import { LayoutDashboard, Package, Users, DollarSign, ShoppingCart, ClipboardList, ChevronDown, ChevronRight, LogOut, Settings, PlusCircle, List, Edit, Sparkles, MessageSquare, HelpCircle } from 'lucide-react'

const Sidebar = ({ isOpen, setCurrentPage, currentPage }) => {
  const [expandedMenus, setExpandedMenus] = useState({
    products: false,
    orders: false,
  })

  const toggleMenu = (menu) => {
    setExpandedMenus({
      ...expandedMenus,
      [menu]: !expandedMenus[menu],
    })
  }

  const isActive = (page) => currentPage === page

  const isProductSection = currentPage.includes("product")
  const isOrderSection = currentPage === "orders" || currentPage === "order-management"

  return (
    <div
      className={`bg-white border-r border-gray-200 transition-all duration-300 ease-in-out ${
        isOpen ? "w-64" : "w-20"
      } flex flex-col h-full`}
    >
      {/* Logo */}
      <div className="flex items-center justify-center h-16 border-b border-gray-200">
        <div className={`flex items-center ${isOpen ? "justify-start pl-4" : "justify-center"}`}>
          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xl">
            A
          </div>
          {isOpen && <span className="ml-2 text-xl font-semibold text-gray-800">Admin</span>}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {/* Dashboard */}
          <li>
            <button
              onClick={() => setCurrentPage("dashboard")}
              className={`flex items-center w-full ${
                isOpen ? "justify-start px-4" : "justify-center"
              } py-3 rounded-xl transition-colors ${
                isActive("dashboard")
                  ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <LayoutDashboard className="h-5 w-5" />
              {isOpen && <span className="ml-3 font-medium">Dashboard</span>}
            </button>
          </li>

          {/* Products */}
          <li>
            <div className="relative">
              <button
                onClick={() => toggleMenu("products")}
                className={`flex items-center w-full ${
                  isOpen ? "justify-between px-4" : "justify-center"
                } py-3 rounded-xl transition-colors ${
                  isProductSection
                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center">
                  <Package className="h-5 w-5" />
                  {isOpen && <span className="ml-3 font-medium">Products</span>}
                </div>
                {isOpen && (
                  <div>
                    {expandedMenus.products ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </div>
                )}
              </button>

              {/* Submenu */}
              {isOpen && expandedMenus.products && (
                <ul className="mt-1 pl-10 space-y-1">
                  <li>
                    <button
                      onClick={() => setCurrentPage("add-product")}
                      className={`flex items-center w-full py-2 rounded-lg transition-colors ${
                        isActive("add-product") ? "text-purple-600 font-medium" : "text-gray-600 hover:text-purple-600"
                      }`}
                    >
                      <PlusCircle className="h-4 w-4 mr-2" />
                      <span>Add Product</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setCurrentPage("all-products")}
                      className={`flex items-center w-full py-2 rounded-lg transition-colors ${
                        isActive("all-products") ? "text-purple-600 font-medium" : "text-gray-600 hover:text-purple-600"
                      }`}
                    >
                      <List className="h-4 w-4 mr-2" />
                      <span>All Products</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setCurrentPage("manage-products")}
                      className={`flex items-center w-full py-2 rounded-lg transition-colors ${
                        isActive("manage-products")
                          ? "text-purple-600 font-medium"
                          : "text-gray-600 hover:text-purple-600"
                      }`}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      <span>Manage Products</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setCurrentPage("new-arrivals")}
                      className={`flex items-center w-full py-2 rounded-lg transition-colors ${
                        isActive("new-arrivals") ? "text-purple-600 font-medium" : "text-gray-600 hover:text-purple-600"
                      }`}
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      <span>New Arrivals</span>
                    </button>
                  </li>
                </ul>
              )}
            </div>
          </li>

          {/* Users */}
          <li>
            <button
              onClick={() => setCurrentPage("users")}
              className={`flex items-center w-full ${
                isOpen ? "justify-start px-4" : "justify-center"
              } py-3 rounded-xl transition-colors ${
                isActive("users")
                  ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Users className="h-5 w-5" />
              {isOpen && <span className="ml-3 font-medium">Users</span>}
            </button>
          </li>

          {/* Sales */}
          <li>
            <button
              onClick={() => setCurrentPage("sales")}
              className={`flex items-center w-full ${
                isOpen ? "justify-start px-4" : "justify-center"
              } py-3 rounded-xl transition-colors ${
                isActive("sales")
                  ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <DollarSign className="h-5 w-5" />
              {isOpen && <span className="ml-3 font-medium">Sales</span>}
            </button>
          </li>

          {/* Orders with submenu */}
          <li>
            <div className="relative">
              <button
                onClick={() => toggleMenu("orders")}
                className={`flex items-center w-full ${
                  isOpen ? "justify-between px-4" : "justify-center"
                } py-3 rounded-xl transition-colors ${
                  isOrderSection
                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center">
                  <ShoppingCart className="h-5 w-5" />
                  {isOpen && <span className="ml-3 font-medium">Orders</span>}
                </div>
                {isOpen && (
                  <div>
                    {expandedMenus.orders ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </div>
                )}
              </button>

              {/* Orders Submenu */}
              {isOpen && expandedMenus.orders && (
                <ul className="mt-1 pl-10 space-y-1">
                  <li>
                    <button
                      onClick={() => setCurrentPage("orders")}
                      className={`flex items-center w-full py-2 rounded-lg transition-colors ${
                        isActive("orders") ? "text-purple-600 font-medium" : "text-gray-600 hover:text-purple-600"
                      }`}
                    >
                      <List className="h-4 w-4 mr-2" />
                      <span>Orders List</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setCurrentPage("order-management")}
                      className={`flex items-center w-full py-2 rounded-lg transition-colors ${
                        isActive("order-management")
                          ? "text-purple-600 font-medium"
                          : "text-gray-600 hover:text-purple-600"
                      }`}
                    >
                      <ClipboardList className="h-4 w-4 mr-2" />
                      <span>Order Management</span>
                    </button>
                  </li>
                </ul>
              )}
            </div>
          </li>

          {/* Customer Support - Separate menu item */}
          <li>
            <button
              onClick={() => setCurrentPage("customer-support")}
              className={`flex items-center w-full ${
                isOpen ? "justify-start px-4" : "justify-center"
              } py-3 rounded-xl transition-colors ${
                isActive("customer-support")
                  ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <MessageSquare className="h-5 w-5" />
              {isOpen && <span className="ml-3 font-medium">Customer Support</span>}
            </button>
          </li>
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <ul className="space-y-1">
          <li>
            <button
              onClick={() => setCurrentPage("help")}
              className={`flex items-center w-full ${
                isOpen ? "justify-start px-4" : "justify-center"
              } py-3 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors ${
                isActive("help") ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white" : ""
              }`}
            >
              <HelpCircle className="h-5 w-5" />
              {isOpen && <span className="ml-3 font-medium">Help & Resources</span>}
            </button>
          </li>
          <li>
            <button
              onClick={() => setCurrentPage("settings")}
              className={`flex items-center w-full ${
                isOpen ? "justify-start px-4" : "justify-center"
              } py-3 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors ${
                isActive("settings") ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white" : ""
              }`}
            >
              <Settings className="h-5 w-5" />
              {isOpen && <span className="ml-3 font-medium">Settings</span>}
            </button>
          </li>
          <li>
            <button
              className={`flex items-center w-full ${
                isOpen ? "justify-start px-4" : "justify-center"
              } py-3 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors`}
            >
              <LogOut className="h-5 w-5" />
              {isOpen && <span className="ml-3 font-medium">Logout</span>}
            </button>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Sidebar
