"use client";

import { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { selectLanguageCode } from "../../Redux/LanguageSlice/languageSlice";
import tjson from "./json/dashboard-content.json";

import { User, Info, Loader, AlertCircle } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import axios from "axios";

const API_BASE_URL = "http://localhost:3000/api";

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken") || "mock-token";
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.error || error.message || "Network error";
    return Promise.reject(new Error(message));
  }
);

// Base (English) data for charts — we’ll localize the day labels via i18n
const activityDataBase = [
  { name: "Sun", value: 5 },
  { name: "Mon", value: 18 },
  { name: "Tues", value: 12 },
  { name: "Wed", value: 8 },
  { name: "Thurs", value: 15 },
  { name: "Fri", value: 20 },
];
const hoursOnlineDataBase = [
  { name: "Sat", value: 2 },
  { name: "Sun", value: 8 },
  { name: "Mon", value: 6 },
  { name: "Tues", value: 10 },
  { name: "Wed", value: 12 },
  { name: "Thurs", value: 9 },
  { name: "Fri", value: 15 },
];
const tripsBarDataBase = [
  { name: "Mon", value: 180 },
  { name: "Tues", value: 220 },
  { name: "Wed", value: 160 },
  { name: "Thurs", value: 190 },
  { name: "Fri", value: 140 },
  { name: "Sat", value: 120 },
];

// Tiny templating helper for strings like "Completed: {{count}}"
const tr = (tpl = "", vars = {}) =>
  tpl.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, k) => `${vars[k] ?? ""}`);

