"use client";

import { useState } from "react";
import {
  RefreshCw,
  Eye,
  Heart,
  Activity,
  Search,
  Home,
  ExternalLink,
  Clock,
} from "lucide-react";

// ─── Mock Data ────────────────────────────────────────────────────────────────

interface SyncedProperty {
  id: number;
  sahibindenId: string;
  title: string;
  location: string;
  type: "Sale" | "Rent";
  price: string;
  views: number;
  favorites: number;
  lastSync: string;
  status: "Active on Site" | "Draft" | "Pending";
  thumbColor: string; // gradient placeholder for thumbnail
}

const PROPERTIES: SyncedProperty[] = [
  {
    id: 1,
    sahibindenId: "#10948329",
    title: "4 Bed Luxury Villa – Ovacık",
    location: "Ovacık, Fethiye, Muğla",
    type: "Sale",
    price: "₺18,500,000",
    views: 1240,
    favorites: 87,
    lastSync: "2 min ago",
    status: "Active on Site",
    thumbColor: "from-sky-200 to-blue-400",
  },
  {
    id: 2,
    sahibindenId: "#10951847",
    title: "Modern Duplex Apartment – Çalış Beach",
    location: "Çalış, Fethiye, Muğla",
    type: "Sale",
    price: "₺7,250,000",
    views: 890,
    favorites: 54,
    lastSync: "8 min ago",
    status: "Active on Site",
    thumbColor: "from-emerald-200 to-teal-400",
  },
  {
    id: 3,
    sahibindenId: "#10963102",
    title: "Seafront Studio – Ölüdeniz",
    location: "Ölüdeniz, Fethiye, Muğla",
    type: "Rent",
    price: "₺32,000/mo",
    views: 2690,
    favorites: 171,
    lastSync: "14 min ago",
    status: "Active on Site",
    thumbColor: "from-amber-200 to-orange-400",
  },
  {
    id: 4,
    sahibindenId: "#10970488",
    title: "3+1 Garden Flat – Hisarönü",
    location: "Hisarönü, Fethiye, Muğla",
    type: "Sale",
    price: "₺5,900,000",
    views: 310,
    favorites: 18,
    lastSync: "1h ago",
    status: "Draft",
    thumbColor: "from-violet-200 to-purple-400",
  },
  {
    id: 5,
    sahibindenId: "—",
    title: "Penthouse Suite – Karagözler",
    location: "Karagözler, Fethiye, Muğla",
    type: "Sale",
    price: "₺24,000,000",
    views: 0,
    favorites: 0,
    lastSync: "—",
    status: "Pending",
    thumbColor: "from-gray-200 to-gray-400",
  },
];

const KPI_DATA = [
  { label: "Total Synced Listings", value: "14", sub: "Active", icon: Home, color: "text-indigo-600" },
  { label: "Immo Views This Week", value: "4,820", sub: "+18% vs last week", icon: Eye, color: "text-emerald-600" },
  { label: "Total Listing Favorites", value: "312", sub: "Across all listings", icon: Heart, color: "text-rose-500" },
  { label: "API Health Status", value: "100%", sub: "Sync Rate", icon: Activity, color: "text-emerald-600" },
];

const STATUS_TABS = ["All", "Active on Site", "Drafts/Pending"] as const;

// ─── Component ────────────────────────────────────────────────────────────────

