"use client"

import { useState } from "react"
import { Search, Filter, ChevronDown, MoreHorizontal, Edit, Eye, ArrowUpDown, CheckCircle, XCircle, Clock, Truck, Package, MessageSquare, Calendar, User, CreditCard } from 'lucide-react'

// Import the shared order data
import { orders } from "./orders-data"

const OrdersPage = () => {
  const [selectedTab, setSelectedTab] = useState("all")
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [dateFilter, setDateFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  // Filter orders based on selected tab, search query, and filters
  const filteredOrders = () => {
    let filtered = [...orders]

    // Filter by tab
    if (selectedTab !== "all") {
      filtered = filtered.filter((order) => order.status.toLowerCase() === selectedTab)
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (order) =>
          order.id.toLowerCase().includes(query) ||
          order.customer.name.toLowerCase().includes(query) ||
          order.customer.email.toLowerCase().includes(query)
      )
    }

    // Filter by date
    if (dateFilter !== "all") {
      const today = new Date()
      const thirtyDaysAgo = new Date(today)
      thirtyDaysAgo.setDate(today.getDate() - 30)
      const sevenDaysAgo = new Date(today)
      sevenDaysAgo.setDate(today.getDate() - 7)

      filtered = filtered.filter((order) => {
        const orderDate = new Date(order.date)
        if (dateFilter === "today") {
          return (
            orderDate.getDate() === today.getDate() &&
            orderDate.getMonth() === today.getMonth() &&
            orderDate.getFullYear() === today.getFullYear()
          )
        } else if (dateFilter === "last7days") {
          return orderDate >= sevenDaysAgo
        } else if (dateFilter === "last30days") {
          return orderDate >= thirtyDaysAgo
        }
        return true
      })
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status.toLowerCase() === statusFilter)
    }

    return filtered
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "Pending":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="h-3 w-3 mr-1" />
            {status}
          </span>
        )
      case "Processing":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <Package className="h-3 w-3 mr-1" />
            {status}
          </span>
        )
      case "Shipped":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
            <Truck className="h-3 w-3 mr-1" />
            {status}
          </span>
        )
      case "Delivered":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            {status}
          </span>
        )
      case "Cancelled":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle className="h-3 w-3 mr-1" />
            {status}
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {status}
          </span>
        )
    }
  }

  const getPaymentStatusBadge = (status) => {
    switch (status) {
      case "Paid":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            {status}
          </span>
        )
      case "Pending":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="h-3 w-3 mr-1" />
            {status}
          </span>
        )
      case "Failed":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle className="h-3 w-3 mr-1" />
            {status}
          </span>
        )
      case "Refunded":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
            <CreditCard className="h-3 w-3 mr-1" />
            {status}
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {status}
          </span>
        )
    }
  }

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
  }

  // Handle date filter change
  const handleDateFilterChange = (value) => {
    setDateFilter(value)
  }

  // Handle status filter change
  const handleStatusFilterChange = (value) => {
    setStatusFilter(value)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <div className="flex space-x-2">
          <button className="border border-gray-300 bg-white text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
            Export Orders
          </button>
          <button className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-purple-700 hover:to-indigo-700 transition-colors">
            Create Order
          </button>
        </div>
      </div>

      {selectedOrder ? (
        // Order Details View
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <div className="flex items-center">
              <button onClick={() => setSelectedOrder(null)} className="mr-4 text-gray-500 hover:text-gray-700">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Order {selectedOrder.id}</h2>
                <p className="text-sm text-gray-500">Placed on {selectedOrder.date}</p>
              </div>
            </div>
            <div className="flex space-x-2">
              {getStatusBadge(selectedOrder.status)}
              {getPaymentStatusBadge(selectedOrder.paymentStatus)}
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Customer and Order Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Customer Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 mb-3">Customer Information</h3>
                <div className="flex items-start">
                  <img
                    src={selectedOrder.customer.avatar || "/placeholder.svg"}
                    alt={selectedOrder.customer.name}
                    className="h-10 w-10 rounded-full mr-3"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{selectedOrder.customer.name}</p>
                    <p className="text-sm text-gray-500 mt-1">{selectedOrder.customer.email}</p>
                    <p className="text-sm text-gray-500 mt-1">{selectedOrder.customer.phone}</p>
                  </div>
                </div>
              </div>

              {/* Shipping Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 mb-3">Shipping Information</h3>
                <p className="text-sm text-gray-900">{selectedOrder.address}</p>
                {selectedOrder.trackingNumber && (
                  <p className="text-sm text-gray-900 mt-2">Tracking: {selectedOrder.trackingNumber}</p>
                )}
                {selectedOrder.notes && (
                  <div className="mt-2 p-2 bg-yellow-50 border border-yellow-100 rounded text-sm text-gray-700">
                    <p className="font-medium">Notes:</p>
                    <p>{selectedOrder.notes}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Order Items */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-3">Order Items</h3>
              <div className="bg-gray-50 rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {selectedOrder.products.map((product, index) => (
                      <tr key={index}>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                          {product.name}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-right">
                          ${product.price.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-right">
                          {product.quantity}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                          ${(product.price * product.quantity).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50">
                    <tr>
                      <th colSpan="3" className="px-4 py-3 text-right text-sm font-medium text-gray-500">
                        Total
                      </th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-gray-900">
                        ${selectedOrder.total.toFixed(2)}
                      </th>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500 mb-3">Payment Information</h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-900">
                    <CreditCard className="h-4 w-4 inline mr-1" />
                    {selectedOrder.paymentMethod}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Payment Status: {getPaymentStatusBadge(selectedOrder.paymentStatus)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">Total Paid</p>
                  <p className="text-lg font-bold text-gray-900">${selectedOrder.total.toFixed(2)}</p>
                </div>
              </div>
            </div>

            {/* Order Status Timeline */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500 mb-3">Order Status</h3>
              <div className="relative">
                <div className="absolute left-5 top-0 h-full w-0.5 bg-gray-200"></div>
                <ul className="space-y-4 relative">
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center z-10">
                      <CheckCircle className="h-5 w-5 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">Order Placed</p>
                      <p className="text-xs text-gray-500">{selectedOrder.date}</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div
                      className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center z-10 ${
                        ["Processing", "Shipped", "Delivered"].includes(selectedOrder.status)
                          ? "bg-blue-100"
                          : "bg-gray-100"
                      }`}
                    >
                      <Package
                        className={`h-5 w-5 ${
                          ["Processing", "Shipped", "Delivered"].includes(selectedOrder.status)
                            ? "text-blue-600"
                            : "text-gray-400"
                        }`}
                      />
                    </div>
                    <div className="ml-4">
                      <p
                        className={`text-sm font-medium ${
                          ["Processing", "Shipped", "Delivered"].includes(selectedOrder.status)
                            ? "text-gray-900"
                            : "text-gray-500"
                        }`}
                      >
                        Processing
                      </p>
                      {selectedOrder.status === "Processing" && (
                        <p className="text-xs text-gray-500">In progress</p>
                      )}
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div
                      className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center z-10 ${
                        ["Shipped", "Delivered"].includes(selectedOrder.status) ? "bg-indigo-100" : "bg-gray-100"
                      }`}
                    >
                      <Truck
                        className={`h-5 w-5 ${
                          ["Shipped", "Delivered"].includes(selectedOrder.status) ? "text-indigo-600" : "text-gray-400"
                        }`}
                      />
                    </div>
                    <div className="ml-4">
                      <p
                        className={`text-sm font-medium ${
                          ["Shipped", "Delivered"].includes(selectedOrder.status) ? "text-gray-900" : "text-gray-500"
                        }`}
                      >
                        Shipped
                      </p>
                      {selectedOrder.status === "Shipped" && selectedOrder.trackingNumber && (
                        <p className="text-xs text-gray-500">Tracking: {selectedOrder.trackingNumber}</p>
                      )}
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div
                      className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center z-10 ${
                        selectedOrder.status === "Delivered" ? "bg-green-100" : "bg-gray-100"
                      }`}
                    >
                      <CheckCircle
                        className={`h-5 w-5 ${
                          selectedOrder.status === "Delivered" ? "text-green-600" : "text-gray-400"
                        }`}
                      />
                    </div>
                    <div className="ml-4">
                      <p
                        className={`text-sm font-medium ${
                          selectedOrder.status === "Delivered" ? "text-gray-900" : "text-gray-500"
                        }`}
                      >
                        Delivered
                      </p>
                      {selectedOrder.status === "Delivered" && <p className="text-xs text-gray-500">Completed</p>}
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            {/* Support Tickets */}
            {selectedOrder.supportTickets && selectedOrder.supportTickets.length > 0 && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 mb-3">Support Tickets</h3>
                <div className="space-y-3">
                  {selectedOrder.supportTickets.map((ticket, index) => (
                    <div key={index} className="p-3 bg-white rounded-lg border border-gray-200">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center">
                          <MessageSquare className="h-4 w-4 text-purple-600 mr-2" />
                          <span className="text-sm font-medium text-gray-900">{ticket.subject}</span>
                        </div>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            ticket.status === "Open"
                              ? "bg-green-100 text-green-800"
                              : ticket.status === "Closed"
                              ? "bg-gray-100 text-gray-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {ticket.status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">Last updated: {ticket.lastUpdate}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        // Orders List View
        <>
          {/* Tabs */}
          <div className="bg-white rounded-xl shadow-sm">
            <div className="border-b border-gray-200">
              <nav className="flex overflow-x-auto">
                <button
                  onClick={() => setSelectedTab("all")}
                  className={`py-4 px-6 text-sm font-medium whitespace-nowrap ${
                    selectedTab === "all"
                      ? "border-b-2 border-purple-600 text-purple-600"
                      : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  All Orders
                  <span className="ml-2 bg-gray-100 text-gray-700 py-0.5 px-2 rounded-full text-xs">
                    {orders.length}
                  </span>
                </button>
                <button
                  onClick={() => setSelectedTab("pending")}
                  className={`py-4 px-6 text-sm font-medium whitespace-nowrap ${
                    selectedTab === "pending"
                      ? "border-b-2 border-purple-600 text-purple-600"
                      : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Pending
                  <span className="ml-2 bg-yellow-100 text-yellow-800 py-0.5 px-2 rounded-full text-xs">
                    {orders.filter((o) => o.status === "Pending").length}
                  </span>
                </button>
                <button
                  onClick={() => setSelectedTab("processing")}
                  className={`py-4 px-6 text-sm font-medium whitespace-nowrap ${
                    selectedTab === "processing"
                      ? "border-b-2 border-purple-600 text-purple-600"
                      : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Processing
                  <span className="ml-2 bg-blue-100 text-blue-800 py-0.5 px-2 rounded-full text-xs">
                    {orders.filter((o) => o.status === "Processing").length}
                  </span>
                </button>
                <button
                  onClick={() => setSelectedTab("shipped")}
                  className={`py-4 px-6 text-sm font-medium whitespace-nowrap ${
                    selectedTab === "shipped"
                      ? "border-b-2 border-purple-600 text-purple-600"
                      : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Shipped
                  <span className="ml-2 bg-indigo-100 text-indigo-800 py-0.5 px-2 rounded-full text-xs">
                    {orders.filter((o) => o.status === "Shipped").length}
                  </span>
                </button>
                <button
                  onClick={() => setSelectedTab("delivered")}
                  className={`py-4 px-6 text-sm font-medium whitespace-nowrap ${
                    selectedTab === "delivered"
                      ? "border-b-2 border-purple-600 text-purple-600"
                      : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Delivered
                  <span className="ml-2 bg-green-100 text-green-800 py-0.5 px-2 rounded-full text-xs">
                    {orders.filter((o) => o.status === "Delivered").length}
                  </span>
                </button>
                <button
                  onClick={() => setSelectedTab("cancelled")}
                  className={`py-4 px-6 text-sm font-medium whitespace-nowrap ${
                    selectedTab === "cancelled"
                      ? "border-b-2 border-purple-600 text-purple-600"
                      : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Cancelled
                  <span className="ml-2 bg-red-100 text-red-800 py-0.5 px-2 rounded-full text-xs">
                    {orders.filter((o) => o.status === "Cancelled").length}
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
                    placeholder="Search orders by ID, customer name, or email..."
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <div className="relative">
                    <button
                      className="flex items-center px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => {
                        const dropdown = document.getElementById("dateFilterDropdown")
                        dropdown.classList.toggle("hidden")
                      }}
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>
                        {dateFilter === "all"
                          ? "All Time"
                          : dateFilter === "today"
                          ? "Today"
                          : dateFilter === "last7days"
                          ? "Last 7 Days"
                          : "Last 30 Days"}
                      </span>
                      <ChevronDown className="h-4 w-4 ml-2" />
                    </button>
                    <div
                      id="dateFilterDropdown"
                      className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-10 border border-gray-200 hidden"
                    >
                      <button
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => {
                          handleDateFilterChange("all")
                          document.getElementById("dateFilterDropdown").classList.add("hidden")
                        }}
                      >
                        All Time
                      </button>
                      <button
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => {
                          handleDateFilterChange("today")
                          document.getElementById("dateFilterDropdown").classList.add("hidden")
                        }}
                      >
                        Today
                      </button>
                      <button
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => {
                          handleDateFilterChange("last7days")
                          document.getElementById("dateFilterDropdown").classList.add("hidden")
                        }}
                      >
                        Last 7 Days
                      </button>
                      <button
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => {
                          handleDateFilterChange("last30days")
                          document.getElementById("dateFilterDropdown").classList.add("hidden")
                        }}
                      >
                        Last 30 Days
                      </button>
                    </div>
                  </div>
                  <div className="relative">
                    <button
                      className="flex items-center px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => {
                        const dropdown = document.getElementById("statusFilterDropdown")
                        dropdown.classList.toggle("hidden")
                      }}
                    >
                      <Filter className="h-4 w-4 mr-2" />
                      <span>
                        {statusFilter === "all"
                          ? "All Statuses"
                          : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
                      </span>
                      <ChevronDown className="h-4 w-4 ml-2" />
                    </button>
                    <div
                      id="statusFilterDropdown"
                      className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-10 border border-gray-200 hidden"
                    >
                      <button
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => {
                          handleStatusFilterChange("all")
                          document.getElementById("statusFilterDropdown").classList.add("hidden")
                        }}
                      >
                        All Statuses
                      </button>
                      <button
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => {
                          handleStatusFilterChange("pending")
                          document.getElementById("statusFilterDropdown").classList.add("hidden")
                        }}
                      >
                        Pending
                      </button>
                      <button
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => {
                          handleStatusFilterChange("processing")
                          document.getElementById("statusFilterDropdown").classList.add("hidden")
                        }}
                      >
                        Processing
                      </button>
                      <button
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => {
                          handleStatusFilterChange("shipped")
                          document.getElementById("statusFilterDropdown").classList.add("hidden")
                        }}
                      >
                        Shipped
                      </button>
                      <button
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => {
                          handleStatusFilterChange("delivered")
                          document.getElementById("statusFilterDropdown").classList.add("hidden")
                        }}
                      >
                        Delivered
                      </button>
                      <button
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => {
                          handleStatusFilterChange("cancelled")
                          document.getElementById("statusFilterDropdown").classList.add("hidden")
                        }}
                      >
                        Cancelled
                      </button>
                    </div>
                  </div>
                  <div className="relative">
                    <button
                      className="flex items-center px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => {
                        const dropdown = document.getElementById("customerFilterDropdown")
                        dropdown.classList.toggle("hidden")
                      }}
                    >
                      <User className="h-4 w-4 mr-2" />
                      <span>Customer</span>
                      <ChevronDown className="h-4 w-4 ml-2" />
                    </button>
                    <div
                      id="customerFilterDropdown"
                      className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-10 border border-gray-200 hidden"
                    >
                      <button
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => {
                          document.getElementById("customerFilterDropdown").classList.add("hidden")
                        }}
                      >
                        All Customers
                      </button>
                      {/* List of customers would go here */}
                      {Array.from(new Set(orders.map((order) => order.customer.name))).map((name, index) => (
                        <button
                          key={index}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => {
                            setSearchQuery(name)
                            document.getElementById("customerFilterDropdown").classList.add("hidden")
                          }}
                        >
                          {name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Orders Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center">
                        Order
                        <ArrowUpDown className="h-4 w-4 ml-1" />
                      </div>
                    </th>
                    <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center">
                        Customer
                        <ArrowUpDown className="h-4 w-4 ml-1" />
                      </div>
                    </th>
                    <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center">
                        Date
                        <ArrowUpDown className="h-4 w-4 ml-1" />
                      </div>
                    </th>
                    <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center">
                        Total
                        <ArrowUpDown className="h-4 w-4 ml-1" />
                      </div>
                    </th>
                    <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment
                    </th>
                    <th className="px-4 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredOrders().map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{order.id}</div>
                        {order.supportTickets && order.supportTickets.length > 0 && (
                          <div className="mt-1">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                              <MessageSquare className="h-3 w-3 mr-1" />
                              Support
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img
                            src={order.customer.avatar || "/placeholder.svg"}
                            alt={order.customer.name}
                            className="h-8 w-8 rounded-full"
                          />
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">{order.customer.name}</div>
                            <div className="text-sm text-gray-500">{order.customer.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{order.date}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">${order.total.toFixed(2)}</div>
                        <div className="text-sm text-gray-500">{order.products.length} item(s)</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">{getStatusBadge(order.status)}</td>
                      <td className="px-4 py-4 whitespace-nowrap">{getPaymentStatusBadge(order.paymentStatus)}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button onClick={() => setSelectedOrder(order)} className="text-gray-500 hover:text-gray-700">
                            <Eye className="h-5 w-5" />
                          </button>
                          <button className="text-blue-500 hover:text-blue-700">
                            <Edit className="h-5 w-5" />
                          </button>
                          <div className="relative">
                            <button
                              className="text-gray-500 hover:text-gray-700"
                              onClick={() => {
                                const dropdown = document.getElementById(`actionDropdown-${order.id}`)
                                dropdown.classList.toggle("hidden")
                              }}
                            >
                              <MoreHorizontal className="h-5 w-5" />
                            </button>
                            <div
                              id={`actionDropdown-${order.id}`}
                              className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-10 border border-gray-200 hidden"
                            >
                              <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                Print Invoice
                              </button>
                              <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                Send Email
                              </button>
                              <button className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                                Cancel Order
                              </button>
                            </div>
                          </div>
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
                    Showing <span className="font-medium">1</span> to{" "}
                    <span className="font-medium">{filteredOrders().length}</span> of{" "}
                    <span className="font-medium">{filteredOrders().length}</span> results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                      <span className="sr-only">Previous</span>
                      <svg
                        className="h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                    <button className="relative inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-purple-600 to-indigo-600">
                      1
                    </button>
                    <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                      <span className="sr-only">Next</span>
                      <svg
                        className="h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default OrdersPage
