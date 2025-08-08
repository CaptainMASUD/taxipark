"use client"

import { useState } from "react"
import { Users, ShoppingBag, DollarSign, TrendingUp, ArrowUpRight, ArrowDownRight, Package, Clock, CheckCircle, XCircle, BarChart3, PieChart, LineChart, Activity, Star, ShoppingCart, Bell, Calendar, Zap, Truck, CreditCard, Percent } from 'lucide-react'

const Dashboard = () => {
  const [timeRange, setTimeRange] = useState("last7days")

  return (
    <div className="space-y-8">
      {/* Header with welcome message and quick actions */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="mb-4 md:mb-0">
            <h1 className="text-2xl font-bold text-white">Welcome back, Admin</h1>
            <p className="text-purple-100 mt-1">Here's what's happening with your store today.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button className="bg-white text-purple-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-50 transition-colors shadow-sm flex items-center">
              <Zap className="h-4 w-4 mr-1.5" />
              Quick Actions
            </button>
            <button className="bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-800 transition-colors shadow-sm flex items-center">
              <Bell className="h-4 w-4 mr-1.5" />
              Notifications
            </button>
          </div>
        </div>
      </div>

      {/* Time Range Selector */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Dashboard Overview</h2>
        <div className="flex items-center space-x-2">
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-1 flex">
            <button
              onClick={() => setTimeRange("today")}
              className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                timeRange === "today"
                  ? "bg-purple-600 text-white"
                  : "text-gray-600 hover:bg-gray-100 transition-colors"
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setTimeRange("last7days")}
              className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                timeRange === "last7days"
                  ? "bg-purple-600 text-white"
                  : "text-gray-600 hover:bg-gray-100 transition-colors"
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setTimeRange("last30days")}
              className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                timeRange === "last30days"
                  ? "bg-purple-600 text-white"
                  : "text-gray-600 hover:bg-gray-100 transition-colors"
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setTimeRange("thisyear")}
              className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                timeRange === "thisyear"
                  ? "bg-purple-600 text-white"
                  : "text-gray-600 hover:bg-gray-100 transition-colors"
              }`}
            >
              Year
            </button>
          </div>
          <button className="bg-white border border-gray-200 text-gray-700 p-2 rounded-lg shadow-sm hover:bg-gray-50 transition-colors">
            <Calendar className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value="$24,780"
          change="+12.5%"
          isPositive={true}
          icon={<DollarSign className="h-5 w-5 text-white" />}
          color="bg-gradient-to-br from-green-400 to-green-600"
          details="vs. previous period"
        />
        <StatCard
          title="Total Orders"
          value="1,482"
          change="+8.2%"
          isPositive={true}
          icon={<ShoppingBag className="h-5 w-5 text-white" />}
          color="bg-gradient-to-br from-blue-400 to-blue-600"
          details="vs. previous period"
        />
        <StatCard
          title="New Customers"
          value="382"
          change="+32.7%"
          isPositive={true}
          icon={<Users className="h-5 w-5 text-white" />}
          color="bg-gradient-to-br from-purple-400 to-purple-600"
          details="vs. previous period"
        />
        <StatCard
          title="Conversion Rate"
          value="3.6%"
          change="-0.5%"
          isPositive={false}
          icon={<TrendingUp className="h-5 w-5 text-white" />}
          color="bg-gradient-to-br from-orange-400 to-orange-600"
          details="vs. previous period"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Overview */}
        <div className="bg-white rounded-xl shadow-sm p-6 lg:col-span-2 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Sales Overview</h2>
              <p className="text-sm text-gray-500">Monthly revenue and order statistics</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                <div className="w-2 h-2 rounded-full bg-purple-500 mr-1"></div>
                Revenue
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                <div className="w-2 h-2 rounded-full bg-blue-500 mr-1"></div>
                Orders
              </span>
            </div>
          </div>
          <div className="h-80 w-full">
            {/* Chart would go here - using placeholder */}
            <div className="relative h-full w-full bg-gradient-to-b from-gray-50 to-white rounded-lg flex items-center justify-center overflow-hidden">
              {/* Simulated chart */}
              <div className="absolute inset-0 flex items-end justify-around px-4 pb-6">
                {[35, 45, 30, 60, 75, 65, 55, 70, 85, 60, 55, 65].map((height, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div
                      className="w-6 bg-gradient-to-t from-purple-600 to-indigo-600 rounded-t-sm"
                      style={{ height: `${height}%` }}
                    ></div>
                    <div className="text-xs text-gray-500 mt-1">{`M${index + 1}`}</div>
                  </div>
                ))}
              </div>
              <div className="absolute top-1/2 left-0 right-0 border-b border-dashed border-gray-300"></div>
              <div className="absolute top-1/4 left-0 right-0 border-b border-dashed border-gray-300"></div>
              <div className="absolute top-3/4 left-0 right-0 border-b border-dashed border-gray-300"></div>
              
              {/* Line chart overlay */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path
                  d="M0,70 Q10,65 20,60 T40,50 T60,45 T80,30 T100,35"
                  fill="none"
                  stroke="#4f46e5"
                  strokeWidth="0.5"
                  vectorEffect="non-scaling-stroke"
                ></path>
                <path
                  d="M0,70 Q10,65 20,60 T40,50 T60,45 T80,30 T100,35"
                  fill="url(#gradient)"
                  fillOpacity="0.2"
                  stroke="none"
                  vectorEffect="non-scaling-stroke"
                ></path>
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#4f46e5" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Top Products</h2>
              <p className="text-sm text-gray-500">Best selling items</p>
            </div>
            <button className="text-sm text-purple-600 hover:text-purple-800 font-medium">View All</button>
          </div>
          <div className="space-y-5">
            {[
              { name: "Wireless Earbuds", sales: 1245, percent: 25, color: "bg-purple-600" },
              { name: "Smart Watch", sales: 986, percent: 20, color: "bg-blue-600" },
              { name: "Bluetooth Speaker", sales: 765, percent: 15, color: "bg-green-600" },
              { name: "Laptop Sleeve", sales: 612, percent: 12, color: "bg-yellow-600" },
              { name: "Phone Case", sales: 542, percent: 10, color: "bg-red-600" },
            ].map((product, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center mr-3">
                    <Package className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-800">{product.name}</div>
                    <div className="text-sm text-gray-500">{product.sales} sales</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-gray-800">{product.percent}%</div>
                  <div className="w-16 h-1.5 bg-gray-200 rounded-full mt-1">
                    <div
                      className={`h-1.5 ${product.color} rounded-full`}
                      style={{ width: `${product.percent}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Average Order Value"
          value="$86.42"
          change="+5.2%"
          isPositive={true}
          icon={<ShoppingCart className="h-5 w-5 text-purple-600" />}
        />
        <MetricCard
          title="Customer Satisfaction"
          value="4.8/5"
          change="+0.3"
          isPositive={true}
          icon={<Star className="h-5 w-5 text-yellow-500" />}
        />
        <MetricCard
          title="Refund Rate"
          value="2.1%"
          change="-0.8%"
          isPositive={true}
          icon={<CreditCard className="h-5 w-5 text-red-500" />}
        />
        <MetricCard
          title="Shipping Performance"
          value="98.3%"
          change="+1.2%"
          isPositive={true}
          icon={<Truck className="h-5 w-5 text-green-500" />}
        />
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
            <button className="text-sm text-purple-600 hover:text-purple-800 font-medium">View All</button>
          </div>
          <p className="text-sm text-gray-500">Latest transactions from your store</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {[
                {
                  id: "#ORD-71267",
                  customer: "Alex Johnson",
                  avatar: "/placeholder.svg?height=32&width=32",
                  product: "Wireless Earbuds",
                  date: "May 14, 2023",
                  amount: "$129.99",
                  status: "Completed",
                },
                {
                  id: "#ORD-58972",
                  customer: "Sarah Williams",
                  avatar: "/placeholder.svg?height=32&width=32",
                  product: "Smart Watch",
                  date: "May 13, 2023",
                  amount: "$199.99",
                  status: "Processing",
                },
                {
                  id: "#ORD-41243",
                  customer: "Michael Brown",
                  avatar: "/placeholder.svg?height=32&width=32",
                  product: "Bluetooth Speaker",
                  date: "May 12, 2023",
                  amount: "$89.99",
                  status: "Completed",
                },
                {
                  id: "#ORD-35912",
                  customer: "Emily Davis",
                  avatar: "/placeholder.svg?height=32&width=32",
                  product: "Laptop Sleeve",
                  date: "May 11, 2023",
                  amount: "$29.99",
                  status: "Cancelled",
                },
                {
                  id: "#ORD-23719",
                  customer: "David Miller",
                  avatar: "/placeholder.svg?height=32&width=32",
                  product: "Phone Case",
                  date: "May 10, 2023",
                  amount: "$19.99",
                  status: "Completed",
                },
              ].map((order, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img className="h-8 w-8 rounded-full mr-3" src={order.avatar || "/placeholder.svg"} alt={order.customer} />
                      <div className="text-sm text-gray-900">{order.customer}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{order.product}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{order.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.amount}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        order.status === "Completed"
                          ? "bg-green-100 text-green-800"
                          : order.status === "Processing"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {order.status === "Completed" && <CheckCircle className="h-3 w-3 mr-1" />}
                      {order.status === "Processing" && <Clock className="h-3 w-3 mr-1" />}
                      {order.status === "Cancelled" && <XCircle className="h-3 w-3 mr-1" />}
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-purple-600 hover:text-purple-900 mr-3">View</button>
                    <button className="text-gray-600 hover:text-gray-900">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 text-right">
          <button className="text-sm text-purple-600 hover:text-purple-800 font-medium">Load More</button>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AnalyticsCard
          title="Sales by Category"
          icon={<PieChart className="h-5 w-5 text-purple-600" />}
          chart={
            <div className="relative h-48 w-48 mx-auto">
              {/* Simulated pie chart */}
              <div className="absolute inset-0 rounded-full border-8 border-purple-500" style={{ clipPath: 'polygon(50% 50%, 0 0, 0 50%, 0 100%, 50% 100%, 100% 100%, 100% 50%, 100% 0, 50% 0)' }}></div>
              <div className="absolute inset-0 rounded-full border-8 border-blue-500" style={{ clipPath: 'polygon(50% 50%, 0 0, 0 50%, 0 100%, 50% 100%)' }}></div>
              <div className="absolute inset-0 rounded-full border-8 border-green-500" style={{ clipPath: 'polygon(50% 50%, 50% 0, 100% 0, 100% 50%)' }}></div>
              <div className="absolute inset-0 rounded-full border-8 border-yellow-500" style={{ clipPath: 'polygon(50% 50%, 100% 50%, 100% 100%, 50% 100%)' }}></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-32 w-32 rounded-full bg-white"></div>
              </div>
            </div>
          }
          data={[
            { label: "Electronics", value: "42%" },
            { label: "Clothing", value: "28%" },
            { label: "Home Goods", value: "18%" },
            { label: "Other", value: "12%" },
          ]}
        />
        <AnalyticsCard
          title="Traffic Sources"
          icon={<BarChart3 className="h-5 w-5 text-blue-600" />}
          chart={
            <div className="h-48 w-full flex items-end justify-around px-2">
              {[65, 40, 85, 30, 55].map((height, index) => (
                <div key={index} className="w-12 flex flex-col items-center">
                  <div
                    className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-md"
                    style={{ height: `${height}%` }}
                  ></div>
                </div>
              ))}
            </div>
          }
          data={[
            { label: "Direct", value: "35%" },
            { label: "Social", value: "25%" },
            { label: "Organic", value: "22%" },
            { label: "Referral", value: "18%" },
          ]}
        />
        <AnalyticsCard
          title="Customer Growth"
          icon={<LineChart className="h-5 w-5 text-green-600" />}
          chart={
            <div className="relative h-48 w-full">
              {/* Simulated line chart */}
              <div className="absolute inset-x-0 bottom-0 h-px bg-gray-200"></div>
              <div className="absolute inset-y-0 left-0 w-px bg-gray-200"></div>
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path
                  d="M0,80 Q20,70 30,60 T50,50 T70,30 T100,20"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2"
                  vectorEffect="non-scaling-stroke"
                ></path>
                <path
                  d="M0,80 Q20,70 30,60 T50,50 T70,30 T100,20"
                  fill="url(#greenGradient)"
                  fillOpacity="0.2"
                  stroke="none"
                  vectorEffect="non-scaling-stroke"
                ></path>
                <defs>
                  <linearGradient id="greenGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          }
          data={[
            { label: "New Users", value: "+382" },
            { label: "Growth Rate", value: "+32.7%" },
            { label: "Retention", value: "76%" },
            { label: "Churn", value: "3.2%" },
          ]}
        />
      </div>

      {/* Promotional Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">Boost Your Sales</h3>
              <p className="text-purple-100 mb-4">Create a promotional campaign to increase your revenue</p>
              <button className="bg-white text-purple-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-50 transition-colors shadow-sm">
                Create Campaign
              </button>
            </div>
            <div className="h-16 w-16 bg-purple-400 bg-opacity-30 rounded-full flex items-center justify-center">
              <Percent className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">Optimize Inventory</h3>
              <p className="text-blue-100 mb-4">Check your inventory levels and restock popular products</p>
              <button className="bg-white text-blue-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors shadow-sm">
                View Inventory
              </button>
            </div>
            <div className="h-16 w-16 bg-blue-400 bg-opacity-30 rounded-full flex items-center justify-center">
              <Package className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const StatCard = ({ title, value, change, isPositive, icon, color, details }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 relative overflow-hidden">
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className={`h-12 w-12 rounded-lg ${color} flex items-center justify-center`}>{icon}</div>
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            isPositive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {isPositive ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
          {change}
        </span>
      </div>
      <div className="relative z-10">
        <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">{title}</div>
          <div className="text-xs text-gray-400">{details}</div>
        </div>
      </div>
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-gray-100 to-transparent rounded-bl-full opacity-50"></div>
    </div>
  )
}

const MetricCard = ({ title, value, change, isPositive, icon }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm font-medium text-gray-500">{title}</div>
        {icon}
      </div>
      <div className="flex items-end justify-between">
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
            isPositive ? "text-green-600" : "text-red-600"
          }`}
        >
          {isPositive ? <ArrowUpRight className="h-3 w-3 mr-0.5" /> : <ArrowDownRight className="h-3 w-3 mr-0.5" />}
          {change}
        </span>
      </div>
    </div>
  )
}

const AnalyticsCard = ({ title, icon, chart, data }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        {icon}
      </div>
      <div className="mb-4">{chart}</div>
      <div className="grid grid-cols-2 gap-2">
        {data.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <span className="text-sm text-gray-500">{item.label}</span>
            <span className="text-sm font-medium text-gray-900">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Dashboard
