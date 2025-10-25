"use client";

import { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { selectLanguageCode } from "../../Redux/LanguageSlice/languageSlice";
import tjson from "./json/earning-report-content.json";

import { Filter, RotateCcw, Loader, AlertCircle } from "lucide-react";
import axios from "axios";

export default function EarningReport() {
  const lang = useSelector(selectLanguageCode); // 'en' | 'ru'
  const t = useMemo(() => tjson?.[lang] || tjson.en, [lang]);

  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const API_BASE_URL = "http://localhost:3000/api";

  const apiClient = useMemo(() => {
    const instance = axios.create({
      baseURL: API_BASE_URL,
      headers: { "Content-Type": "application/json" },
    });
    instance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("authToken") || "mock-token";
        if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
      },
      (error) => Promise.reject(error)
    );
    instance.interceptors.response.use(
      (response) => response.data,
      (error) => {
        const message =
          error.response?.data?.error || error.message || t.errors.network;
        return Promise.reject(new Error(message));
      }
    );
    return instance;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [API_BASE_URL, lang]); // rebind to update localized error text

  // tiny template helper for {{var}} replacements
  const tr = (tpl = "", vars = {}) =>
    tpl.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, k) => `${vars[k] ?? ""}`);

  const fmtDate = (iso) => {
    if (!iso) return "";
    // Use locale based on language
    const locale = lang === "ru" ? "ru-RU" : "en-US";
    return new Date(iso).toLocaleDateString(locale);
  };

  // Simple toast
  const showToast = (message, type = "info") => {
    let container = document.querySelector(".toast-container");
    if (!container) {
      container = document.createElement("div");
      container.className = "toast-container";
      container.style.cssText = `
        position: fixed; top: 20px; right: 20px; z-index: 10000;
        display: flex; flex-direction: column; gap: 10px;
      `;
      document.body.appendChild(container);
    }
    const toast = document.createElement("div");
    toast.textContent = message;
    const base = `
      padding: 12px 16px; border-radius: 6px; color: white; font-weight: 500;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15); transform: translateX(100%);
      transition: transform .3s ease; max-width: 300px; word-wrap: break-word;
    `;
    const typeStyles = {
      success: "background-color:#10b981;",
      error: "background-color:#ef4444;",
      info: "background-color:#3b82f6;",
      warning: "background-color:#f59e0b;",
    };
    toast.style.cssText = base + (typeStyles[type] || typeStyles.info);
    container.appendChild(toast);
    setTimeout(() => (toast.style.transform = "translateX(0)"), 10);
    setTimeout(() => {
      toast.style.transform = "translateX(100%)";
      setTimeout(() => container.contains(toast) && container.removeChild(toast), 300);
    }, 4000);
  };

  useEffect(() => {
    // default last 7 days
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);
    setStartDate(sevenDaysAgo.toISOString().split("T")[0]);
    setEndDate(today.toISOString().split("T")[0]);
  }, []);

  useEffect(() => {
    if (startDate && endDate) fetchEarningReport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate, lang]); // refresh text in UI

  const fetchEarningReport = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.post("/taxipark/report/earning", {
        startDate,
        endDate,
      });
      setReportData(response.report || []);
    } catch (err) {
      setError(err.message || t.errors.generic);
      showToast(err.message || t.toasts.fetch_failed, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleResetFilter = () => {
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);
    setStartDate(sevenDaysAgo.toISOString().split("T")[0]);
    setEndDate(today.toISOString().split("T")[0]);
    showToast(t.toasts.reset_done, "success");
  };

  if (loading) {
    return (
      <div className="flex-1 p-6 flex items-center justify-center">
        <div className="flex items-center space-x-2 text-white">
          <Loader className="w-6 h-6 animate-spin" />
          <span>{t.loading.page}</span>
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
            onClick={fetchEarningReport}
            className="ml-4 px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600"
          >
            {t.buttons.retry}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 overflow-auto">
      <h1 className="text-2xl font-bold mb-6 text-white">{t.header.title}</h1>

      {/* Filter Bar */}
      <div className="flex items-center space-x-4 mb-4">
        <div className="flex items-center space-x-2 bg-gray-700 text-gray-300 border border-gray-600 rounded-lg px-4 py-2">
          <Filter className="w-4 h-4" />
          <span>{t.filters.filter_by_chip}</span>
        </div>

        <div className="flex items-center space-x-2">
          <label htmlFor="startDate" className="text-gray-300 text-sm">
            {t.filters.from_label}
          </label>
          <input
            type="date"
            id="startDate"
            aria-label={t.aria.date_from}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <label htmlFor="endDate" className="text-gray-300 text-sm">
            {t.filters.to_label}
          </label>
          <input
            type="date"
            id="endDate"
            aria-label={t.aria.date_to}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={fetchEarningReport}
            aria-label={t.aria.apply_filters}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2"
          >
            {t.filters.apply}
          </button>
        </div>

        <button
          className="flex items-center space-x-2 text-orange-400 hover:text-orange-300 px-4 py-2 rounded-lg"
          onClick={handleResetFilter}
          aria-label={t.aria.reset_filters}
        >
          <RotateCcw className="w-4 h-4" />
          <span>{t.filters.reset}</span>
        </button>
      </div>

      {/* Active range tag */}
      {startDate && endDate && (
        <div className="flex items-center bg-gray-700 text-gray-300 px-3 py-2 rounded-lg text-sm mb-6 w-fit">
          <span>
            {tr(t.filters.active_range_tag, {
              from: fmtDate(startDate),
              to: fmtDate(endDate),
            })}
          </span>
        </div>
      )}

      {/* Table */}
      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-700">
            <tr>
              <th className="text-left p-4 text-gray-300 font-medium">
                {t.table.columns.driver_name}
              </th>
              <th className="text-left p-4 text-gray-300 font-medium">
                {t.table.columns.vehicle_code}
              </th>
              <th className="text-left p-4 text-gray-300 font-medium">
                {t.table.columns.mileage_km}
              </th>
              <th className="text-left p-4 text-gray-300 font-medium">
                {t.table.columns.total_earning}
              </th>
            </tr>
          </thead>
          <tbody>
            {reportData.length > 0 ? (
              reportData.map((earning, index) => (
                <tr
                  key={earning.drive?.userId ?? index}
                  className="border-t border-gray-700 hover:bg-gray-750"
                >
                  <td className="p-4">
                    <a href="#" className="text-blue-400 hover:underline font-medium">
                      {earning.drive?.User?.name || "N/A"}
                    </a>
                  </td>
                  <td className="p-4 text-white">{earning.vehicle?.code || "N/A"}</td>
                  <td className="p-4 text-white">
                    {Number(earning.totalMileage || 0).toFixed(2)}
                  </td>
                  <td className="p-4 text-white">
                    {t.table.currency_prefix}{" "}
                    {Number(earning.totalEarning || 0).toFixed(2)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-8 text-gray-400">
                  {t.table.empty_for_range}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination placeholder */}
      <div className="flex items-center justify-between mt-6">
        <span className="text-gray-400 text-sm">
          {tr(t.pagination.showing_entries, { count: reportData.length })}
        </span>
        <div className="flex items-center space-x-2">
          <button
            className="px-3 py-1 bg-gray-700 text-gray-300 rounded hover:bg-gray-600 disabled:opacity-50"
            disabled
          >
            {t.pagination.previous}
          </button>
          <button className="px-3 py-1 bg-blue-600 text-white rounded">
            {tr(t.pagination.page, { page: 1 })}
          </button>
          <button
            className="px-3 py-1 bg-gray-700 text-gray-300 rounded hover:bg-gray-600 disabled:opacity-50"
            disabled
          >
            {t.pagination.next}
          </button>
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
        .hover\\:bg-gray-750:hover {
          background-color: rgba(55, 65, 81, 0.5);
        }
      `}</style>
    </div>
  );
}
