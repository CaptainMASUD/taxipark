"use client";

import { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { selectLanguageCode } from "../../Redux/LanguageSlice/languageSlice";
import tjson from "./json/driver-details.json";

import {
  ChevronDown,
  ChevronRight,
  ArrowLeft,
  Loader,
  Save,
  AlertCircle,
} from "lucide-react";
import axios from "axios";

const API_BASE_URL = "http://localhost:3000/api";

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
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

// Simple toast notification
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
  setTimeout(() => {
    toast.style.transform = "translateX(0)";
  }, 10);
  setTimeout(() => {
    toast.style.transform = "translateX(100%)";
    setTimeout(() => {
      if (document.body.contains(toast)) {
        document.body.removeChild(toast);
      }
    }, 300);
  }, 4000);
};

// tiny template helper for strings like "BYN {{value}}"
const tr = (tpl = "", vars = {}) =>
  tpl.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, k) => `${vars[k] ?? ""}`);

export default function DriverDetails({ selectedDriverId, onBack, onUpdate }) {
  const lang = useSelector(selectLanguageCode); // 'en' | 'ru'
  const t = useMemo(() => tjson?.[lang] || tjson.en, [lang]);

  const [driver, setDriver] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  const [expandedSections, setExpandedSections] = useState({
    details: true,
    personalDetails: false,
    idDetails: false,
  });

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    drivingExperience: "",
    licenseNumber: "",
    countryOfIssue: "",
    drivingLicenseIssuedOn: "",
    drivingLicenseExpeiresOn: "",
    emergencyContact: "",
    dateOfBirth: "",
    feedback: "",
    notes: "",
    passportType: "",
    country: "",
    issuedBy: "",
    registrationAddress: "",
    taxpayerId: "",
    idSeriesAndNumber: "",
    primaryStateRegistrationNumber: "",
    postCode: "",
    iDIssuedOn: "",
    iDexpiresOn: "",
  });

  // Fetch driver details - workaround: load all and filter
  const fetchDriverDetails = async (driverId) => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiClient.get("/taxipark/drivers");
      const allDrivers = response.drivers || [];

      const specificDriver = allDrivers.find((d) => {
        const driverUserId = d.userId || d.User?.id;
        return String(driverUserId) === String(driverId);
      });

      if (!specificDriver) {
        throw new Error(`Driver with ID ${driverId} not found`);
      }

      setDriver(specificDriver);

      const userData = specificDriver.User || {};
      setFormData({
        name: userData.name || "",
        phone: userData.phone || "",
        address: specificDriver.address || "",
        drivingExperience: specificDriver.drivingExperience || "",
        licenseNumber: specificDriver.licenseNumber || "",
        countryOfIssue: specificDriver.countryOfIssue || "",
        drivingLicenseIssuedOn: specificDriver.drivingLicenseIssuedOn
          ? specificDriver.drivingLicenseIssuedOn.split("T")[0]
          : "",
        drivingLicenseExpeiresOn: specificDriver.drivingLicenseExpeiresOn
          ? specificDriver.drivingLicenseExpeiresOn.split("T")[0]
          : "",
        emergencyContact: specificDriver.emergencyContact || "",
        dateOfBirth: specificDriver.dateOfBirth
          ? specificDriver.dateOfBirth.split("T")[0]
          : "",
        feedback: specificDriver.feedback || "",
        notes: specificDriver.notes || "",
        passportType: specificDriver.passportType || "",
        country: specificDriver.country || "",
        issuedBy: specificDriver.issuedBy || "",
        registrationAddress: specificDriver.registrationAddress || "",
        taxpayerId: specificDriver.taxpayerId || "",
        idSeriesAndNumber: specificDriver.idSeriesAndNumber || "",
        primaryStateRegistrationNumber:
          specificDriver.primaryStateRegistrationNumber || "",
        postCode: specificDriver.postCode || "",
        iDIssuedOn: specificDriver.iDIssuedOn
          ? specificDriver.iDIssuedOn.split("T")[0]
          : "",
        iDexpiresOn: specificDriver.iDexpiresOn
          ? specificDriver.iDexpiresOn.split("T")[0]
          : "",
      });
    } catch (err) {
      setError(tr(t.errors.generic_prefix, { message: err.message }));
    } finally {
      setLoading(false);
    }
  };

  // Fetch driver details when selectedDriverId changes
  useEffect(() => {
    if (selectedDriverId) {
      fetchDriverDetails(selectedDriverId);
    } else {
      setError(t.errors.no_id);
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDriverId, lang]);

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    if (!selectedDriverId) {
      showToast(t.toasts.no_id_update, "error");
      return;
    }

    try {
      setSaving(true);
      await apiClient.put(`/taxipark/drivers/${selectedDriverId}`, formData);
      showToast(t.toasts.update_success, "success");
      onUpdate && onUpdate();
      await fetchDriverDetails(selectedDriverId);
    } catch (err) {
      showToast(tr(t.toasts.update_error, { message: err.message }), "error");
    } finally {
      setSaving(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex-1 bg-gray-900 text-white flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader className="w-6 h-6 animate-spin" />
          <span>
            {tr(t.loading.spinner_text, {
              id: selectedDriverId ?? "",
            })}
          </span>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex-1 bg-gray-900 text-white flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4 text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-400" />
          <div className="text-red-400 text-lg">{error}</div>
          <div className="text-gray-400 text-sm">
            {tr(t.empty.requested_id, { id: selectedDriverId ?? "" })}
          </div>
          <div className="text-gray-400 text-xs">{t.errors.workaround_note}</div>
          <div className="flex space-x-4">
            <button
              onClick={() =>
                selectedDriverId && fetchDriverDetails(selectedDriverId)
              }
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              disabled={!selectedDriverId}
            >
              {t.buttons.try_again}
            </button>
            <button
              onClick={onBack}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
            >
              {t.buttons.back_to_drivers}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // No driver data
  if (!driver) {
    return (
      <div className="flex-1 bg-gray-900 text-white flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4 text-center">
          <AlertCircle className="w-12 h-12 text-yellow-400" />
          <div className="text-yellow-400 text-lg">{t.empty.not_found_title}</div>
          <div className="text-gray-400 text-sm">
            {tr(t.empty.requested_id, { id: selectedDriverId ?? "" })}
          </div>
          <button
            onClick={onBack}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            {t.buttons.back_to_drivers}
          </button>
        </div>
      </div>
    );
  }

  // Extract driver information
  const userData = driver.User || {};
  const driverName = userData.name || t.header.title_fallback;
  const driverEmail = userData.email || "N/A";
  const driverPhone = userData.phone || "N/A";
  const actualDriverId = driver.userId || driver.User?.id;

  return (
    <div className="flex-1 bg-gray-900 text-white overflow-auto">
      {/* Header */}
      <div className="border-b border-gray-700 p-6">
        <div className="flex items-center text-sm text-gray-400 mb-6">
          <button
            onClick={onBack}
            aria-label={t.aria.back_button}
            className="flex items-center text-blue-400 hover:text-blue-300 mr-4"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            {t.header.back_to}
          </button>
          <span>{t.header.breadcrumb_left}</span>
          <span className="mx-2">{t.header.breadcrumb_arrow}</span>
          <span className="text-white">{t.header.breadcrumb_right}</span>
          <span className="mx-2 text-gray-500">
            ({tr(t.header.requested_id, { id: selectedDriverId ?? "" })})
          </span>
        </div>

        {/* Driver Profile */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full bg-gray-600 flex items-center justify-center text-white font-bold text-xl">
              {driverName.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">{driverName}</h1>
              <p className="text-gray-400">
                {tr(t.profile.role_and_license, {
                  license: driver.licenseNumber || "N/A",
                })}
              </p>
              <p className="text-gray-500 text-sm">
                {tr(t.profile.actual_id, { id: actualDriverId ?? "" })}
              </p>
              <p className="text-gray-500 text-xs">
                {String(actualDriverId) === String(selectedDriverId)
                  ? t.profile.id_match_ok
                  : t.profile.id_match_bad}
              </p>
            </div>
          </div>
          <div
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              driver.connectionStatus
                ? "bg-green-600 text-white"
                : "bg-gray-600 text-gray-300"
            }`}
          >
            {driver.connectionStatus
              ? t.profile.status_chip_active
              : t.profile.status_chip_inactive}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-5 gap-4 p-4 bg-gray-800 rounded-lg">
          <div className="text-center">
            <p className="text-gray-400 text-sm mb-1">
              {t.stats.connection_status_label}
            </p>
            <p className="text-white font-semibold">
              {driver.connectionStatus
                ? t.stats.connection_status_online
                : t.stats.connection_status_offline}
            </p>
          </div>
          <div className="text-center">
            <p className="text-gray-400 text-sm mb-1">{t.stats.email_label}</p>
            <p className="text-white font-semibold text-xs">{driverEmail}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-400 text-sm mb-1">{t.stats.phone_label}</p>
            <p className="text-white font-semibold text-xs">{driverPhone}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-400 text-sm mb-1">
              {t.stats.taxi_park_id_label}
            </p>
            <p className="text-white font-semibold">
              {driver.taxiParkId || "N/A"}
            </p>
          </div>
          <div className="text-center">
            <p className="text-gray-400 text-sm mb-1">
              {t.stats.price_per_km_label}
            </p>
            <p className="text-white font-semibold">
              {tr(t.stats.price_per_km_value, {
                value: driver.currentFarePerKm || "0",
              })}
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-6xl mx-auto">
        <div className="space-y-4">
          {/* Basic Details */}
          <div className="border border-gray-700 rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection("details")}
              aria-label={t.buttons.toggle_section_aria}
              className="w-full flex items-center justify-between p-4 bg-gray-800 hover:bg-gray-700 transition-colors text-left"
            >
              <span className="text-white font-medium">
                {t.sections.basic_details}
              </span>
              {expandedSections.details ? (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronRight className="w-5 h-5 text-gray-400" />
              )}
            </button>

            {expandedSections.details && (
              <div className="p-6 bg-gray-800 border-t border-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">
                      {t.fields.name}
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 mb-2">
                      {t.fields.phone}
                    </label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 mb-2">
                      {t.fields.licenseNumber}
                    </label>
                    <input
                      type="text"
                      name="licenseNumber"
                      value={formData.licenseNumber}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 mb-2">
                      {t.fields.countryOfIssue}
                    </label>
                    <input
                      type="text"
                      name="countryOfIssue"
                      value={formData.countryOfIssue}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 mb-2">
                      {t.fields.drivingExperience}
                    </label>
                    <input
                      type="text"
                      name="drivingExperience"
                      value={formData.drivingExperience}
                      onChange={handleInputChange}
                      placeholder={t.placeholders?.drivingExperience}
                      className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 mb-2">
                      {t.fields.drivingLicenseIssuedOn}
                    </label>
                    <input
                      type="date"
                      name="drivingLicenseIssuedOn"
                      value={formData.drivingLicenseIssuedOn}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 mb-2">
                      {t.fields.drivingLicenseExpeiresOn}
                    </label>
                    <input
                      type="date"
                      name="drivingLicenseExpeiresOn"
                      value={formData.drivingLicenseExpeiresOn}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 mb-2">
                      {t.fields.dateOfBirth}
                    </label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 mb-2">
                      {t.fields.emergencyContact}
                    </label>
                    <input
                      type="text"
                      name="emergencyContact"
                      value={formData.emergencyContact}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm text-gray-300 mb-2">
                      {t.fields.address}
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm text-gray-300 mb-2">
                      {t.fields.notes}
                    </label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Personal Details */}
          <div className="border border-gray-700 rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection("personalDetails")}
              aria-label={t.buttons.toggle_section_aria}
              className="w-full flex items-center justify-between p-4 bg-gray-800 hover:bg-gray-700 transition-colors text-left"
            >
              <span className="text-white font-medium">
                {t.sections.personal_details}
              </span>
              {expandedSections.personalDetails ? (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronRight className="w-5 h-5 text-gray-400" />
              )}
            </button>

            {expandedSections.personalDetails && (
              <div className="p-6 bg-gray-800 border-t border-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">
                      {t.fields.passportType}
                    </label>
                    <input
                      type="text"
                      name="passportType"
                      value={formData.passportType}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 mb-2">
                      {t.fields.country}
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 mb-2">
                      {t.fields.issuedBy}
                    </label>
                    <input
                      type="text"
                      name="issuedBy"
                      value={formData.issuedBy}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 mb-2">
                      {t.fields.taxpayerId}
                    </label>
                    <input
                      type="text"
                      name="taxpayerId"
                      value={formData.taxpayerId}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm text-gray-300 mb-2">
                      {t.fields.registrationAddress}
                    </label>
                    <textarea
                      name="registrationAddress"
                      value={formData.registrationAddress}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ID Details */}
          <div className="border border-gray-700 rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection("idDetails")}
              aria-label={t.buttons.toggle_section_aria}
              className="w-full flex items-center justify-between p-4 bg-gray-800 hover:bg-gray-700 transition-colors text-left"
            >
              <span className="text-white font-medium">
                {t.sections.id_details}
              </span>
              {expandedSections.idDetails ? (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronRight className="w-5 h-5 text-gray-400" />
              )}
            </button>

            {expandedSections.idDetails && (
              <div className="p-6 bg-gray-800 border-t border-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">
                      {t.fields.idSeriesAndNumber}
                    </label>
                    <input
                      type="text"
                      name="idSeriesAndNumber"
                      value={formData.idSeriesAndNumber}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 mb-2">
                      {t.fields.primaryStateRegistrationNumber}
                    </label>
                    <input
                      type="text"
                      name="primaryStateRegistrationNumber"
                      value={formData.primaryStateRegistrationNumber}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 mb-2">
                      {t.fields.postCode}
                    </label>
                    <input
                      type="text"
                      name="postCode"
                      value={formData.postCode}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 mb-2">
                      {t.fields.iDIssuedOn}
                    </label>
                    <input
                      type="date"
                      name="iDIssuedOn"
                      value={formData.iDIssuedOn}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 mb-2">
                      {t.fields.iDexpiresOn}
                    </label>
                    <input
                      type="date"
                      name="iDexpiresOn"
                      value={formData.iDexpiresOn}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Save Button */}
          <div className="flex justify-center pt-6">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving || !selectedDriverId}
              aria-label={t.aria.save_button}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg transition-colors font-medium flex items-center space-x-2 disabled:opacity-50"
            >
              {saving && <Loader className="w-4 h-4 animate-spin" />}
              <Save className="w-4 h-4" />
              <span>{saving ? t.buttons.saving : t.buttons.save_details}</span>
            </button>
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
    </div>
  );
}
