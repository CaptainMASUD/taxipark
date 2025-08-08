"use client"

import { Filter, RotateCcw } from "lucide-react"

const sampleReportData = [
  { id: 1, date: "2025-07-28", type: "Daily Summary", value: "BYN 1200", status: "Generated" },
  { id: 2, date: "2025-07-27", type: "Weekly Performance", value: "BYN 7500", status: "Generated" },
  { id: 3, date: "2025-07-26", type: "Monthly Revenue", value: "BYN 30000", status: "Pending" },
]

export default function ReportContent() {
  return (
    <div className="flex-1 p-6 overflow-auto">
      <h1 className="text-2xl font-bold mb-6 text-white">Reports</h1>

      {/* Filters */}
      <div className="flex items-center space-x-4 mb-6">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <span className="text-gray-300 text-sm">Filter by</span>
        </div>
        <select className="bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 text-sm">
          <option>Date Range</option>
          <option>Last 7 Days</option>
          <option>Last 30 Days</option>
        </select>
        <select className="bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 text-sm">
          <option>Report Type</option>
          <option>Daily</option>
          <option>Weekly</option>
          <option>Monthly</option>
        </select>
        <button className="flex items-center space-x-1 text-orange-400 hover:text-orange-300 text-sm">
          <RotateCcw className="w-4 h-4" />
          <span>Reset Filter</span>
        </button>
      </div>

      {/* Report Table */}
      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-700">
            <tr>
              <th className="text-left p-4 text-gray-300 font-medium">Date</th>
              <th className="text-left p-4 text-gray-300 font-medium">Report Type</th>
              <th className="text-left p-4 text-gray-300 font-medium">Value</th>
              <th className="text-left p-4 text-gray-300 font-medium">Status</th>
              <th className="text-left p-4 text-gray-300 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sampleReportData.map((report) => (
              <tr key={report.id} className="border-t border-gray-700 hover:bg-gray-750">
                <td className="p-4 text-white">{report.date}</td>
                <td className="p-4 text-white">{report.type}</td>
                <td className="p-4 text-white">{report.value}</td>
                <td className="p-4">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      report.status === "Generated" ? "bg-green-900 text-green-300" : "bg-yellow-900 text-yellow-300"
                    }`}
                  >
                    {report.status}
                  </span>
                </td>
                <td className="p-4">
                  <button className="text-blue-400 hover:text-blue-300 text-sm">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-6">
        <span className="text-gray-400 text-sm">Showing 1-10 of {sampleReportData.length}</span>
        <div className="flex items-center space-x-2">
          <button className="px-3 py-1 bg-gray-700 text-gray-300 rounded hover:bg-gray-600">Previous</button>
          <button className="px-3 py-1 bg-blue-600 text-white rounded">1</button>
          <button className="px-3 py-1 bg-gray-700 text-gray-300 rounded hover:bg-gray-600">2</button>
          <button className="px-3 py-1 bg-gray-700 text-gray-300 rounded hover:bg-gray-600">Next</button>
        </div>
      </div>
    </div>
  )
}
