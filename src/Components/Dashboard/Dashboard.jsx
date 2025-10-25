"use client";

import { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { selectLanguageCode } from "../../Redux/LanguageSlice/languageSlice";
import tjson from "./json/dashboardjsx.json";

import Sidebar from "./sidebar.jsx";
import Navbar from "./navbar.jsx";
import DashboardContent from "./dashboard-content.jsx";
import DriversTable from "./drivers-table.jsx";
import AddDriverForm from "./add-driver-form.jsx";
import AddVehicleForm from "./add-vehicle-form.jsx";
import DriverDetails from "./driver-details.jsx";
import VehiclesTable from "./vehicles-table.jsx";
import ReportContent from "./report-content.jsx";
import EarningReportContent from "./earning-report-content.jsx";
import RideReportContent from "./ride-report-content.jsx";
import OrderReportContent from "./order-report-content.jsx";

// Tiny template helper for strings like "Vehicle Details for {{make}} {{model}}"
const tr = (tpl = "", vars = {}) =>
  tpl.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, k) => `${vars[k] ?? ""}`);

export default function Dashboard() {
  const lang = useSelector(selectLanguageCode); // 'en' | 'ru'
  const t = useMemo(() => tjson?.[lang] || tjson.en, [lang]);

  // IMPORTANT: keep this as a STABLE KEY (not a localized label)
  const [activeTab, setActiveTab] = useState("dashboard"); // 'dashboard' | 'staff' | 'vehicles' | 'report' | ...

  const [showAddDriverForm, setShowAddDriverForm] = useState(false);
  const [showAddVehicleForm, setShowAddVehicleForm] = useState(false);
  const [showDriverDetails, setShowDriverDetails] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [showVehicleDetails, setShowVehicleDetails] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  const handleAddDriver = (driverData) => {
    console.log(t.messages.new_driver_logged, driverData);
    setShowAddDriverForm(false);
    setActiveTab("staff"); // use key
  };

  const handleAddVehicle = (vehicleData) => {
    console.log(t.messages.new_vehicle_logged, vehicleData);
    setShowAddVehicleForm(false);
    setActiveTab("vehicles"); // use key
  };

  const handleViewDriver = (driver) => {
    setSelectedDriver(driver);
    setShowDriverDetails(true);
  };

  const handleViewVehicle = (vehicle) => {
    setSelectedVehicle(vehicle);
    setShowVehicleDetails(true);
  };

  // Sidebar will send KEYS. Keep internal state keyed, not localized.
  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
    setShowAddDriverForm(false);
    setShowAddVehicleForm(false);
    setShowDriverDetails(false);
    setShowVehicleDetails(false);
  };

  const renderMainContent = () => {
    if (showDriverDetails && selectedDriver) {
      return (
        <DriverDetails
          driver={selectedDriver}
          onBack={() => setShowDriverDetails(false)}
        />
      );
    }

    if (showVehicleDetails && selectedVehicle) {
      return (
        <div className="flex-1 p-6">
          <div className="flex items-center text-sm text-gray-400 mb-6">
            <span>{t.breadcrumbs.vehicles}</span>
            <span className="mx-2">{t.breadcrumbs.arrow}</span>
            <span className="text-white">{t.breadcrumbs.vehicle_details}</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-4">
            {tr(t.vehicle_details.page_title, {
              make: selectedVehicle.make,
              model: selectedVehicle.model,
            })}
          </h1>
          <p className="text-gray-400">
            {tr(t.vehicle_details.description, { id: selectedVehicle.id })}
          </p>
          <button
            onClick={() => setShowVehicleDetails(false)}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            {t.vehicle_details.back_button}
          </button>
        </div>
      );
    }

    if (showAddDriverForm) {
      return (
        <AddDriverForm
          onBack={() => setShowAddDriverForm(false)}
          onSubmit={handleAddDriver}
        />
      );
    }

    if (showAddVehicleForm) {
      return (
        <AddVehicleForm
          onBack={() => setShowAddVehicleForm(false)}
          onSubmit={handleAddVehicle}
        />
      );
    }

    // Switch on stable KEYS
    switch (activeTab) {
      case "staff":
        return (
          <DriversTable
            onAddDriver={() => setShowAddDriverForm(true)}
            onViewDriver={handleViewDriver}
          />
        );
      case "vehicles":
        return (
          <VehiclesTable
            onAddVehicle={() => setShowAddVehicleForm(true)}
            onViewVehicle={handleViewVehicle}
          />
        );
      case "report":
        return <ReportContent />;
      case "earning_report":
        return <EarningReportContent />;
      // case "order_report":
      //   return <OrderReportContent />;
      case "ride_report":
        return <RideReportContent />;
      case "dashboard":
      default:
        return <DashboardContent />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <Sidebar activeTab={activeTab} onTabChange={handleTabChange} />

      <div className="flex-1 flex flex-col">
        {!showAddDriverForm &&
          !showAddVehicleForm &&
          !showDriverDetails &&
          !showVehicleDetails && <Navbar />}
        {renderMainContent()}
      </div>
    </div>
  );
}
