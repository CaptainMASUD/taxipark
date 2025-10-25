import { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { selectLanguageCode } from "../../Redux/LanguageSlice/languageSlice";
import tjson from "./json/drivers-table.json";

import {
  Search,
  Plus,
  MoreHorizontal,
  ChevronDown,
  Edit,
  Loader,
  AlertCircle,
} from "lucide-react";
import axios from "axios";
import DriverDetails from "./driver-details";
import AddDriverForm from "./add-driver-form";

const API_BASE_URL = "http://localhost:3000/api";

// Template helper for strings like "Updated {{count}} drivers"
const tr = (tpl = "", vars = {}) =>
  tpl.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, k) => `${vars[k] ?? ""}`);

// Axios
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken") || "mock-token";
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.error || error.message || "Network error";
    return Promise.reject(new Error(message));
  }
);

// API
const driversApi = {
  getAll: () => apiClient.get("/taxipark/drivers"),
  getById: (driverId) => apiClient.get(`/taxipark/drivers/${driverId}`),
  create: (data) => apiClient.post("/taxipark/drivers", data),
  updateConnections: (connections) =>
    apiClient.put("/taxipark/driver_connection", { connections }),
  updateFares: (fares) =>
    apiClient.put("/taxipark/driver_current_fare_per_km", { fares }),
};

