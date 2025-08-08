"use client"

import { Filter, RotateCcw, ChevronDown, X, ChevronLeft, ChevronRight, ArrowUpDown } from "lucide-react"
import { useState } from "react"

const sampleOrderData = [
  {
    id: 1,
    driverName: "Rodion Raskolnikov",
    vehicleCode: "Gafhai Vesta",
    completedOrders: 15,
    hoursOnline: "26 hour 39 min",
  },
  {
    id: 2,
    driverName: "Rodion Raskolnikov",
    vehicleCode: "Gafhai Vesta",
    completedOrders: 15,
    hoursOnline: "26 hour 39 min",
  },
  {
    id: 3,
    driverName: "Rodion Raskolnikov",
    vehicleCode: "Gafhai Vesta",
    completedOrders: 15,
    hoursOnline: "26 hour 39 min",
  },
  {
    id: 4,
    driverName: "Rodion Raskolnikov",
    vehicleCode: "Gafhai Vesta",
    completedOrders: 15,
    hoursOnline: "26 hour 39 min",
  },
  {
    id: 5,
    driverName: "Rodion Raskolnikov",
    vehicleCode: "Gafhai Vesta",
    completedOrders: 15,
    hoursOnline: "26 hour 39 min",
  },
  {
    id: 6,
    driverName: "Rodion Raskolnikov",
    vehicleCode: "Gafhai Vesta",
    completedOrders: 15,
    hoursOnline: "26 hour 39 min",
  },
  {
    id: 7,
    driverName: "Rodion Raskolnikov",
    vehicleCode: "Gafhai Vesta",
    completedOrders: 15,
    hoursOnline: "26 hour 39 min",
  },
  {
    id: 8,
    driverName: "Rodion Raskolnikov",
    vehicleCode: "Gafhai Vesta",
    completedOrders: 15,
    hoursOnline: "26 hour 39 min",
  },
  {
    id: 9,
    driverName: "Rodion Raskolnikov",
    vehicleCode: "Gafhai Vesta",
    completedOrders: 15,
    hoursOnline: "26 hour 39 min",
  },
]

export default function OrderReportContent() {
  const [selectedDateRange, setSelectedDateRange] = useState("Jul 14, 2025, 12:00 AM - Jul 16, 2025, 11:59 PM")
  const [showDateFilterDropdown, setShowDateFilterDropdown] = useState(false)

  const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"]
  const dates = Array.from({ length: 31 }, (_, i) => i + 1) // Dummy dates for July

  return (
    <div className="flex-1 p-6 overflow-auto">
      <h1 className="text-2xl font-bold mb-6 text-white">Order Report</h1>

      {/* Filter Bar */}
      <div className="flex items-center space-x-4 mb-4">
        <button className="flex items-center space-x-2 bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600 rounded-lg px-4 py-2">
          <Filter className="w-4 h-4" />
          <span>Filter By</span>
        </button>

        <div className="relative">
          <button
            onClick={() => setShowDateFilterDropdown(!showDateFilterDropdown)}
            className="flex items-center space-x-2 bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600 rounded-lg px-4 py-2"
          >
            <span>Date</span>
            <ChevronDown className="w-4 h-4" />
          </button>
          {showDateFilterDropdown && (
            <div className="absolute z-10 mt-2 w-auto p-4 bg-gray-800 border border-gray-700 rounded-lg shadow-lg text-white">
              <div className="flex justify-between items-center mb-4">
                <button className="text-gray-400 hover:text-white p-1 rounded-md">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="font-semibold">July 2025</span>
                <button className="text-gray-400 hover:text-white p-1 rounded-md">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-7 gap-2 text-center text-sm">
                {daysOfWeek.map((day, index) => (
                  <div key={index} className="text-gray-400 font-medium">
                    {day}
                  </div>
                ))}
                {/* Placeholder for empty days before 1st */}
                {Array.from({ length: 0 }).map((_, i) => (
                  <div key={`empty-${i}`} className="h-8 w-8" />
                ))}
                {dates.map((date) => (
                  <button
                    key={date}
                    className={`h-8 w-8 rounded-full text-white ${
                      date >= 14 && date <= 16 ? "bg-blue-600 hover:bg-blue-700" : "hover:bg-gray-700"
                    }`}
                  >
                    {date}
                  </button>
                ))}
              </div>
              <button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2">
                Apply Now
              </button>
            </div>
          )}
        </div>

        <button className="flex items-center space-x-2 bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600 rounded-lg px-4 py-2">
          <span>Contractor</span>
          <ChevronDown className="w-4 h-4" />
        </button>

        <button className="flex items-center space-x-2 text-orange-400 hover:text-orange-300 px-4 py-2 rounded-lg">
          <RotateCcw className="w-4 h-4" />
          <span>Reset Filter</span>
        </button>
      </div>

      {/* Active Filter Tag */}
      {selectedDateRange && (
        <div className="flex items-center bg-gray-700 text-gray-300 px-3 py-2 rounded-lg text-sm mb-6 w-fit">
          <span>{selectedDateRange}</span>
          <button
            className="ml-2 h-5 w-5 text-gray-400 hover:text-white p-0.5 rounded-full"
            onClick={() => setSelectedDateRange("")}
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Order Table */}
      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-700">
            <tr>
              <th className="text-left p-4 text-gray-300 font-medium">Driver's Name</th>
              <th className="text-left p-4 text-gray-300 font-medium">Vehicle code</th>
              <th className="text-center p-4 text-gray-300 font-medium">
                <div className="flex items-center justify-center whitespace-nowrap">
                  Completed Orders <ArrowUpDown className="w-3 h-3 ml-1" />
                </div>
              </th>
              <th className="text-center p-4 text-gray-300 font-medium">
                <div className="flex items-center justify-center whitespace-nowrap">
                  Hours Online <ArrowUpDown className="w-3 h-3 ml-1" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {sampleOrderData.map((order) => (
              <tr key={order.id} className="border-t border-gray-700 hover:bg-gray-750">
                <td className="p-4">
                  <a href="#" className="text-blue-400 hover:underline font-medium">
                    {order.driverName}
                  </a>
                </td>
                <td className="p-4 text-white">{order.vehicleCode}</td>
                <td className="p-4 text-white text-center">{order.completedOrders}</td>
                <td className="p-4 text-white text-center">{order.hoursOnline}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-6">
        <span className="text-gray-400 text-sm">Showing 1-10 of {sampleOrderData.length}</span>
        <div className="flex items-center space-x-2">
          <button className="px-3 py-1 bg-gray-700 text-gray-300 rounded hover:bg-gray-600">Previous</button>
          <button className="px-3 py-1 bg-blue-600 text-white rounded">1</button>
          <button className="px-3 py-1 bg-gray-700 text-gray-300 rounded hover:bg-gray-600">2</button>
          <button className="px-3 py-1 bg-gray-700 text-gray-300 rounded hover:bg-gray-600">3</button>
          <button className="px-3 py-1 bg-gray-700 text-gray-300 rounded hover:bg-gray-600">Next</button>
        </div>
      </div>
    </div>
  )
}
