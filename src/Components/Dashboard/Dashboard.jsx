"use client"

import { useState } from "react"
import Sidebar from "./sidebar.jsx"
import Navbar from "./navbar.jsx"
import DashboardContent from "./dashboard-content.jsx"
import DriversTable from "./drivers-table.jsx"
import AddDriverForm from "./add-driver-form.jsx"
import AddVehicleForm from "./add-vehicle-form.jsx"
import DriverDetails from "./driver-details.jsx"
import VehiclesTable from "./vehicles-table.jsx"
import ReportContent from "./report-content.jsx"
import EarningReportContent from "./earning-report-content.jsx"
import RideReportContent from "./ride-report-content.jsx"
import OrderReportContent from "./order-report-content.jsx"

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("Dashboard")
  const [showAddDriverForm, setShowAddDriverForm] = useState(false)
  const [showAddVehicleForm, setShowAddVehicleForm] = useState(false)
  const [showDriverDetails, setShowDriverDetails] = useState(false)
  const [selectedDriver, setSelectedDriver] = useState(null)
  const [showVehicleDetails, setShowVehicleDetails] = useState(false)
  const [selectedVehicle, setSelectedVehicle] = useState(null)

  const handleAddDriver = (driverData) => {
    console.log("New driver data:", driverData)
    setShowAddDriverForm(false)
    setActiveTab("Staff")
  }

  const handleAddVehicle = (vehicleData) => {
    console.log("New vehicle data:", vehicleData)
    setShowAddVehicleForm(false)
    setActiveTab("Vehicles")
  }

  const handleViewDriver = (driver) => {
    setSelectedDriver(driver)
    setShowDriverDetails(true)
  }

  const handleViewVehicle = (vehicle) => {
    setSelectedVehicle(vehicle)
    setShowVehicleDetails(true)
  }

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    setShowAddDriverForm(false)
    setShowAddVehicleForm(false)
    setShowDriverDetails(false)
    setShowVehicleDetails(false)
  }

  const renderMainContent = () => {
    if (showDriverDetails && selectedDriver) {
      return <DriverDetails driver={selectedDriver} onBack={() => setShowDriverDetails(false)} />
    }

    if (showVehicleDetails && selectedVehicle) {
      return (
        <div className="flex-1 p-6">
          <div className="flex items-center text-sm text-gray-400 mb-6">
            <span>Vehicles</span>
            <span className="mx-2">→</span>
            <span className="text-white">Vehicle Details</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-4">
            Vehicle Details for {selectedVehicle.make} {selectedVehicle.model}
          </h1>
          <p className="text-gray-400">Details for vehicle ID: {selectedVehicle.id} coming soon...</p>
          <button
            onClick={() => setShowVehicleDetails(false)}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            Back to Vehicles
          </button>
        </div>
      )
    }

    if (showAddDriverForm) {
      return <AddDriverForm onBack={() => setShowAddDriverForm(false)} onSubmit={handleAddDriver} />
    }

    if (showAddVehicleForm) {
      return <AddVehicleForm onBack={() => setShowAddVehicleForm(false)} onSubmit={handleAddVehicle} />
    }

    switch (activeTab) {
      case "Staff":
        return <DriversTable onAddDriver={() => setShowAddDriverForm(true)} onViewDriver={handleViewDriver} />
      case "Vehicles":
        return <VehiclesTable onAddVehicle={() => setShowAddVehicleForm(true)} onViewVehicle={handleViewVehicle} />
      case "Report":
        return <ReportContent />
      case "Earning Report":
        return <EarningReportContent />
      case "Order Report":
        return <OrderReportContent/>
      case "Ride Report":
        return <RideReportContent />
      case "Dashboard":
      default:
        return <DashboardContent />
    }
  }

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <Sidebar activeTab={activeTab} onTabChange={handleTabChange} />

      <div className="flex-1 flex flex-col">
        {!showAddDriverForm && !showAddVehicleForm && !showDriverDetails && !showVehicleDetails && <Navbar />}
        {renderMainContent()}
      </div>
    </div>
  )
}
