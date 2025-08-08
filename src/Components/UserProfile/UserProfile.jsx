"use client"

import { useState } from "react"
import {
  User,
  Package,
  CreditCard,
  Heart,
  Settings,
  Bell,
  LogOut,
  Edit,
  Camera,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Shield,
  ChevronRight,
  CheckCircle,
  Clock,
  Truck,
  AlertCircle,
  Download,
  Eye,
} from "lucide-react"

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState("overview")

  // Mock user data
  const user = {
    id: "USR12345",
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    phone: "+1 (555) 123-4567",
    address: "123 Tech Street, San Francisco, CA 94107",
    joinDate: "January 2023",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    membershipLevel: "Premium",
    paymentMethods: [
      {
        id: "pm_1",
        type: "Visa",
        last4: "4242",
        expiry: "04/25",
        isDefault: true,
      },
      {
        id: "pm_2",
        type: "Mastercard",
        last4: "5555",
        expiry: "08/26",
        isDefault: false,
      },
    ],
    orders: [
      {
        id: "ORD-9876",
        date: "May 10, 2023",
        total: 1299.99,
        status: "Delivered",
        items: [
          {
            id: 1,
            name: "Dell XPS 15",
            price: 1299.99,
            quantity: 1,
            image:
              "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
          },
        ],
      },
      {
        id: "ORD-8765",
        date: "April 22, 2023",
        total: 249.99,
        status: "Delivered",
        items: [
          {
            id: 7,
            name: "AirPods Pro",
            price: 249.99,
            quantity: 1,
            image:
              "https://images.unsplash.com/photo-1606741965429-8d76ff50bb2e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80",
          },
        ],
      },
      {
        id: "ORD-7654",
        date: "March 15, 2023",
        total: 1149.98,
        status: "Processing",
        items: [
          {
            id: 4,
            name: "iPhone 15",
            price: 899.99,
            quantity: 1,
            image:
              "https://images.unsplash.com/photo-1695048133142-1a20484bce71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
          },
          {
            id: 14,
            name: "USB-C Hub",
            price: 49.99,
            quantity: 1,
            image:
              "https://images.unsplash.com/photo-1659921857480-af9c7a4a4c1a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
          },
          {
            id: 15,
            name: "Wireless Charger",
            price: 39.99,
            quantity: 5,
            image:
              "https://images.unsplash.com/photo-1622445275576-721325763afe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80",
          },
        ],
      },
    ],
    wishlist: [
      {
        id: 11,
        name: "iPad Pro",
        price: 799.99,
        image:
          "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1469&q=80",
      },
      {
        id: 9,
        name: "Apple Watch Series 9",
        price: 399.99,
        image:
          "https://images.unsplash.com/photo-1617043786394-f977fa12eddf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      },
    ],
    notifications: [
      {
        id: "notif_1",
        title: "Order Shipped",
        message: "Your order #ORD-7654 has been shipped and is on its way.",
        date: "2 days ago",
        read: false,
      },
      {
        id: "notif_2",
        title: "Price Drop Alert",
        message: "iPad Pro is now on sale! Check it out before the offer ends.",
        date: "5 days ago",
        read: true,
      },
    ],
  }

  // Status badge component
  const StatusBadge = ({ status }) => {
    let bgColor = "bg-gray-100 text-gray-700"
    let icon = Clock

    if (status === "Delivered") {
      bgColor = "bg-green-100 text-green-700"
      icon = CheckCircle
    } else if (status === "Processing") {
      bgColor = "bg-blue-100 text-blue-700"
      icon = Truck
    } else if (status === "Cancelled") {
      bgColor = "bg-red-100 text-red-700"
      icon = AlertCircle
    }

    return (
      <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${bgColor}`}>
        <icon className="h-3 w-3 mr-1" />
        {status}
      </div>
    )
  }

  // Navigation items
  const navItems = [
    { id: "overview", label: "Overview", icon: User },
    { id: "orders", label: "Orders", icon: Package },
    { id: "payment", label: "Payment Methods", icon: CreditCard },
    { id: "wishlist", label: "Wishlist", icon: Heart },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "settings", label: "Settings", icon: Settings },
  ]

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-2xl shadow-md overflow-hidden">
              {/* User Info */}
              <div className="relative">
                {/* Cover Photo */}
                <div className="h-32 bg-gradient-to-r from-purple-600 to-indigo-600"></div>

                {/* Avatar */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
                  <div className="relative">
                    <div className="h-24 w-24 rounded-full border-4 border-white overflow-hidden bg-white">
                      <img
                        src={user.avatar || "/placeholder.svg"}
                        alt={user.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <button
                      className="absolute bottom-0 right-0 bg-gray-100 p-1.5 rounded-full hover:bg-gray-200 transition-colors"
                      aria-label="Change profile picture"
                    >
                      <Camera className="h-4 w-4 text-gray-700" />
                    </button>
                  </div>
                </div>
              </div>

              {/* User Details */}
              <div className="pt-16 pb-6 px-6 text-center">
                <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
                <p className="text-gray-500 text-sm">{user.email}</p>
                <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                  {user.membershipLevel} Member
                </div>
              </div>

              {/* Navigation */}
              <div className="border-t border-gray-100">
                <nav className="py-4">
                  {navItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center gap-3 px-6 py-3 transition-colors ${
                        activeTab === item.id
                          ? "bg-purple-50 text-purple-700 border-r-4 border-purple-600"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <item.icon className="h-5 w-5" />
                      <span className="font-medium">{item.label}</span>
                      {item.id === "notifications" && user.notifications.some((n) => !n.read) && (
                        <span className="ml-auto bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                          {user.notifications.filter((n) => !n.read).length}
                        </span>
                      )}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Logout */}
              <div className="px-6 py-4 border-t border-gray-100">
                <button className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                  <LogOut className="h-5 w-5" />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            <div className="bg-white rounded-2xl shadow-md p-6">
              {/* Overview Tab */}
              {activeTab === "overview" && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Account Overview</h2>

                  {/* Personal Information */}
                  <div className="mb-8">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
                      <button className="flex items-center gap-1 text-purple-600 hover:text-purple-700 text-sm font-medium">
                        <Edit className="h-4 w-4" />
                        Edit
                      </button>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex gap-3">
                          <User className="h-5 w-5 text-gray-500" />
                          <div>
                            <p className="text-sm text-gray-500">Full Name</p>
                            <p className="font-medium text-gray-900">{user.name}</p>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <Mail className="h-5 w-5 text-gray-500" />
                          <div>
                            <p className="text-sm text-gray-500">Email Address</p>
                            <p className="font-medium text-gray-900">{user.email}</p>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <Phone className="h-5 w-5 text-gray-500" />
                          <div>
                            <p className="text-sm text-gray-500">Phone Number</p>
                            <p className="font-medium text-gray-900">{user.phone}</p>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <Calendar className="h-5 w-5 text-gray-500" />
                          <div>
                            <p className="text-sm text-gray-500">Member Since</p>
                            <p className="font-medium text-gray-900">{user.joinDate}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div className="mb-8">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium text-gray-900">Shipping Address</h3>
                      <button className="flex items-center gap-1 text-purple-600 hover:text-purple-700 text-sm font-medium">
                        <Edit className="h-4 w-4" />
                        Edit
                      </button>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-6 flex gap-3">
                      <MapPin className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-gray-600">{user.address}</p>
                      </div>
                    </div>
                  </div>

                  {/* Recent Orders */}
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium text-gray-900">Recent Orders</h3>
                      <button
                        onClick={() => setActiveTab("orders")}
                        className="flex items-center gap-1 text-purple-600 hover:text-purple-700 text-sm font-medium"
                      >
                        View All
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="overflow-hidden rounded-xl border border-gray-200">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Order ID
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Date
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Total
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Status
                            </th>
                            <th scope="col" className="relative px-6 py-3">
                              <span className="sr-only">Actions</span>
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {user.orders.slice(0, 3).map((order) => (
                            <tr key={order.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {order.id}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.date}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                ${order.total.toFixed(2)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <StatusBadge status={order.status} />
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button className="text-purple-600 hover:text-purple-900">Details</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Orders Tab */}
              {activeTab === "orders" && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Orders</h2>

                  {user.orders.length > 0 ? (
                    <div className="space-y-6">
                      {user.orders.map((order) => (
                        <div key={order.id} className="border border-gray-200 rounded-xl overflow-hidden">
                          {/* Order Header */}
                          <div className="bg-gray-50 px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                              <div className="flex items-center gap-3">
                                <h3 className="font-medium text-gray-900">Order {order.id}</h3>
                                <StatusBadge status={order.status} />
                              </div>
                              <p className="text-sm text-gray-500">Placed on {order.date}</p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                                <Eye className="h-4 w-4 mr-1.5" />
                                Track Order
                              </button>
                              <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                                <Download className="h-4 w-4 mr-1.5" />
                                Invoice
                              </button>
                            </div>
                          </div>

                          {/* Order Items */}
                          <div className="p-6">
                            {order.items.map((item) => (
                              <div
                                key={item.id}
                                className="flex flex-col sm:flex-row items-start sm:items-center gap-4 py-4 border-b border-gray-100 last:border-0"
                              >
                                <div className="h-16 w-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                                  <img
                                    src={item.image || "/placeholder.svg"}
                                    alt={item.name}
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-medium text-gray-900">{item.name}</h4>
                                  <p className="text-sm text-gray-500">
                                    Qty: {item.quantity} × ${item.price.toFixed(2)}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="font-medium text-gray-900">
                                    ${(item.quantity * item.price).toFixed(2)}
                                  </p>
                                  <button className="text-sm text-purple-600 hover:text-purple-700">Buy Again</button>
                                </div>
                              </div>
                            ))}

                            {/* Order Summary */}
                            <div className="mt-4 pt-4 border-t border-gray-100">
                              <div className="flex justify-between">
                                <span className="font-medium text-gray-900">Order Total</span>
                                <span className="font-bold text-gray-900">${order.total.toFixed(2)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-xl">
                      <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
                      <p className="text-gray-500 mb-4">When you place an order, it will appear here.</p>
                      <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700">
                        Start Shopping
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Payment Methods Tab */}
              {activeTab === "payment" && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Methods</h2>

                  <div className="space-y-6">
                    {/* Saved Payment Methods */}
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium text-gray-900">Saved Cards</h3>
                        <button className="flex items-center gap-1 text-purple-600 hover:text-purple-700 text-sm font-medium">
                          <span>Add New Card</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {user.paymentMethods.map((method) => (
                          <div
                            key={method.id}
                            className={`relative p-6 rounded-xl border ${
                              method.isDefault ? "border-purple-200 bg-purple-50" : "border-gray-200"
                            }`}
                          >
                            {method.isDefault && (
                              <div className="absolute top-3 right-3">
                                <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                                  Default
                                </div>
                              </div>
                            )}
                            <div className="flex items-start gap-4">
                              <div className="h-10 w-14 bg-gray-100 rounded flex items-center justify-center">
                                {method.type === "Visa" ? (
                                  <span className="text-blue-600 font-bold">VISA</span>
                                ) : (
                                  <span className="text-red-600 font-bold">MC</span>
                                )}
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">
                                  {method.type} ending in {method.last4}
                                </p>
                                <p className="text-sm text-gray-500">Expires {method.expiry}</p>
                                <div className="mt-3 flex gap-3">
                                  <button className="text-sm text-purple-600 hover:text-purple-700">Edit</button>
                                  {!method.isDefault && (
                                    <button className="text-sm text-purple-600 hover:text-purple-700">
                                      Set as Default
                                    </button>
                                  )}
                                  <button className="text-sm text-red-600 hover:text-red-700">Remove</button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Billing Address */}
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium text-gray-900">Billing Address</h3>
                        <button className="flex items-center gap-1 text-purple-600 hover:text-purple-700 text-sm font-medium">
                          <Edit className="h-4 w-4" />
                          Edit
                        </button>
                      </div>

                      <div className="bg-gray-50 rounded-xl p-6 flex gap-3">
                        <MapPin className="h-5 w-5 text-gray-500" />
                        <div>
                          <p className="font-medium text-gray-900">{user.name}</p>
                          <p className="text-gray-600">{user.address}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Wishlist Tab */}
              {activeTab === "wishlist" && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Wishlist</h2>

                  {user.wishlist.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {user.wishlist.map((item) => (
                        <div key={item.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                          <div className="h-48 bg-gray-100">
                            <img
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="p-4">
                            <h3 className="font-medium text-gray-900 mb-1">{item.name}</h3>
                            <p className="text-purple-600 font-medium mb-3">${item.price.toFixed(2)}</p>
                            <div className="flex gap-2">
                              <button className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg text-sm font-medium transition-colors">
                                Add to Cart
                              </button>
                              <button className="p-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors">
                                <Heart className="h-5 w-5 fill-red-500 text-red-500" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-xl">
                      <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Your wishlist is empty</h3>
                      <p className="text-gray-500 mb-4">Save items you're interested in for later.</p>
                      <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700">
                        Browse Products
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === "notifications" && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Notifications</h2>

                  {user.notifications.length > 0 ? (
                    <div className="space-y-4">
                      {user.notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-4 rounded-xl border ${
                            notification.read ? "border-gray-200" : "border-purple-200 bg-purple-50"
                          }`}
                        >
                          <div className="flex items-start gap-4">
                            <div className={`p-2 rounded-full ${notification.read ? "bg-gray-100" : "bg-purple-100"}`}>
                              <Bell className={`h-5 w-5 ${notification.read ? "text-gray-500" : "text-purple-600"}`} />
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <h3
                                  className={`font-medium ${notification.read ? "text-gray-900" : "text-purple-900"}`}
                                >
                                  {notification.title}
                                </h3>
                                <span className="text-xs text-gray-500">{notification.date}</span>
                              </div>
                              <p className="text-gray-600 mt-1">{notification.message}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-xl">
                      <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
                      <p className="text-gray-500">We'll notify you when there's activity on your account.</p>
                    </div>
                  )}

                  {/* Notification Preferences */}
                  <div className="mt-8">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Notification Preferences</h3>
                    <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">Order Updates</p>
                          <p className="text-sm text-gray-500">Receive notifications about your order status</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" value="" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                        </label>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">Promotions & Deals</p>
                          <p className="text-sm text-gray-500">Receive notifications about sales and special offers</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" value="" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                        </label>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">Account Activity</p>
                          <p className="text-sm text-gray-500">
                            Receive notifications about logins and account changes
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" value="" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === "settings" && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Account Settings</h2>

                  {/* Account Security */}
                  <div className="mb-8">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Account Security</h3>
                    <div className="bg-gray-50 rounded-xl p-6 space-y-6">
                      <div className="flex justify-between items-center">
                        <div className="flex gap-3">
                          <Shield className="h-5 w-5 text-gray-500" />
                          <div>
                            <p className="font-medium text-gray-900">Password</p>
                            <p className="text-sm text-gray-500">Last changed 3 months ago</p>
                          </div>
                        </div>
                        <button className="text-purple-600 hover:text-purple-700 font-medium">Change</button>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex gap-3">
                          <Shield className="h-5 w-5 text-gray-500" />
                          <div>
                            <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                            <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                          </div>
                        </div>
                        <button className="text-purple-600 hover:text-purple-700 font-medium">Enable</button>
                      </div>
                    </div>
                  </div>

                  {/* Privacy Settings */}
                  <div className="mb-8">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Privacy Settings</h3>
                    <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">Data Collection</p>
                          <p className="text-sm text-gray-500">
                            Allow us to collect usage data to improve your experience
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" value="" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                        </label>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">Marketing Emails</p>
                          <p className="text-sm text-gray-500">Receive emails about new products and offers</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" value="" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Account Management */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Account Management</h3>
                    <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                      <button className="w-full flex justify-between items-center py-2 text-left">
                        <span className="text-gray-900 font-medium">Download Your Data</span>
                        <Download className="h-5 w-5 text-gray-500" />
                      </button>
                      <div className="border-t border-gray-200 pt-4">
                        <button className="w-full flex justify-between items-center py-2 text-left text-red-600 hover:text-red-700">
                          <span className="font-medium">Delete Account</span>
                          <AlertCircle className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserProfile
