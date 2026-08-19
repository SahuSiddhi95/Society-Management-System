import React from "react";
import { useOutletContext } from "react-router-dom";

export default function UserProfile() {
  const { user } = useOutletContext();

  if (!user) return null;

  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-300">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">My Profile</h1>
        <p className="text-sm text-gray-500 mt-1">View your registered details and family members.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-lg font-bold text-gray-900">Personal Information</h2>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Full Name</label>
            <p className="text-sm font-semibold text-gray-800">{user.name}</p>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Email Address</label>
            <p className="text-sm font-semibold text-gray-800">{user.email}</p>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Phone Number</label>
            <p className="text-sm font-semibold text-gray-800">{user.phone}</p>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Flat Type</label>
            <p className="text-sm font-semibold text-gray-800">{user.flatType || "N/A"}</p>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Flat No</label>
            <p className="text-sm font-semibold text-gray-800">{user.flatNo}</p>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Floor</label>
            <p className="text-sm font-semibold text-gray-800">{user.floor || "N/A"}</p>
          </div>
        </div>
      </div>

      {user.familyMembers && user.familyMembers.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50">
            <h2 className="text-lg font-bold text-gray-900">Family Members ({user.familyMembersCount})</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {user.familyMembers.map((member, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-gray-100 bg-gray-50 flex flex-col gap-1">
                  <p className="text-sm font-bold text-gray-800">{member.name}</p>
                  <div className="flex items-center gap-3 text-xs font-semibold">
                    <span className="text-gray-500 uppercase">{member.relation}</span>
                    <span className="text-gray-300">•</span>
                    <span className="text-indigo-600">{member.age} yrs</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
