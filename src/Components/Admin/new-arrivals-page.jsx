"use client"

import { useState } from "react"
import { Search, Filter, ChevronDown, Edit, Trash, Eye, CheckCircle, Calendar, Clock, ArrowUpDown } from 'lucide-react'

const NewArrivalsPage = () => {
  // Sample product data
  const products = [
    { id: 1, name: "Wireless Earbuds Pro", category: "Electronics", price: 149.99, addedDate: "2023-05-14", featured: true, image: "/placeholder.svg?height=80&width=80" },
    { id: 2, name: "Smart Watch Series 5", category: "Electronics", price: 249.99, addedDate: "2023-05-13", featured: true, image: "/placeholder.svg?height=80&width=80" },
    { id: 3, name: "Bluetooth Speaker XL", category: "Electronics", price: 99.99, addedDate: "2023-05-12", featured: false, image: "/placeholder.svg?height=80&width=80" },
    { id: 4, name: "Premium Laptop Sleeve", category: "Accessories", price: 39.99, addedDate: "2023-05-11", featured: false, image: "/placeholder.svg?height=80&width=80" },
    { id: 5, name: "Designer Phone Case", category: "Accessories", price: 29.99, addedDate: "2023-05-10", featured: true, image: "/placeholder.svg?height=80&width=80" },
    { id: 6, name: "Fast Wireless Charger", category: "Electronics", price: 59.99, addedDate: "2023-05-09", featured: false, image: "/placeholder.svg?height=80&width=80" },
    { id: 7, name: "Ultra Fitness Tracker", category: "Electronics", price: 89.99, addedDate: "2023-05-08", featured: true, image: "/placeholder.svg?height=80&width=80" },
    { id: 8, name: "Modern Desk Lamp", category: "Home", price: 49.99, addedDate: "2023-05-07", featured: false, image: "/placeholder.svg?height=80&width=80" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">New Arrivals</h1>
        <div className="flex space-x-2">
          <button className="border border-gray-300 bg-white text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
            Manage Featured
          </button>
          <button className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-purple-700 hover:to-indigo-700 transition-colors">
            Add New Product
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search new arrivals..."
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
                <span>Date Added</span>
                <ChevronDown className="h-4 w-4 ml-2" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Products */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Featured New Arrivals</h2>
          <p className="text-sm text-gray-500 mt-1">Products that are highlighted on the homepage.</p>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products
            .filter(product => product.featured)
            .map(product => (
              <div key={product.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="relative">
                  <img 
                    src={product.image || "/placeholder.svg"} 
                    alt={product.name} 
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      Featured
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-medium text-gray-900">{product.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{product.category}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-lg font-bold text-gray-900">${product.price.toFixed(2)}</span>
                    <div className="flex items-center text-xs text-gray-500">
                      <Calendar className="h-3 w-3 mr-1" />
                      {product.addedDate}
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <button className="text-purple-600 hover:text-purple-800 text-sm font-medium">
                      View Details
                    </button>
                    <div className="flex space-x-1">
                      <button className="p-1 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="p-1 text-gray-500 hover:text-red-600 rounded-full hover:bg-gray-100">
                        <Trash className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* All New Arrivals */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">All New Arrivals</h2>
          <p className="text-sm text-gray-500 mt-1">Products added in the last 30 days.</p>
        </div>
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
                    Added Date
                    <ArrowUpDown className="h-4 w-4 ml-1" />
                  </div>
                </th>
                <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Featured
                </th>
                <th className="px-4 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img 
                        src={product.image || "/placeholder.svg"} 
                        alt={product.name} 
                        className="h-10 w-10 rounded-lg object-cover"
                      />
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
                    <div className="text-sm text-gray-500 flex items-center">
                      <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                      {product.addedDate}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    {product.featured ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Yes
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        No
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button className="text-gray-500 hover:text-gray-700">
                        <Eye className="h-5 w-5" />
                      </button>
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
                Showing <span className="font-medium">1</span> to <span className="font-medium">{products.length}</span> of{" "}
                <span className="font-medium">{products.length}</span> results
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

export default NewArrivalsPage