// Simple toast
const showToast = (message, type = "info") => {
  const toast = document.createElement("div");
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 12px 16px;
    border-radius: 6px;
    color: white;
    font-weight: 500;
    z-index: 10000;
    transform: translateX(100%);
    transition: transform 0.3s ease;
    ${
      type === "success"
        ? "background-color: #10b981;"
        : type === "error"
        ? "background-color: #ef4444;"
        : "background-color: #3b82f6;"
    }
  `;
  document.body.appendChild(toast);
  setTimeout(() => (toast.style.transform = "translateX(0)"), 10);
  setTimeout(() => {
    toast.style.transform = "translateX(100%)";
    setTimeout(() => {
      if (document.body.contains(toast)) document.body.removeChild(toast);
    }, 300);
  }, 4000);
};

// Loading Modal
const LoadingModal = ({ isOpen, message }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-8 flex flex-col items-center space-y-4">
        <Loader className="w-8 h-8 animate-spin text-blue-500" />
        <p className="text-white text-lg">{message}</p>
      </div>
    </div>
  );
};

export default function DriversTable() {
  const lang = useSelector(selectLanguageCode); // 'en' | 'ru'
  const t = useMemo(() => tjson?.[lang] || tjson.en, [lang]);

  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDrivers, setSelectedDrivers] = useState(new Set());
  const [bulkUpdating, setBulkUpdating] = useState(false);
  const [selectedDriverId, setSelectedDriverId] = useState(null);
  const [showDriverDetails, setShowDriverDetails] = useState(false);
  const [showAddDriver, setShowAddDriver] = useState(false);
  const [loadingDriverDetails, setLoadingDriverDetails] = useState(false);

  useEffect(() => {
    fetchDrivers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]); // refresh strings in UI; data can remain same

  const fetchDrivers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await driversApi.getAll();
      setDrivers(response.drivers || []);
    } catch (err) {
      setError(err.message || t.errors.fetch_failed);
      showToast(t.toasts.fetch_failed, "error");
    } finally {
      setLoading(false);
    }
  };

  const filteredDrivers = drivers.filter((driver) => {
    const name = driver.User?.name || "";
    const phone = driver.User?.phone || "";
    const license = driver.licenseNumber || "";
    const q = searchTerm.toLowerCase();
    return (
      name.toLowerCase().includes(q) ||
      phone.includes(searchTerm) ||
      license.toLowerCase().includes(q)
    );
  });

  const handleSelectDriver = (driverId, checked) => {
    const next = new Set(selectedDrivers);
    checked ? next.add(driverId) : next.delete(driverId);
    setSelectedDrivers(next);
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedDrivers(new Set(filteredDrivers.map((d) => d.userId)));
    } else {
      setSelectedDrivers(new Set());
    }
  };

  const handleConnectionChange = async (driverId, isConnected) => {
    try {
      await driversApi.updateConnections([{ driverId, isConnected }]);
      setDrivers((prev) =>
        prev.map((d) =>
          d.userId === driverId ? { ...d, connectionStatus: isConnected } : d
        )
      );
      showToast(t.toasts.connection_updated, "success");
    } catch {
      showToast(t.toasts.connection_failed, "error");
    }
  };

  const handleFareChange = async (driverId, farePerKm) => {
    if (farePerKm < 0) return;
    try {
      await driversApi.updateFares([{ driverId, farePerKm }]);
      setDrivers((prev) =>
        prev.map((d) =>
          d.userId === driverId ? { ...d, currentFarePerKm: farePerKm } : d
        )
      );
      showToast(t.toasts.fare_updated, "success");
    } catch {
      showToast(t.toasts.fare_failed, "error");
    }
  };

  const handleBulkConnectionUpdate = async (isConnected) => {
    if (selectedDrivers.size === 0) return;
    try {
      setBulkUpdating(true);
      const connections = Array.from(selectedDrivers).map((driverId) => ({
        driverId,
        isConnected,
      }));
      await driversApi.updateConnections(connections);
      setDrivers((prev) =>
        prev.map((d) =>
          selectedDrivers.has(d.userId)
            ? { ...d, connectionStatus: isConnected }
            : d
        )
      );
      setSelectedDrivers(new Set());
      showToast(tr(t.toasts.bulk_updated, { count: connections.length }), "success");
    } catch {
      showToast(t.toasts.bulk_failed, "error");
    } finally {
      setBulkUpdating(false);
    }
  };

  const handleDriverClick = (driver) => {
    const driverId = driver.userId || driver.User?.id;
    if (driverId) {
      setSelectedDriverId(driverId);
      setShowDriverDetails(true);
    } else {
      showToast(t.toasts.id_missing, "error");
    }
  };

  const handleAddDriver = () => setShowAddDriver(true);

  const handleAddDriverSubmit = async (formData) => {
    try {
      await driversApi.create(formData);
      showToast(t.toasts.add_success, "success");
      setShowAddDriver(false);
      fetchDrivers();
    } catch (err) {
      showToast(err.message || t.toasts.add_failed, "error");
    }
  };

  const handleBackToTable = () => {
    setShowDriverDetails(false);
    setSelectedDriverId(null);
  };

  const handleDriverUpdate = () => fetchDrivers();

  if (loading) {
    return (
      <div className="flex-1 p-6 flex items-center justify-center">
        <div className="flex items-center space-x-2 text-white">
          <Loader className="w-6 h-6 animate-spin" />
          <span>{t.loading.drivers}</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 p-6 flex items-center justify-center">
        <div className="flex items-center space-x-2 text-red-400">
          <AlertCircle className="w-6 h-6" />
          <span>{error}</span>
          <button
            onClick={fetchDrivers}
            className="ml-4 px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600"
          >
            {t.buttons.retry}
          </button>
        </div>
      </div>
    );
  }

  // Add Driver
  if (showAddDriver) {
    return (
      <AddDriverForm
        onBack={() => setShowAddDriver(false)}
        onSubmit={handleAddDriverSubmit}
      />
    );
  }

  // Driver Details
  if (showDriverDetails && selectedDriverId) {
    return (
      <DriverDetails
        selectedDriverId={selectedDriverId}
        onBack={handleBackToTable}
        onUpdate={handleDriverUpdate}
      />
    );
  }

  return (
    <>
      <div className="flex-1 p-6 overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">{t.header.title}</h1>
          <button
            onClick={handleAddDriver}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>{t.header.add_button}</span>
          </button>
        </div>

        {/* Search & Bulk */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder={t.search.placeholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-gray-700 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
              />
            </div>
            <button
              onClick={fetchDrivers}
              title={t.search.refresh_title}
              aria-label={t.search.refresh_title}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>

          {selectedDrivers.size > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-gray-300 text-sm">
                {tr(t.bulk_actions.selected_count, {
                  count: selectedDrivers.size,
                })}
              </span>
              <button
                onClick={() => handleBulkConnectionUpdate(true)}
                disabled={bulkUpdating}
                className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm transition-colors disabled:opacity-50"
              >
                {bulkUpdating && (
                  <Loader className="w-3 h-3 mr-1 animate-spin inline" />
                )}
                {t.bulk_actions.connect_all}
              </button>
              <button
                onClick={() => handleBulkConnectionUpdate(false)}
                disabled={bulkUpdating}
                className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition-colors disabled:opacity-50"
              >
                {t.bulk_actions.disconnect_all}
              </button>
            </div>
          )}
        </div>

        {/* Table */}
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="text-left p-4 text-gray-300 font-medium">
                  <input
                    type="checkbox"
                    aria-label={t.table.select_all_aria}
                    className="rounded bg-gray-600 border-gray-500"
                    checked={
                      selectedDrivers.size === filteredDrivers.length &&
                      filteredDrivers.length > 0
                    }
                    onChange={(e) => handleSelectAll(e.target.checked)}
                  />
                </th>
                <th className="text-left p-4 text-gray-300 font-medium">
                  {t.table.columns.name}
                </th>
                <th className="text-left p-4 text-gray-300 font-medium">
                  {t.table.columns.phone}
                </th>
                <th className="text-left p-4 text-gray-300 font-medium">
                  {t.table.columns.email}
                </th>
                <th className="text-left p-4 text-gray-300 font-medium">
                  {t.table.columns.license}
                </th>
                <th className="text-left p-4 text-gray-300 font-medium">
                  {t.table.columns.connection}
                </th>
                <th className="text-left p-4 text-gray-300 font-medium">
                  {t.table.columns.fare}
                </th>
                <th className="text-left p-4 text-gray-300 font-medium">
                  {t.table.columns.actions}
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredDrivers.map((driver) => (
                <tr
                  key={driver.userId}
                  className="border-t border-gray-700 hover:bg-gray-750"
                >
                  <td className="p-4">
                    <input
                      type="checkbox"
                      className="rounded bg-gray-600 border-gray-500"
                      checked={selectedDrivers.has(driver.userId)}
                      onChange={(e) =>
                        handleSelectDriver(driver.userId, e.target.checked)
                      }
                    />
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-white font-medium">
                        {driver.User?.name?.charAt(0)?.toUpperCase() ||
                          t.avatars.fallback}
                      </div>
                      <button
                        onClick={() => handleDriverClick(driver)}
                        className="text-white font-medium hover:text-blue-400 transition-colors text-left"
                        title={t.table.action_edit_title}
                      >
                        {driver.User?.name || "Unknown"}
                      </button>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-blue-400">
                        {driver.User?.phone || "N/A"}
                      </span>
                      <div
                        className={`w-2 h-2 rounded-full ${
                          driver.connectionStatus
                            ? "bg-green-400"
                            : "bg-gray-400"
                        }`}
                        title={
                          driver.connectionStatus
                            ? t.status_dot.online
                            : t.status_dot.offline
                        }
                      ></div>
                    </div>
                  </td>
                  <td className="p-4 text-gray-300">
                    {driver.User?.email || "N/A"}
                  </td>
                  <td className="p-4 text-gray-300">
                    {driver.licenseNumber || "N/A"}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <select
                        value={
                          driver.connectionStatus
                            ? t.table.connection_options.active
                            : t.table.connection_options.inactive
                        }
                        onChange={(e) =>
                          handleConnectionChange(
                            driver.userId,
                            e.target.value === t.table.connection_options.active
                          )
                        }
                        className="bg-gray-700 text-white border border-gray-600 rounded px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value={t.table.connection_options.active}>
                          {t.table.connection_options.active}
                        </option>
                        <option value={t.table.connection_options.inactive}>
                          {t.table.connection_options.inactive}
                        </option>
                      </select>
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </div>
                  </td>
                  <td className="p-4">
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      aria-label={t.table.fare_input_aria}
                      value={driver.currentFarePerKm || 0}
                      onChange={(e) =>
                        handleFareChange(
                          driver.userId,
                          parseFloat(e.target.value) || 0
                        )
                      }
                      className="bg-gray-700 text-white border border-gray-600 rounded px-2 py-1 w-20 text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleDriverClick(driver)}
                        title={t.table.action_edit_title}
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() =>
                          showToast(
                            tr(t.toasts.more_options, {
                              name: driver.User?.name || "—",
                            }),
                            "info"
                          )
                        }
                        title={t.table.action_more_title}
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty states */}
        {filteredDrivers.length === 0 && !loading && (
          <div className="text-center py-8 text-gray-400">
            {searchTerm ? t.empty.no_results_with_query : t.empty.no_results}
          </div>
        )}

        {/* Pagination (static placeholder) */}
        <div className="flex items-center justify-between mt-6">
          <span className="text-gray-400 text-sm">
            {tr(t.pagination.showing, {
              visible: filteredDrivers.length,
              total: drivers.length,
            })}
          </span>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1 bg-gray-700 text-gray-300 rounded hover:bg-gray-600 disabled:opacity-50" disabled>
              {t.pagination.previous}
            </button>
            <button className="px-3 py-1 bg-blue-600 text-white rounded">
              {tr(t.pagination.page, { page: 1 })}
            </button>
            <button className="px-3 py-1 bg-gray-700 text-gray-300 rounded hover:bg-gray-600 disabled:opacity-50" disabled>
              {t.pagination.next}
            </button>
          </div>
        </div>

        <style jsx>{`
          .animate-spin {
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          .hover\\:bg-gray-750:hover {
            background-color: rgba(55, 65, 81, 0.5);
          }
        `}</style>
      </div>

      {/* Loading Modal */}
      <LoadingModal
        isOpen={loadingDriverDetails}
        message={t.loading.modal_message}
      />
    </>
  );
}