export default function SahibindenPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [syncing, setSyncing] = useState(false);

  function handleSync() {
    setSyncing(true);
    setTimeout(() => setSyncing(false), 2000);
  }

  const filtered = PROPERTIES.filter(p => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sahibindenId.includes(searchQuery);

    const matchesFilter =
      activeFilter === "All" ||
      (activeFilter === "Active on Site" && p.status === "Active on Site") ||
      (activeFilter === "Drafts/Pending" && (p.status === "Draft" || p.status === "Pending"));

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6 overflow-hidden">
      {/* ── Header ── */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold text-gray-900">Sahibinden.com Listing Sync</h1>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                API Connected
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1">Manage your Kurumsal property feed</p>
          </div>
        </div>

        <button
          onClick={handleSync}
          disabled={syncing}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-sm transition-all disabled:opacity-60"
        >
          <RefreshCw size={15} className={syncing ? "animate-spin" : ""} />
          {syncing ? "Syncing..." : "Sync Now"}
        </button>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {KPI_DATA.map(kpi => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.label} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">{kpi.label}</p>
                <Icon size={16} className={`${kpi.color} opacity-60`} />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-0.5">{kpi.value}</div>
              <p className="text-[11px] text-gray-400 font-medium">{kpi.sub}</p>
            </div>
          );
        })}
      </div>

      {/* ── Filters ── */}
      <div className="flex items-center justify-between gap-4">
        {/* Status Tabs */}
        <div className="flex bg-gray-100 rounded-lg p-0.5">
          {STATUS_TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`px-4 py-1.5 rounded-md text-[13px] font-medium transition-all
                ${activeFilter === tab
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-72">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Filter synced listings..."
            className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all"
          />
        </div>
      </div>

      {/* ── Data Table ── */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap w-[60px]">Image</th>
                <th className="px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap min-w-[240px]">Property</th>
                <th className="px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Sahibinden ID</th>
                <th className="px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Type</th>
                <th className="px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Price</th>
                <th className="px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Views</th>
                <th className="px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Favorites</th>
                <th className="px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Status</th>
                <th className="px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Last Sync</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(property => (
                <tr key={property.id} className="hover:bg-gray-50/80 transition-colors group">
                  {/* Thumbnail */}
                  <td className="px-4 py-3">
                    <div className={`w-12 h-9 rounded-lg bg-gradient-to-br ${property.thumbColor} shadow-sm flex items-center justify-center`}>
                      <Home size={14} className="text-white/70" />
                    </div>
                  </td>

                  {/* Property Title */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div>
                      <span className="text-sm font-semibold text-gray-900 group-hover:text-indigo-700 transition-colors">{property.title}</span>
                      <p className="text-[11px] text-gray-400 mt-0.5">{property.location}</p>
                    </div>
                  </td>

                  {/* Sahibinden ID */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    {property.sahibindenId !== "—" ? (
                      <span className="inline-flex items-center gap-1 text-sm font-mono font-medium text-gray-700">
                        {property.sahibindenId}
                        <ExternalLink size={11} className="text-gray-300 group-hover:text-indigo-400 transition-colors" />
                      </span>
                    ) : (
                      <span className="text-xs text-gray-300">Not assigned</span>
                    )}
                  </td>

                  {/* Type */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full
                      ${property.type === "Sale" ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700"}`}>
                      {property.type}
                    </span>
                  </td>

                  {/* Price */}
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-gray-900">{property.price}</td>

                  {/* Views */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 text-sm text-gray-600">
                      <Eye size={13} className="text-gray-300" />
                      {property.views.toLocaleString()}
                    </span>
                  </td>

                  {/* Favorites */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 text-sm text-gray-600">
                      <Heart size={13} className="text-rose-300" />
                      {property.favorites}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full
                      ${property.status === "Active on Site" ? "bg-emerald-100 text-emerald-700" : ""}
                      ${property.status === "Draft" ? "bg-gray-100 text-gray-500" : ""}
                      ${property.status === "Pending" ? "bg-amber-100 text-amber-700" : ""}
                    `}>
                      {property.status === "Active on Site" && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
                      {property.status}
                    </span>
                  </td>

                  {/* Last Sync */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 text-[12px] text-gray-400">
                      <Clock size={11} className="text-gray-300" />
                      {property.lastSync}
                    </span>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center text-sm text-gray-400">
                    No listings match your current filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="px-4 py-3 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
          <p className="text-[12px] text-gray-500">
            Showing <span className="font-semibold text-gray-700">{filtered.length}</span> of{" "}
            <span className="font-semibold text-gray-700">{PROPERTIES.length}</span> synced listings
          </p>
          <p className="text-[11px] text-gray-400">Feed last refreshed 2 min ago</p>
        </div>
      </div>
    </div>
  );
}
