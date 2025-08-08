"use client"

import { useState } from "react"
import { Search, Filter, ChevronDown, Edit, Trash, CheckCircle, XCircle, ArrowUpDown, AlertTriangle } from 'lucide-react'

const ManageProductsPage = () => {
  const [selectedTab, setSelectedTab] = useState("all")

  // Sample product data
  const products = [
    { id: 1, name: "Wireless Earbuds", category: "Electronics", price: 129.99, stock: 45, status: "Active", lastUpdated: "2023-05-14" },
    { id: 2, name: "Smart Watch", category: "Electronics", price: 199.99, stock: 32, status: "Active", lastUpdated: "2023-05-13" },
    { id: 3, name: "Bluetooth Speaker", category: "Electronics", price: 89.99, stock: 18, status: "Active", lastUpdated: "2023-05-12" },
    { id: 4, name: "Laptop Sleeve", category: "Accessories", price: 29.99, stock: 56, status: "Active", lastUpdated: "2023-05-11" },
    { id: 5, name: "Phone Case", category: "Accessories", price: 19.99, stock: 78, status: "Active", lastUpdated: "2023-05-10" },
    { id: 6, name: "Wireless Charger", category: "Electronics", price: 49.99, stock: 23, status: "Active", lastUpdated: "2023-05-09" },
    { id: 7, name: "Fitness Tracker", category: "Electronics", price: 79.99, stock: 0, status: "Out of Stock", lastUpdated: "2023-05-08" },
    { id: 8, name: "Desk Lamp", category: "Home", price: 39.99, stock: 12, status: "Active", lastUpdated: "2023-05-07" },
    { id: 9, name: "Keyboard", category: "Electronics", price: 59.99, stock: 5, status: "Low Stock", lastUpdated: "2023-05-06" },
    { id: 10, name: "Mouse", category: "Electronics", price: 24.99, stock: 0, status: "Discontinued", lastUpdated: "2023-05-05" },
  ]

  const filteredProducts = () => {
    switch (selectedTab) {
      case "active":
        return products.filter(product => product.status === "Active")
      case "outOfStock":
        return products.filter(product => product.status === "Out of Stock")
      case "lowStock":
        return products.filter(product => product.status === "Low Stock")
      case "discontinued":
        return products.filter(product => product.status === "Discontinued")
      default:
        return products
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "Active":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            {status}
          </span>
        )
      case "Out of Stock":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle className="h-3 w-3 mr-1" />
            {status}
          </span>
        )
      case "Low Stock":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <AlertTriangle className="h-3 w-3 mr-1" />
            {status}
          </span>
        )
      case "Discontinued":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <XCircle className="h-3 w-3 mr-1" />
            {status}
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {status}
          </span>
        )
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Manage Products</h1>
        <button className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-purple-700 hover:to-indigo-700 transition-colors">
          Add New Product
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setSelectedTab("all")}
              className={`py-4 px-6 text-sm font-medium ${
                selectedTab === "all"
                  ? "border-b-2 border-purple-600 text-purple-600"
                  : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              All Products
              <span className="ml-2 bg-gray-100 text-gray-700 py-0.5 px-2 rounded-full text-xs">
                {products.length}
              </span>
            </button>
            <button
              onClick={() => setSelectedTab("active")}
              className={`py-4 px-6 text-sm font-medium ${
                selectedTab === "active"
                  ? "border-b-2 border-purple-600 text-purple-600"
                  : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Active
              <span className="ml-2 bg-green-100 text-green-800 py-0.5 px-2 rounded-full text-xs">
                {products.filter(p => p.status === "Active").length}
              </span>
            </button>
            <button
              onClick={() => setSelectedTab("outOfStock")}
              className={`py-4 px-6 text-sm font-medium ${
                selectedTab === "outOfStock"
                  ? "border-b-2 border-purple-600 text-purple-600"
                  : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Out of Stock
              <span className="ml-2 bg-red-100 text-red-800 py-0.5 px-2 rounded-full text-xs">
                {products.filter(p => p.status === "Out of Stock").length}
              </span>
            </button>
            <button
              onClick={() => setSelectedTab("lowStock")}
              className={`py-4 px-6 text-sm font-medium ${
                selectedTab === "lowStock"
                  ? "border-b-2 border-purple-600 text-purple-600"
                  : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Low Stock
              <span className="ml-2 bg-yellow-100 text-yellow-800 py-0.5 px-2 rounded-full text-xs">
                {products.filter(p => p.status === "Low Stock").length}
              </span>
            </button>
            <button
              onClick={() => setSelectedTab("discontinued")}
              className={`py-4 px-6 text-sm font-medium ${
                selectedTab === "discontinued"
                  ? "border-b-2 border-purple-600 text-purple-600"
                  : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Discontinued
              <span className="ml-2 bg-gray-100 text-gray-800 py-0.5 px-2 rounded-full text-xs">
                {products.filter(p => p.status === "Discontinued").length}
              </span>
            </button>
          </nav>
        </div>

        {/* Filters and Search */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search products..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <div className="relative">
                <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 transition-colors">
                  <Filter className="h-4 w-4 mr-2" />
                  <span>Filter</span>
                  <ChevronDown className="h-4 w-4 ml-2" />
                </button>
              </div>
              <div className="relative">
                <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 transition-colors">
                  <span>Category</span>
                  <ChevronDown className="h-4 w-4 ml-2" />
                </button>
              </div>
              <div className="relative">
                <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 transition-colors">
                  <span>Sort By</span>
                  <ChevronDown className="h-4 w-4 ml-2" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center">
                    Product
                    <ArrowUpDown className="h-4 w-4 ml-1" />
                  </div>
                </th>
                <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center">
                    Category
                    <ArrowUpDown className="h-4 w-4 ml-1" />
                  </div>
                </th>
                <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center">
                    Price
                    <ArrowUpDown className="h-4 w-4 ml-1" />
                  </div>
                </th>
                <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center">
                    Stock
                    <ArrowUpDown className="h-4 w-4 ml-1" />
                  </div>
                </th>
                <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center">
                    Last Updated
                    <ArrowUpDown className="h-4 w-4 ml-1" />
                  </div>
                </th>
                <th className="px-4 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts().map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0 rounded-lg bg-gray-100 flex items-center justify-center">
                        <span className="text-gray-500 text-xs">{product.name.substring(0, 2)}</span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        <div className="text-sm text-gray-500">ID: #{product.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{product.category}</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">${product.price.toFixed(2)}</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{product.stock}</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    {getStatusBadge(product.status)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{product.lastUpdated}</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button className="text-blue-500 hover:text-blue-700">
                        <Edit className="h-5 w-5" />
                      </button>
                      <button className="text-red-500 hover:text-red-700">
                        <Trash className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
          <div className="flex-1 flex justify-between sm:hidden">
            <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Previous
            </button>
            <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to <span className="font-medium">10</span> of{" "}
                <span className="font-medium">{filteredProducts().length}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  <span className="sr-only">Previous</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                <button className="relative inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-purple-600 to-indigo-600">
                  1
                </button>
                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                  2
                </button>
                <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  <span className="sr-only">Next</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ManageProductsPage
