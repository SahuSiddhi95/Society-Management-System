import React from "react";
import { NavLink, Outlet, useOutletContext } from "react-router-dom";

export default function UserSettingsLayout() {
  const context = useOutletContext();
  const tabs = [
    { name: "My Profile", path: "profile" },
    { name: "Emergency Contacts", path: "emergency" },
    { name: "Maintenance Details", path: "maintenance" },
  ];

  return (
    <div className="max-w-7xl mx-auto w-full h-full flex flex-col md:flex-row gap-8">
      {/* Sidebar Navigation for Settings */}
      <div className="w-full md:w-64 shrink-0">
        <h2 className="text-lg font-bold text-gray-900 mb-4 px-2">Settings & Info</h2>
        <nav className="flex md:flex-col gap-1 overflow-x-auto pb-2 md:pb-0">
          {tabs.map((tab) => (
            <NavLink
              key={tab.path}
              to={tab.path}
              className={({ isActive }) =>
                `px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors whitespace-nowrap ${
                  isActive
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`
              }
            >
              {tab.name}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Main Content Area for the selected setting */}
      <div className="flex-1 min-w-0">
        <Outlet context={context} />
      </div>
    </div>
  );
}
