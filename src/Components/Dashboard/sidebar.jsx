"use client";

import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectLanguageCode } from "../../Redux/LanguageSlice/languageSlice";

import tjson from "./json/sidebar.json";

import {
  Car,
  Users,
  FileText,
  DollarSign,
  ShoppingCart,
  MapPin,
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

// Stable NAV KEYS (do not localize these)
const RAW_ITEMS = [
  { key: "dashboard", icon: FileText, type: "link" },
  { key: "staff", icon: Users, type: "link" },
  { key: "vehicles", icon: Car, type: "link" },
  {
    key: "report",
    icon: FileText,
    type: "parent",
    children: [
      { key: "earning_report", icon: DollarSign, type: "link" },
      // { key: "order_report", icon: ShoppingCart, type: "link" },
      { key: "ride_report", icon: MapPin, type: "link" },
    ],
  },
  { key: "settings", icon: Settings, type: "link", bottom: true },
  { key: "logout", icon: LogOut, type: "logout", bottom: true },
];

// Auth utils (same behavior as before, but don't clear redux language)
const clearUserFromStorage = () => {
  try {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
  } catch {}
};

export default function Sidebar({ activeTab, onTabChange, onLogout }) {
  const navigate = useNavigate();

  // i18n
  const langCode = useSelector(selectLanguageCode); // 'en' | 'ru'
  const t = useMemo(() => tjson?.[langCode] || tjson.en, [langCode]);
  const tr = (tpl = "", vars = {}) =>
    tpl.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, k) => `${vars[k] ?? ""}`);

  // Map items to localized labels (display only)
  const items = useMemo(() => {
    const label = t.nav;
    return RAW_ITEMS.map((it) => ({
      ...it,
      name: label[it.key] ?? it.key, // localized label for UI
      children: it.children?.map((c) => ({
        ...c,
        name: label[c.key] ?? c.key, // localized child label
      })),
    }));
  }, [t]);

  // Auto-expand "Report" when a report child KEY is active
  const [reportExpanded, setReportExpanded] = useState(false);
  useEffect(() => {
    const report = items.find((i) => i.key === "report");
    if (!report) return;
    const childKeys = new Set(report.children?.map((c) => c.key) || []);
    setReportExpanded(childKeys.has(activeTab));
  }, [items, activeTab]);

  const handleLogout = () => {
    if (window.confirm(tr(t.confirm.logout_message))) {
      clearUserFromStorage();
      onLogout?.();
      navigate("/login");
    }
  };

  const handleItemClick = (item) => {
    if (item.type === "parent" && item.key === "report") {
      setReportExpanded((prev) => !prev);
      return;
    }
    if (item.type === "logout") {
      handleLogout();
      return;
    }
    // Send STABLE KEY up
    onTabChange?.(item.key);
  };

  return (
    <aside
      className="w-64 bg-gray-800 flex flex-col h-full"
      aria-label={t.aria.sidebar}
    >
      {/* Branding */}
      <div className="p-6 border-b border-gray-700">
        <h1 className="text-xl font-bold text-blue-400">{t.branding.app_name}</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {items
            .filter((i) => !i.bottom)
            .map((item) => (
              <li key={item.key}>
                {item.type === "link" && (
                  <button
                    onClick={() => handleItemClick(item)}
                    title={t.tooltips[item.key] || ""}
                    aria-label={tr(t.aria.navigate_to, { label: item.name })}
                    className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-colors ${
                      item.key === activeTab
                        ? "bg-blue-600 text-white"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white"
                    }`}
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    {item.name}
                  </button>
                )}

                {item.type === "parent" && (
                  <>
                    <button
                      onClick={() => handleItemClick(item)}
                      title={
                        reportExpanded
                          ? t.aria.close_report_menu
                          : t.aria.open_report_menu
                      }
                      aria-expanded={reportExpanded}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-colors ${
                        reportExpanded
                          ? "bg-gray-700 text-white"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white"
                      }`}
                    >
                      <div className="flex items-center">
                        <item.icon className="w-5 h-5 mr-3" />
                        {item.name}
                      </div>
                      {reportExpanded ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </button>

                    {reportExpanded && item.children && (
                      <ul className="ml-6 mt-2 space-y-2">
                        {item.children.map((child) => (
                          <li key={child.key}>
                            <button
                              onClick={() => handleItemClick(child)}
                              title={t.tooltips[child.key] || ""}
                              aria-label={tr(t.aria.navigate_to, {
                                label: child.name,
                              })}
                              className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-colors ${
                                child.key === activeTab
                                  ? "bg-blue-600 text-white"
                                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
                              }`}
                            >
                              <child.icon className="w-5 h-5 mr-3" />
                              {child.name}
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                )}
              </li>
            ))}
        </ul>
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-gray-700">
        {items
          .filter((i) => i.bottom)
          .map((item) => (
            <button
              key={item.key}
              onClick={() => handleItemClick(item)}
              title={t.tooltips[item.key] || ""}
              aria-label={
                item.key === "logout"
                  ? t.aria.logout
                  : tr(t.aria.navigate_to, { label: item.name })
              }
              className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors mb-2 last:mb-0 ${
                item.type === "logout"
                  ? "text-red-400 hover:bg-red-900/20 hover:text-red-300"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.name}
            </button>
          ))}
      </div>
    </aside>
  );
}
