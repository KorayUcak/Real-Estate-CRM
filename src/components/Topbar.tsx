"use client";

import { useState, useRef, useEffect } from "react";
import { Search, Bell, MoreHorizontal, Globe, X, Settings, Download, LogOut } from "lucide-react";

export default function Topbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <header className="h-[60px] border-b border-gray-200 bg-white flex items-center justify-between px-6 sticky top-0 z-30">
        <div className="flex flex-1 items-center max-w-xl">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-9 pr-3 py-2 border-none bg-gray-50 rounded-lg focus:ring-0 text-sm text-gray-900 placeholder-gray-400 outline-none"
              placeholder="Search by client, phone or property ID"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 ml-4">
          {/* Country */}
          <div className="hidden md:flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors">
            <Globe size={15} className="text-gray-400" />
            <span className="text-xs">United Arab Emirates</span>
          </div>

          <div className="h-5 w-px bg-gray-200 mx-1"></div>

          {/* Bell / Notifications */}
          <button
            onClick={() => setNotifOpen(true)}
            className="relative p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <Bell size={18} />
          </button>

          {/* 3-dot menu */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(v => !v)}
              className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors border border-gray-200"
            >
              <MoreHorizontal size={18} />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left">
                  <Settings size={15} className="text-gray-400" />
                  Settings
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left">
                  <Download size={15} className="text-gray-400" />
                  Export Data (CSV)
                </button>
                <div className="my-1 border-t border-gray-100"></div>
                <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 transition-colors text-left">
                  <LogOut size={15} className="text-rose-500" />
                  Log Out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Notification Drawer */}
      {notifOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-300"
            onClick={() => setNotifOpen(false)}
          />
          <div className="fixed right-0 top-0 h-full w-[380px] bg-white shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ease-out">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div>
                <h2 className="text-base font-semibold text-gray-900">Notifications</h2>
                <p className="text-xs text-gray-400 mt-0.5">Stay up to date</p>
              </div>
              <button
                onClick={() => setNotifOpen(false)}
                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-900 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mb-4">
                <Bell size={28} className="text-gray-300" />
              </div>
              <h3 className="text-sm font-semibold text-gray-700 mb-1">No new notifications</h3>
              <p className="text-xs text-gray-400 leading-relaxed max-w-[200px]">
                You&apos;re all caught up. Notifications about showings, new deals, and updates will appear here.
              </p>
            </div>
          </div>
        </>
      )}
    </>
  );
}