export default function DashboardContent() {
  const lang = useSelector(selectLanguageCode); // 'en' | 'ru'
  const t = useMemo(() => tjson?.[lang] || tjson.en, [lang]);

  const [drivers, setDrivers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  // Localize day labels for charts
  const dayMap = useMemo(() => {
    const d = t.placeholders.days_short;
    return {
      Sun: d.sun,
      Mon: d.mon,
      Tues: d.tues,
      Wed: d.wed,
      Thurs: d.thurs,
      Fri: d.fri,
      Sat: d.sat,
    };
  }, [t]);

  const activityData = useMemo(
    () => activityDataBase.map((it) => ({ ...it, name: dayMap[it.name] })),
    [dayMap]
  );
  const hoursOnlineData = useMemo(
    () => hoursOnlineDataBase.map((it) => ({ ...it, name: dayMap[it.name] })),
    [dayMap]
  );
  const tripsBarData = useMemo(
    () => tripsBarDataBase.map((it) => ({ ...it, name: dayMap[it.name] })),
    [dayMap]
  );

  // Get user data from localStorage
  useEffect(() => {
    try {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const userData = JSON.parse(userStr);
        setUser(userData);
      }
    } catch (e) {
      console.error("Error getting user data:", e);
    }
  }, []);

  // Fetch drivers and vehicles data
  useEffect(() => {
    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [driversResponse, vehiclesResponse] = await Promise.all([
        apiClient.get("/taxipark/drivers"),
        apiClient.get("/taxipark/vehicles"),
      ]);

      // Localized logs
      console.log(t.messages.drivers_response_log, driversResponse);
      console.log(t.messages.vehicles_response_log, vehiclesResponse);

      setDrivers(driversResponse.drivers || []);
      setVehicles(vehiclesResponse.vehicles || []);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      // Try to categorize network vs generic
      const isNetwork =
        (err?.message || "").toLowerCase().includes("network") ||
        (err?.message || "").toLowerCase().includes("timeout");
      setError(isNetwork ? t.messages.api_error_network : t.messages.api_error_generic);
    } finally {
      setLoading(false);
    }
  };

  // Calculate metrics
  const activeDrivers = drivers.filter((d) => d.connectionStatus).length;
  const totalDrivers = drivers.length;
  const totalVehicles = vehicles.length;
  const activeVehicles = vehicles.filter((v) => v.connectionStatus).length;

  if (loading) {
    return (
      <main className="flex-1 p-6 overflow-auto">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center space-x-2 text-white">
            <Loader className="w-6 h-6 animate-spin" />
            <span>{t.page.loading}</span>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 p-6 overflow-auto">
      <h1 className="text-2xl font-bold mb-6 text-white">{t.page.title}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Taxi Park Info */}
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mr-4">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">
                {user?.name || t.taxi_park_card.title_fallback}
              </h2>
              <p className="text-gray-400 text-sm">
                {t.taxi_park_card.id_label} {user?.userId || "0000000000000000"}
              </p>
              {user?.email && (
                <p className="text-gray-400 text-xs">{user.email}</p>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-400">{activeDrivers}</p>
              <p className="text-gray-400 text-sm">
                {t.taxi_park_card.quick_stats.active_drivers}
              </p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-400">{activeVehicles}</p>
              <p className="text-gray-400 text-sm">
                {t.taxi_park_card.quick_stats.active_vehicles}
              </p>
            </div>
          </div>
        </div>

        {/* Activity Chart */}
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">
              {t.charts.activity.title}
            </h3>
            <button
              className="text-blue-400 text-sm hover:text-blue-300"
              aria-label={t.aria.open_report}
            >
              {t.charts.activity.cta_report}
            </button>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} />
                <YAxis stroke="#9CA3AF" fontSize={12} />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#FBBF24"
                  strokeWidth={2}
                  dot={{ fill: "#FBBF24", strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Connected Drivers List */}
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <h3 className="text-lg font-semibold mr-2 text-white">
                {t.lists.connected_drivers.title}
              </h3>
              <Info className="w-4 h-4 text-gray-400" />
            </div>
            <span className="text-blue-400 text-sm">
              {tr(t.lists.connected_drivers.online_count, {
                count: activeDrivers,
              })}
            </span>
          </div>

          {error ? (
            <div className="flex items-center justify-center h-48 text-red-400">
              <AlertCircle className="w-6 h-6 mr-2" />
              <span>{error}</span>
            </div>
          ) : (
            <div className="space-y-3 max-h-48 overflow-y-auto">
              {drivers.filter((d) => d.connectionStatus).length > 0 ? (
                drivers
                  .filter((d) => d.connectionStatus)
                  .slice(0, 8)
                  .map((driver) => (
                    <div
                      key={driver.userId}
                      className="flex items-center justify-between p-3 bg-gray-700 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="text-white font-medium text-sm">
                            {driver.User?.name ||
                              t.lists.connected_drivers.driver_name_fallback}
                          </p>
                          <p className="text-gray-400 text-xs">
                            {tr(t.lists.connected_drivers.driver_id_label, {
                              id: driver.userId,
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span className="text-green-400 text-xs">
                          {t.lists.connected_drivers.status_online}
                        </span>
                      </div>
                    </div>
                  ))
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <User className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>{t.lists.connected_drivers.empty_state_title}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Hours Online */}
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <h3 className="text-lg font-semibold mr-2 text-white">
                {t.charts.hours_online.title}
              </h3>
              <Info className="w-4 h-4 text-gray-400" />
            </div>
            <button
              className="text-blue-400 text-sm hover:text-blue-300"
              aria-label={t.aria.open_report}
            >
              {t.charts.hours_online.cta_report}
            </button>
          </div>
          <div className="flex items-center mb-4">
            <span className="text-red-400 text-sm mr-2">
              {t.charts.hours_online.delta}
            </span>
            <span className="text-2xl font-bold text-white">
              {t.charts.hours_online.total_hours}
            </span>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={hoursOnlineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} />
                <YAxis stroke="#9CA3AF" fontSize={12} />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#10B981"
                  strokeWidth={2}
                  dot={{ fill: "#10B981", strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trips Bar Chart */}
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <h3 className="text-lg font-semibold mr-2 text-white">
                {t.charts.trips.title}
              </h3>
              <Info className="w-4 h-4 text-gray-400" />
            </div>
            <button
              className="text-blue-400 text-sm hover:text-blue-300"
              aria-label={t.aria.open_report}
            >
              {t.charts.trips.cta_report}
            </button>
          </div>
          <div className="mb-4">
            <span className="text-lg font-semibold text-white">
              {tr(t.charts.trips.completed_label, { count: 2103 })}
            </span>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={tripsBarData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} />
                <YAxis stroke="#9CA3AF" fontSize={12} />
                <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Live Metrics */}
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">
              {t.live_metrics.title}
            </h3>
            <button
              onClick={fetchDashboardData}
              className="text-blue-400 text-sm hover:text-blue-300"
              aria-label={t.aria.refresh_metrics}
            >
              {t.page.refresh}
            </button>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">{t.live_metrics.active_drivers}</span>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-semibold text-green-400">
                  {activeDrivers}
                </span>
                <span className="text-gray-500">
                  {tr(t.live_metrics.of_total, { total: totalDrivers })}
                </span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">{t.live_metrics.active_vehicles}</span>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-semibold text-blue-400">
                  {activeVehicles}
                </span>
                <span className="text-gray-500">
                  {tr(t.live_metrics.of_total, { total: totalVehicles })}
                </span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">{t.live_metrics.total_vehicles}</span>
              <span className="text-xl font-semibold text-white">{totalVehicles}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">{t.live_metrics.revenue_today}</span>
              <span className="text-xl font-semibold text-green-400">
                {tr(t.live_metrics.revenue_today_value, { amount: "2,847" })}
              </span>
            </div>

            {/* Connection Rate */}
            <div className="pt-4 border-t border-gray-700">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-400">
                  {t.live_metrics.driver_connection_rate}
                </span>
                <span className="text-sm text-white">
                  {totalDrivers > 0
                    ? Math.round((activeDrivers / totalDrivers) * 100)
                    : 0}
                  %
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${
                      totalDrivers > 0
                        ? (activeDrivers / totalDrivers) * 100
                        : 0
                    }%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .animate-spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </main>
  );
}
