// src/Components/Dashboard/add-vehicle-form.jsx
import { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { selectLanguageCode } from "../../Redux/LanguageSlice/languageSlice";
import translations from "./json/add-vehicle-form.json"; // using your vehicle i18n file
import { ChevronDown, ChevronRight, ArrowLeft, Save, Loader, Plus, X } from "lucide-react";

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

export default function AddVehicleForm({ onBack, onSubmit }) {
  const lang = useSelector(selectLanguageCode);
  const t = useMemo(() => translations[lang] || translations.en, [lang]);

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Details section - matching controller fields
    status: "active",
    plateNumber: "",
    make: "",
    VIN: "",
    model: "",
    bodyNumber: "",
    color: "",
    license: "",
    seats: "",
    registrationCertificate: "",

    // Vehicle Code section
    code: "",

    // Facilities section - separate model (VehicleFacility)
    facilities: [""],

    // Additional fields that might be needed
    driverId: "",
    transmission: "",
  });

  const [expandedSections, setExpandedSections] = useState({
    details: true,
    vehicleCode: false,
    facilities: false,
    optionsBrandings: false,
  });

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

  const addFacility = () => {
    setFormData((prev) => ({
      ...prev,
      facilities: [...prev.facilities, ""],
    }));
  };

  const removeFacility = (index) => {
    setFormData((prev) => ({
      ...prev,
      facilities: prev.facilities.filter((_, i) => i !== index),
    }));
  };

  const updateFacility = (index, value) => {
    setFormData((prev) => ({
      ...prev,
      facilities: prev.facilities.map((facility, i) =>
        i === index ? value : facility
      ),
    }));
  };

  const validateForm = () => {
    const errors = [];

    if (!formData.plateNumber.trim()) errors.push(t.validation.plate_required);
    if (!formData.make.trim()) errors.push(t.validation.make_required);
    if (!formData.model.trim()) errors.push(t.validation.model_required);
    if (!formData.VIN.trim()) errors.push(t.validation.vin_required);

    if (errors.length > 0) {
      errors.forEach((error) => showToast(error, "error"));
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);
      const submitData = {
        plateNumber: formData.plateNumber,
        make: formData.make,
        model: formData.model,
        color: formData.color,
        seats: formData.seats ? parseInt(formData.seats) : null,
        VIN: formData.VIN,
        bodyNumber: formData.bodyNumber,
        license: formData.license,
        registrationCertificate: formData.registrationCertificate,
        code: formData.code,
        driverId: formData.driverId || null,
        facilities: formData.facilities.filter((f) => f.trim() !== ""),
        transmission: formData.transmission || null,
        status: formData.status,
      };
      await onSubmit(submitData);
      showToast(t.toasts.success_add, "success");
    } catch (err) {
      showToast(err?.message || t.toasts.error_add, "error");
    } finally {
      setLoading(false);
    }
  };

  // Helpers to render selects from JSON options
  const renderOptions = (optionsObj) =>
    Object.entries(optionsObj).map(([value, label]) => (
      <option key={value} value={value}>
        {label}
      </option>
    ));

  return (
    <div className="flex-1 bg-gray-900 text-white overflow-auto">
      {/* Header */}
      <div className="border-b border-gray-700 p-6">
        <div className="flex items-center text-sm text-gray-400 mb-4">
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
        </div>
        <h1 className="text-2xl font-bold text-white">{t.header.title}</h1>
      </div>

      <div className="p-6 max-w-6xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Vehicle Details Section */}
          <div className="border border-gray-700 rounded-lg overflow-hidden">
            <button
              type="button"
              aria-label={t.buttons.toggle_section_aria}
              onClick={() => toggleSection("details")}
              className="w-full flex items-center justify-between p-4 bg-gray-800 hover:bg-gray-700 transition-colors text-left"
            >
              <span className="text-white font-medium">
                {t.sections.vehicle_details}
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
                  {/* Left Column */}
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm text-gray-300 mb-2">
                        {t.fields.status}
                      </label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        aria-label={t.aria.status_select}
                        className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
                        required
                      >
                        <option value="">{t.selects.status.placeholder}</option>
                        {renderOptions(t.selects.status.options)}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-300 mb-2">
                        {t.fields.make}
                      </label>
                      <select
                        name="make"
                        value={formData.make}
                        onChange={handleInputChange}
                        aria-label={t.aria.make_select}
                        className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
                        required
                      >
                        <option value="">{t.selects.make.placeholder}</option>
                        {renderOptions(t.selects.make.options)}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-300 mb-2">
                        {t.fields.model}
                      </label>
                      <select
                        name="model"
                        value={formData.model}
                        onChange={handleInputChange}
                        aria-label={t.aria.model_select}
                        className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
                        required
                      >
                        <option value="">{t.selects.model.placeholder}</option>
                        {renderOptions(t.selects.model.options)}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-300 mb-2">
                        {t.fields.color}
                      </label>
                      <select
                        name="color"
                        value={formData.color}
                        onChange={handleInputChange}
                        aria-label={t.aria.color_select}
                        className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
                      >
                        <option value="">{t.selects.color.placeholder}</option>
                        {renderOptions(t.selects.color.options)}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-300 mb-2">
                        {t.fields.seats}
                      </label>
                      <input
                        type="number"
                        name="seats"
                        value={formData.seats}
                        onChange={handleInputChange}
                        placeholder={t.placeholders.seats}
                        min="1"
                        max="50"
                        className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm text-gray-300 mb-2">
                        {t.fields.plate_number}
                      </label>
                      <input
                        type="text"
                        name="plateNumber"
                        value={formData.plateNumber}
                        onChange={handleInputChange}
                        placeholder={t.placeholders.plate_number}
                        className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-300 mb-2">
                        {t.fields.vin}
                      </label>
                      <input
                        type="text"
                        name="VIN"
                        value={formData.VIN}
                        onChange={handleInputChange}
                        placeholder={t.placeholders.vin}
                        className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500 font-mono"
                        maxLength={17}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-300 mb-2">
                        {t.fields.body_number}
                      </label>
                      <input
                        type="text"
                        name="bodyNumber"
                        value={formData.bodyNumber}
                        onChange={handleInputChange}
                        placeholder={t.placeholders.body_number}
                        className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-300 mb-2">
                        {t.fields.license}
                      </label>
                      <input
                        type="text"
                        name="license"
                        value={formData.license}
                        onChange={handleInputChange}
                        placeholder={t.placeholders.license}
                        className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-300 mb-2">
                        {t.fields.registration_certificate}
                      </label>
                      <input
                        type="text"
                        name="registrationCertificate"
                        value={formData.registrationCertificate}
                        onChange={handleInputChange}
                        placeholder={t.placeholders.registration_certificate}
                        className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Vehicle Code Section */}
          <div className="border border-gray-700 rounded-lg overflow-hidden">
            <button
              type="button"
              aria-label={t.buttons.toggle_section_aria}
              onClick={() => toggleSection("vehicleCode")}
              className="w-full flex items-center justify-between p-4 bg-gray-800 hover:bg-gray-700 transition-colors text-left"
            >
              <span className="text-white font-medium">
                {t.sections.vehicle_code}
              </span>
              {expandedSections.vehicleCode ? (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronRight className="w-5 h-5 text-gray-400" />
              )}
            </button>

            {expandedSections.vehicleCode && (
              <div className="p-6 bg-gray-800 border-t border-gray-700">
                <div>
                  <label className="block text-sm text-gray-300 mb-2">
                    {t.fields.code}
                  </label>
                  <input
                    type="text"
                    name="code"
                    value={formData.code}
                    onChange={handleInputChange}
                    placeholder={t.placeholders.code}
                    className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Facilities Section */}
          <div className="border border-gray-700 rounded-lg overflow-hidden">
            <button
              type="button"
              aria-label={t.buttons.toggle_section_aria}
              onClick={() => toggleSection("facilities")}
              className="w-full flex items-center justify-between p-4 bg-gray-800 hover:bg-gray-700 transition-colors text-left"
            >
              <span className="text-white font-medium">
                {t.sections.facilities}
              </span>
              {expandedSections.facilities ? (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronRight className="w-5 h-5 text-gray-400" />
              )}
            </button>

            {expandedSections.facilities && (
              <div className="p-6 bg-gray-800 border-t border-gray-700">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="block text-sm text-gray-300">
                      {t.lists.facilities_header_add}
                    </label>
                    <button
                      type="button"
                      onClick={addFacility}
                      className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition-colors text-sm"
                    >
                      <Plus className="w-4 h-4" />
                      <span>{t.buttons.add_facility}</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {formData.facilities.map((facility, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <input
                          type="text"
                          value={facility}
                          onChange={(e) => updateFacility(index, e.target.value)}
                          placeholder={t.placeholders.facility_item}
                          className="flex-1 bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
                        />
                        {formData.facilities.length > 1 && (
                          <button
                            type="button"
                            aria-label={t.buttons.remove_facility_aria}
                            onClick={() => removeFacility(index)}
                            className="text-red-400 hover:text-red-300 p-2"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Options & Brandings Section */}
          <div className="border border-gray-700 rounded-lg overflow-hidden">
            <button
              type="button"
              aria-label={t.buttons.toggle_section_aria}
              onClick={() => toggleSection("optionsBrandings")}
              className="w-full flex items-center justify-between p-4 bg-gray-800 hover:bg-gray-700 transition-colors text-left"
            >
              <span className="text-white font-medium">
                {t.sections.options_brandings}
              </span>
              {expandedSections.optionsBrandings ? (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronRight className="w-5 h-5 text-gray-400" />
              )}
            </button>

            {expandedSections.optionsBrandings && (
              <div className="p-6 bg-gray-800 border-t border-gray-700">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">
                      {t.fields.transmission}
                    </label>
                    <input
                      type="text"
                      name="transmission"
                      value={formData.transmission}
                      onChange={handleInputChange}
                      placeholder={t.placeholders.transmission}
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
              type="submit"
              disabled={loading}
              aria-label={t.aria.submit_button}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg transition-colors font-medium flex items-center space-x-2 disabled:opacity-50"
            >
              {loading && (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  <span className="sr-only">{t.aria.loading}</span>
                </>
              )}
              <Save className="w-4 h-4" />
              <span>{t.buttons.submit}</span>
            </button>
          </div>
        </form>
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
