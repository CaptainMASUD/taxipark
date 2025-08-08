"use client"

import { useState } from "react"
import {
  Search,
  Filter,
  ChevronDown,
  MoreHorizontal,
  Edit,
  Trash,
  Mail,
  Phone,
  ArrowUpDown,
  CheckCircle,
  XCircle,
  Clock,
  UserPlus,
} from "lucide-react"

const UsersPage = () => {
  const [selectedTab, setSelectedTab] = useState("all")

  // Sample user data
  const users = [
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "+1 (555) 123-4567",
      role: "Admin",
      status: "Active",
      lastLogin: "2023-05-14 10:30 AM",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane.smith@example.com",
      phone: "+1 (555) 987-6543",
      role: "Manager",
      status: "Active",
      lastLogin: "2023-05-14 09:15 AM",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 3,
      name: "Robert Johnson",
      email: "robert.johnson@example.com",
      phone: "+1 (555) 456-7890",
      role: "Customer",
      status: "Active",
      lastLogin: "2023-05-13 03:45 PM",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 4,
      name: "Emily Davis",
      email: "emily.davis@example.com",
      phone: "+1 (555) 234-5678",
      role: "Customer",
      status: "Inactive",
      lastLogin: "2023-05-10 11:20 AM",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 5,
      name: "Michael Brown",
      email: "michael.brown@example.com",
      phone: "+1 (555) 876-5432",
      role: "Customer",
      status: "Active",
      lastLogin: "2023-05-14 08:05 AM",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 6,
      name: "Sarah Wilson",
      email: "sarah.wilson@example.com",
      phone: "+1 (555) 345-6789",
      role: "Manager",
      status: "Active",
      lastLogin: "2023-05-13 01:30 PM",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 7,
      name: "David Miller",
      email: "david.miller@example.com",
      phone: "+1 (555) 765-4321",
      role: "Customer",
      status: "Pending",
      lastLogin: "Never",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 8,
      name: "Jennifer Taylor",
      email: "jennifer.taylor@example.com",
      phone: "+1 (555) 432-1098",
      role: "Customer",
      status: "Blocked",
      lastLogin: "2023-05-01 09:45 AM",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ]

  const filteredUsers = () => {
    switch (selectedTab) {
      case "admin":
        return users.filter((user) => user.role === "Admin")
      case "manager":
        return users.filter((user) => user.role === "Manager")
      case "customer":
        return users.filter((user) => user.role === "Customer")
      case "active":
        return users.filter((user) => user.status === "Active")
      case "inactive":
        return users.filter(
          (user) => user.status === "Inactive" || user.status === "Blocked" || user.status === "Pending",
        )
      default:
        return users
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
      case "Inactive":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <XCircle className="h-3 w-3 mr-1" />
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
      case "Blocked":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
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
        <h1 className="text-2xl font-bold text-gray-900">Users</h1>
        <button className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-purple-700 hover:to-indigo-700 transition-colors flex items-center">
          <UserPlus className="h-4 w-4 mr-2" />
          Add New User
        </button>
      </div>

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
              All Users
              <span className="ml-2 bg-gray-100 text-gray-700 py-0.5 px-2 rounded-full text-xs">{users.length}</span>
            </button>
            <button
              onClick={() => setSelectedTab("admin")}
              className={`py-4 px-6 text-sm font-medium whitespace-nowrap ${
                selectedTab === "admin"
                  ? "border-b-2 border-purple-600 text-purple-600"
                  : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Admins
              <span className="ml-2 bg-purple-100 text-purple-800 py-0.5 px-2 rounded-full text-xs">
                {users.filter((u) => u.role === "Admin").length}
              </span>
            </button>
            <button
              onClick={() => setSelectedTab("manager")}
              className={`py-4 px-6 text-sm font-medium whitespace-nowrap ${
                selectedTab === "manager"
                  ? "border-b-2 border-purple-600 text-purple-600"
                  : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Managers
              <span className="ml-2 bg-blue-100 text-blue-800 py-0.5 px-2 rounded-full text-xs">
                {users.filter((u) => u.role === "Manager").length}
              </span>
            </button>
            <button
              onClick={() => setSelectedTab("customer")}
              className={`py-4 px-6 text-sm font-medium whitespace-nowrap ${
                selectedTab === "customer"
                  ? "border-b-2 border-purple-600 text-purple-600"
                  : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Customers
              <span className="ml-2 bg-green-100 text-green-800 py-0.5 px-2 rounded-full text-xs">
                {users.filter((u) => u.role === "Customer").length}
              </span>
            </button>
            <button
              onClick={() => setSelectedTab("active")}
              className={`py-4 px-6 text-sm font-medium whitespace-nowrap ${
                selectedTab === "active"
                  ? "border-b-2 border-purple-600 text-purple-600"
                  : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Active
              <span className="ml-2 bg-green-100 text-green-800 py-0.5 px-2 rounded-full text-xs">
                {users.filter((u) => u.status === "Active").length}
              </span>
            </button>
            <button
              onClick={() => setSelectedTab("inactive")}
              className={`py-4 px-6 text-sm font-medium whitespace-nowrap ${
                selectedTab === "inactive"
                  ? "border-b-2 border-purple-600 text-purple-600"
                  : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Inactive
              <span className="ml-2 bg-red-100 text-red-800 py-0.5 px-2 rounded-full text-xs">
                {users.filter((u) => u.status !== "Active").length}
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
                placeholder="Search users..."
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
                  <span>Role</span>
                  <ChevronDown className="h-4 w-4 ml-2" />
                </button>
              </div>
              <div className="relative">
                <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 transition-colors">
                  <span>Status</span>
                  <ChevronDown className="h-4 w-4 ml-2" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center">
                    User
                    <ArrowUpDown className="h-4 w-4 ml-1" />
                  </div>
                </th>
                <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center">
                    Contact
                    <ArrowUpDown className="h-4 w-4 ml-1" />
                  </div>
                </th>
                <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center">
                    Role
                    <ArrowUpDown className="h-4 w-4 ml-1" />
                  </div>
                </th>
                <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center">
                    Last Login
                    <ArrowUpDown className="h-4 w-4 ml-1" />
                  </div>
                </th>
                <th className="px-4 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers().map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={user.avatar || "/placeholder.svg"}
                        alt={user.name}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">ID: #{user.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 flex items-center">
                      <Mail className="h-4 w-4 mr-1 text-gray-400" />
                      {user.email}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center mt-1">
                      <Phone className="h-4 w-4 mr-1 text-gray-400" />
                      {user.phone}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.role === "Admin"
                          ? "bg-purple-100 text-purple-800"
                          : user.role === "Manager"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">{getStatusBadge(user.status)}</td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{user.lastLogin}</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button className="text-blue-500 hover:text-blue-700">
                        <Edit className="h-5 w-5" />
                      </button>
                      <button className="text-red-500 hover:text-red-700">
                        <Trash className="h-5 w-5" />
                      </button>
                      <div className="relative">
                        <button className="text-gray-500 hover:text-gray-700">
                          <MoreHorizontal className="h-5 w-5" />
                        </button>
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
                <span className="font-medium">{filteredUsers().length}</span> of{" "}
                <span className="font-medium">{filteredUsers().length}</span> results
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
    </div>
  )
}

export default UsersPage
