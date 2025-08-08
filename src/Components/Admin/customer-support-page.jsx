"use client"

import { useState } from "react"
import { Search, Filter, ChevronDown, MessageSquare, CheckCircle, XCircle, Clock, User, Calendar, Send, Paperclip, Phone, Video, MoreHorizontal, ArrowUpDown, Mail, AlertTriangle } from 'lucide-react'

// Sample support tickets data
const supportTickets = [
  {
    id: "TKT-1234",
    subject: "Delivery question",
    status: "Open",
    priority: "Medium",
    lastUpdate: "May 15, 2023",
    customer: {
      name: "Alex Johnson",
      email: "alex.johnson@example.com",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    orderId: "#ORD-71267",
    messages: [
      {
        sender: "customer",
        message: "Hi, I was wondering when my order will be delivered?",
        time: "May 15, 2023 10:30 AM",
      },
      {
        sender: "support",
        message:
          "Hello Alex, your order is being processed and should ship within 24 hours. We'll update you with tracking information once it's available.",
        time: "May 15, 2023 11:15 AM",
      },
    ],
  },
  {
    id: "TKT-5678",
    subject: "Wrong color received",
    status: "Closed",
    priority: "High",
    lastUpdate: "May 12, 2023",
    customer: {
      name: "Emily Davis",
      email: "emily.davis@example.com",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    orderId: "#ORD-35912",
    messages: [
      {
        sender: "customer",
        message: "I received a blue laptop sleeve instead of the black one I ordered.",
        time: "May 12, 2023 2:30 PM",
      },
      {
        sender: "support",
        message:
          "I'm sorry about that, Emily. We'll send you the correct color right away and provide a return label for the wrong item.",
        time: "May 12, 2023 3:15 PM",
      },
      {
        sender: "customer",
        message: "Thank you for the quick response!",
        time: "May 12, 2023 3:30 PM",
      },
      {
        sender: "support",
        message: "You're welcome! The replacement has been shipped and you should receive it within 2-3 business days.",
        time: "May 12, 2023 4:00 PM",
      },
    ],
  },
  {
    id: "TKT-9012",
    subject: "Order cancellation",
    status: "Closed",
    priority: "Low",
    lastUpdate: "May 10, 2023",
    customer: {
      name: "David Miller",
      email: "david.miller@example.com",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    orderId: "#ORD-23719",
    messages: [
      {
        sender: "customer",
        message: "I'd like to cancel my order please.",
        time: "May 10, 2023 9:30 AM",
      },
      {
        sender: "support",
        message:
          "Hi David, I've processed your cancellation request. Your refund should appear on your card within 3-5 business days.",
        time: "May 10, 2023 10:15 AM",
      },
      {
        sender: "customer",
        message: "Thank you!",
        time: "May 10, 2023 10:30 AM",
      },
    ],
  },
  {
    id: "TKT-3456",
    subject: "Product information request",
    status: "Open",
    priority: "Low",
    lastUpdate: "May 16, 2023",
    customer: {
      name: "Sarah Williams",
      email: "sarah.williams@example.com",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    orderId: "#ORD-58972",
    messages: [
      {
        sender: "customer",
        message: "Does the smart watch have a heart rate monitor?",
        time: "May 16, 2023 3:45 PM",
      },
    ],
  },
  {
    id: "TKT-7890",
    subject: "Payment issue",
    status: "Pending",
    priority: "High",
    lastUpdate: "May 14, 2023",
    customer: {
      name: "Michael Brown",
      email: "michael.brown@example.com",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    orderId: "#ORD-41243",
    messages: [
      {
        sender: "customer",
        message: "I was charged twice for my order. Can you help resolve this?",
        time: "May 14, 2023 1:20 PM",
      },
      {
        sender: "support",
        message:
          "I apologize for the inconvenience, Michael. I can see the duplicate charge in our system. I've initiated a refund for the extra charge, which should be processed within 3-5 business days.",
        time: "May 14, 2023 2:05 PM",
      },
      {
        sender: "customer",
        message: "Thank you for the quick resolution.",
        time: "May 14, 2023 2:30 PM",
      },
    ],
  },
]

const CustomerSupportPage = () => {
  const [selectedTab, setSelectedTab] = useState("all")
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [dateFilter, setDateFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [replyText, setReplyText] = useState("")

  // Filter tickets based on selected tab, search query, and filters
  const filteredTickets = () => {
    let filtered = [...supportTickets]

    // Filter by tab
    if (selectedTab !== "all") {
      filtered = filtered.filter((ticket) => ticket.status.toLowerCase() === selectedTab.toLowerCase())
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (ticket) =>
          ticket.id.toLowerCase().includes(query) ||
          ticket.subject.toLowerCase().includes(query) ||
          ticket.customer.name.toLowerCase().includes(query) ||
          ticket.customer.email.toLowerCase().includes(query),
      )
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((ticket) => ticket.status.toLowerCase() === statusFilter.toLowerCase())
    }

    // Filter by priority
    if (priorityFilter !== "all") {
      filtered = filtered.filter((ticket) => ticket.priority.toLowerCase() === priorityFilter.toLowerCase())
    }

    // Filter by date
    if (dateFilter !== "all") {
      const today = new Date()
      const sevenDaysAgo = new Date(today)
      sevenDaysAgo.setDate(today.getDate() - 7)
      const thirtyDaysAgo = new Date(today)
      thirtyDaysAgo.setDate(today.getDate() - 30)

      filtered = filtered.filter((ticket) => {
        const ticketDate = new Date(ticket.lastUpdate)
        if (dateFilter === "today") {
          return (
            ticketDate.getDate() === today.getDate() &&
            ticketDate.getMonth() === today.getMonth() &&
            ticketDate.getFullYear() === today.getFullYear()
          )
        } else if (dateFilter === "last7days") {
          return ticketDate >= sevenDaysAgo
        } else if (dateFilter === "last30days") {
          return ticketDate >= thirtyDaysAgo
        }
        return true
      })
    }

    return filtered
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "Open":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <MessageSquare className="h-3 w-3 mr-1" />
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
      case "Closed":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <CheckCircle className="h-3 w-3 mr-1" />
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

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "High":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <AlertTriangle className="h-3 w-3 mr-1" />
            {priority}
          </span>
        )
      case "Medium":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
            {priority}
          </span>
        )
      case "Low":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {priority}
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {priority}
          </span>
        )
    }
  }

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
  }

  // Handle reply submission
  const handleReplySubmit = () => {
    if (!replyText.trim() || !selectedTicket) return

    // In a real application, this would make an API call to add the reply
    console.log(`Replying to ticket ${selectedTicket.id}: ${replyText}`)
    
    // For demo purposes, we'll just update the local state
    const updatedTicket = {
      ...selectedTicket,
      messages: [
        ...selectedTicket.messages,
        {
          sender: "support",
          message: replyText,
          time: new Date().toLocaleString(),
        },
      ],
    }
    
    setSelectedTicket(updatedTicket)
    setReplyText("")
  }

  // Update ticket status
  const updateTicketStatus = (ticketId, newStatus) => {
    // In a real application, this would make an API call to update the ticket status
    console.log(`Updating ticket ${ticketId} to status: ${newStatus}`)
    
    // For demo purposes, we'll just update the selected ticket if it's open
    if (selectedTicket && selectedTicket.id === ticketId) {
      setSelectedTicket({
        ...selectedTicket,
        status: newStatus,
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Customer Support</h1>
        <div className="flex space-x-2">
          <button className="border border-gray-300 bg-white text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
            Export Tickets
          </button>
          <button className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-purple-700 hover:to-indigo-700 transition-colors">
            Create Ticket
          </button>
        </div>
      </div>

      {selectedTicket ? (
        // Ticket Detail View
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat Section */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <div className="flex items-center">
                <button onClick={() => setSelectedTicket(null)} className="mr-4 text-gray-500 hover:text-gray-700">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                </button>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {selectedTicket.subject} <span className="text-gray-500">({selectedTicket.id})</span>
                  </h2>
                  <p className="text-sm text-gray-500">
                    Order: {selectedTicket.orderId} • Last updated: {selectedTicket.lastUpdate}
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                {getStatusBadge(selectedTicket.status)}
                {getPriorityBadge(selectedTicket.priority)}
              </div>
            </div>

            {/* Chat Messages */}
            <div className="p-6 h-[calc(100vh-400px)] overflow-y-auto bg-gray-50">
              <div className="space-y-6">
                {selectedTicket.messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.sender === "customer" ? "justify-start" : "justify-end"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-4 ${
                        message.sender === "customer"
                          ? "bg-white border border-gray-200"
                          : "bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
                      }`}
                    >
                      <div className="flex items-center mb-2">
                        <span
                          className={`text-xs font-medium ${
                            message.sender === "customer" ? "text-gray-700" : "text-purple-100"
                          }`}
                        >
                          {message.sender === "customer" ? selectedTicket.customer.name : "Support Agent"}
                        </span>
                        <span
                          className={`text-xs ${
                            message.sender === "customer" ? "text-gray-400" : "text-purple-200"
                          } ml-2`}
                        >
                          {message.time}
                        </span>
                      </div>
                      <p className={`text-sm ${message.sender === "customer" ? "text-gray-800" : "text-white"}`}>
                        {message.message}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reply Box */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex items-end">
                <div className="flex-1">
                  <textarea
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    rows="3"
                    placeholder="Type your reply..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                  ></textarea>
                </div>
                <div className="ml-3 flex flex-col space-y-2">
                  <button className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
                    <Paperclip className="h-5 w-5" />
                  </button>
                  <button
                    onClick={handleReplySubmit}
                    className="p-2 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 transition-colors"
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <div className="mt-2 flex justify-between items-center">
                <div className="flex space-x-2">
                  <button className="text-sm text-gray-500 hover:text-gray-700 flex items-center">
                    <Phone className="h-4 w-4 mr-1" />
                    Call Customer
                  </button>
                  <button className="text-sm text-gray-500 hover:text-gray-700 flex items-center">
                    <Video className="h-4 w-4 mr-1" />
                    Video Chat
                  </button>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => updateTicketStatus(selectedTicket.id, "Closed")}
                    className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-md hover:bg-gray-200 transition-colors"
                  >
                    Close Ticket
                  </button>
                  <button
                    onClick={() => updateTicketStatus(selectedTicket.id, "Pending")}
                    className="text-sm bg-yellow-100 text-yellow-700 px-3 py-1 rounded-md hover:bg-yellow-200 transition-colors"
                  >
                    Mark as Pending
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Customer Information</h3>
              </div>
              <div className="p-4">
                <div className="flex items-center mb-4">
                  <img
                    src={selectedTicket.customer.avatar || "/placeholder.svg"}
                    alt={selectedTicket.customer.name}
                    className="h-12 w-12 rounded-full mr-4"
                  />
                  <div>
                    <h4 className="text-base font-medium text-gray-900">{selectedTicket.customer.name}</h4>
                    <div className="flex items-center text-sm text-gray-500">
                      <Mail className="h-4 w-4 mr-1" />
                      {selectedTicket.customer.email}
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Customer Since</span>
                    <span className="text-sm font-medium text-gray-900">Jan 15, 2023</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Total Orders</span>
                    <span className="text-sm font-medium text-gray-900">12</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Total Spent</span>
                    <span className="text-sm font-medium text-gray-900">$1,245.89</span>
                  </div>
                </div>
                <div className="mt-4 flex justify-center">
                  <button className="text-sm text-purple-600 hover:text-purple-800 font-medium">
                    View Customer Profile
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Order Details</h3>
              </div>
              <div className="p-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Order ID</span>
                    <span className="text-sm font-medium text-gray-900">{selectedTicket.orderId}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Order Date</span>
                    <span className="text-sm font-medium text-gray-900">May 10, 2023</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Order Status</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Processing
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Total Amount</span>
                    <span className="text-sm font-medium text-gray-900">$149.99</span>
                  </div>
                </div>
                <div className="mt-4 flex justify-center">
                  <button className="text-sm text-purple-600 hover:text-purple-800 font-medium">View Order Details</button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Previous Tickets</h3>
              </div>
              <div className="p-4">
                <div className="space-y-3">
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-900">Product question</span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        Closed
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">April 28, 2023</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-900">Shipping delay</span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        Closed
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">March 15, 2023</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Tickets List View
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
                  All Tickets
                  <span className="ml-2 bg-gray-100 text-gray-700 py-0.5 px-2 rounded-full text-xs">
                    {supportTickets.length}
                  </span>
                </button>
                <button
                  onClick={() => setSelectedTab("open")}
                  className={`py-4 px-6 text-sm font-medium whitespace-nowrap ${
                    selectedTab === "open"
                      ? "border-b-2 border-purple-600 text-purple-600"
                      : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Open
                  <span className="ml-2 bg-green-100 text-green-800 py-0.5 px-2 rounded-full text-xs">
                    {supportTickets.filter((t) => t.status === "Open").length}
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
                    {supportTickets.filter((t) => t.status === "Pending").length}
                  </span>
                </button>
                <button
                  onClick={() => setSelectedTab("closed")}
                  className={`py-4 px-6 text-sm font-medium whitespace-nowrap ${
                    selectedTab === "closed"
                      ? "border-b-2 border-purple-600 text-purple-600"
                      : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Closed
                  <span className="ml-2 bg-gray-100 text-gray-800 py-0.5 px-2 rounded-full text-xs">
                    {supportTickets.filter((t) => t.status === "Closed").length}
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
                    placeholder="Search tickets by ID, subject, or customer..."
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
                          setDateFilter("all")
                          document.getElementById("dateFilterDropdown").classList.add("hidden")
                        }}
                      >
                        All Time
                      </button>
                      <button
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => {
                          setDateFilter("today")
                          document.getElementById("dateFilterDropdown").classList.add("hidden")
                        }}
                      >
                        Today
                      </button>
                      <button
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => {
                          setDateFilter("last7days")
                          document.getElementById("dateFilterDropdown").classList.add("hidden")
                        }}
                      >
                        Last 7 Days
                      </button>
                      <button
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => {
                          setDateFilter("last30days")
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
                        const dropdown = document.getElementById("priorityFilterDropdown")
                        dropdown.classList.toggle("hidden")
                      }}
                    >
                      <Filter className="h-4 w-4 mr-2" />
                      <span>
                        {priorityFilter === "all"
                          ? "All Priorities"
                          : priorityFilter.charAt(0).toUpperCase() + priorityFilter.slice(1)}
                      </span>
                      <ChevronDown className="h-4 w-4 ml-2" />
                    </button>
                    <div
                      id="priorityFilterDropdown"
                      className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-10 border border-gray-200 hidden"
                    >
                      <button
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => {
                          setPriorityFilter("all")
                          document.getElementById("priorityFilterDropdown").classList.add("hidden")
                        }}
                      >
                        All Priorities
                      </button>
                      <button
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => {
                          setPriorityFilter("high")
                          document.getElementById("priorityFilterDropdown").classList.add("hidden")
                        }}
                      >
                        High
                      </button>
                      <button
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => {
                          setPriorityFilter("medium")
                          document.getElementById("priorityFilterDropdown").classList.add("hidden")
                        }}
                      >
                        Medium
                      </button>
                      <button
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => {
                          setPriorityFilter("low")
                          document.getElementById("priorityFilterDropdown").classList.add("hidden")
                        }}
                      >
                        Low
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
                      {Array.from(new Set(supportTickets.map((ticket) => ticket.customer.name))).map((name, index) => (
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

            {/* Tickets Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center">
                        Ticket
                        <ArrowUpDown className="h-4 w-4 ml-1" />
                      </div>
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center">
                        Customer
                        <ArrowUpDown className="h-4 w-4 ml-1" />
                      </div>
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center">
                        Last Update
                        <ArrowUpDown className="h-4 w-4 ml-1" />
                      </div>
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Priority
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTickets().map((ticket) => (
                    <tr key={ticket.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{ticket.id}</div>
                        <div className="text-sm text-gray-500">{ticket.subject}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img
                            src={ticket.customer.avatar || "/placeholder.svg"}
                            alt={ticket.customer.name}
                            className="h-8 w-8 rounded-full"
                          />
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">{ticket.customer.name}</div>
                            <div className="text-sm text-gray-500">{ticket.customer.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{ticket.lastUpdate}</div>
                        <div className="text-sm text-gray-500">Order: {ticket.orderId}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(ticket.status)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{getPriorityBadge(ticket.priority)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => setSelectedTicket(ticket)}
                          className="text-purple-600 hover:text-purple-900 mr-3"
                        >
                          View
                        </button>
                        <button className="text-gray-600 hover:text-gray-900">
                          <MoreHorizontal className="h-5 w-5 inline" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
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
                    <span className="font-medium">{filteredTickets().length}</span> of{" "}
                    <span className="font-medium">{filteredTickets().length}</span> results
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

export default CustomerSupportPage
