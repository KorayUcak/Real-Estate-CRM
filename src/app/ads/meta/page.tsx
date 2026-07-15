"use client";

import { useState, useRef, useEffect } from "react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Search,
  SlidersHorizontal,
  TrendingUp,
  TrendingDown,
  Pause,
  Play,
  X,
  Check,
  Image,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface RowData {
  id: number;
  name: string;
  status: "Active" | "Paused";
  delivery: string;
  budget: string;
  budgetType: "Daily" | "Lifetime";
  spent: string;
  frequency: string;
  cpc: string;
  ctr: string;
  leads: number;
  creative?: string;
}

// ─── Mock Data — Campaigns ────────────────────────────────────────────────────

const CAMPAIGNS: RowData[] = [
  {
    id: 1,
    name: "Retargeting – Fethiye Villas",
    status: "Active",
    delivery: "Active",
    budget: "$120/day",
    budgetType: "Daily",
    spent: "$2,847.50",
    frequency: "2.4",
    cpc: "$0.82",
    ctr: "1.83%",
    leads: 34,
  },
  {
    id: 2,
    name: "Broad – UK Investors | Coastal Properties",
    status: "Active",
    delivery: "Active",
    budget: "$85/day",
    budgetType: "Daily",
    spent: "$1,962.30",
    frequency: "1.7",
    cpc: "$1.24",
    ctr: "1.15%",
    leads: 19,
  },
  {
    id: 3,
    name: "Lookalike – High-Net-Worth Buyers",
    status: "Active",
    delivery: "Learning",
    budget: "$200/day",
    budgetType: "Daily",
    spent: "$4,120.00",
    frequency: "3.1",
    cpc: "$0.67",
    ctr: "2.41%",
    leads: 58,
  },
  {
    id: 4,
    name: "Seasonal – Summer 2026 Launch",
    status: "Paused",
    delivery: "Off",
    budget: "$5,000",
    budgetType: "Lifetime",
    spent: "$3,215.80",
    frequency: "4.8",
    cpc: "$1.56",
    ctr: "0.92%",
    leads: 12,
  },
];

// ─── Mock Data — Ad Sets ──────────────────────────────────────────────────────

const AD_SETS: RowData[] = [
  {
    id: 101,
    name: "UK Expats – 35-55 | Interest: Coastal",
    status: "Active",
    delivery: "Active",
    budget: "$45/day",
    budgetType: "Daily",
    spent: "$1,024.00",
    frequency: "2.1",
    cpc: "$0.94",
    ctr: "1.47%",
    leads: 14,
  },
  {
    id: 102,
    name: "Local Lookalikes – 1% | High Value",
    status: "Active",
    delivery: "Learning",
    budget: "$80/day",
    budgetType: "Daily",
    spent: "$2,360.00",
    frequency: "1.9",
    cpc: "$0.71",
    ctr: "2.18%",
    leads: 29,
  },
  {
    id: 103,
    name: "Retargeting – Website Visitors 30d",
    status: "Active",
    delivery: "Active",
    budget: "$60/day",
    budgetType: "Daily",
    spent: "$1,580.50",
    frequency: "3.6",
    cpc: "$0.58",
    ctr: "2.94%",
    leads: 22,
  },
  {
    id: 104,
    name: "Cold – German Investors | 40-60",
    status: "Paused",
    delivery: "Off",
    budget: "$2,000",
    budgetType: "Lifetime",
    spent: "$1,840.00",
    frequency: "5.2",
    cpc: "$1.88",
    ctr: "0.74%",
    leads: 6,
  },
];

// ─── Mock Data — Ads ──────────────────────────────────────────────────────────

const ADS: RowData[] = [
  {
    id: 201,
    name: "Villa Video Tour Carousel",
    status: "Active",
    delivery: "Active",
    budget: "—",
    budgetType: "Daily",
    spent: "$980.40",
    frequency: "2.2",
    cpc: "$0.64",
    ctr: "2.67%",
    leads: 18,
    creative: "Carousel",
  },
  {
    id: 202,
    name: "Lead Form Image Ad – Coastal Sunset",
    status: "Active",
    delivery: "Active",
    budget: "—",
    budgetType: "Daily",
    spent: "$1,420.00",
    frequency: "1.8",
    cpc: "$0.89",
    ctr: "1.52%",
    leads: 21,
    creative: "Single Image",
  },
  {
    id: 203,
    name: "Testimonial Reel – Happy Buyers 2026",
    status: "Active",
    delivery: "Learning",
    budget: "—",
    budgetType: "Daily",
    spent: "$640.20",
    frequency: "1.3",
    cpc: "$1.12",
    ctr: "1.91%",
    leads: 8,
    creative: "Video",
  },
  {
    id: 204,
    name: "Price Drop Alert – Static Banner",
    status: "Paused",
    delivery: "Off",
    budget: "—",
    budgetType: "Daily",
    spent: "$310.80",
    frequency: "4.1",
    cpc: "$1.74",
    ctr: "0.68%",
    leads: 3,
    creative: "Single Image",
  },
];

// ─── KPIs ─────────────────────────────────────────────────────────────────────

const KPI_DATA = [
  { label: "Total Spend", value: "$12,145.60", change: "+8.3%", positive: true },
  { label: "Impressions", value: "482,910", change: "+12.7%", positive: true },
  { label: "Cost Per Lead", value: "$7.42", change: "-4.1%", positive: true },
  { label: "ROAS", value: "4.8x", change: "+0.6x", positive: true },
  { label: "Leads Generated", value: "123", change: "+23%", positive: true },
];

// ─── Columns Config ───────────────────────────────────────────────────────────

const ALL_COLUMNS = [
  { key: "status", label: "Status", default: true },
  { key: "name", label: "Name", default: true },
  { key: "delivery", label: "Delivery", default: true },
  { key: "budget", label: "Budget", default: true },
  { key: "spent", label: "Amount Spent", default: true },
  { key: "frequency", label: "Frequency", default: true },
  { key: "cpc", label: "Cost Per Click (CPC)", default: true },
  { key: "ctr", label: "Outbound CTR", default: true },
  { key: "leads", label: "Leads", default: true },
  { key: "creative", label: "Creative Type", default: false },
  { key: "cpm", label: "CPM", default: false },
  { key: "linkClicks", label: "Link Clicks", default: false },
  { key: "purchases", label: "Pixel Purchases", default: false },
  { key: "costPerResult", label: "Cost per Result", default: false },
  { key: "reach", label: "Reach", default: false },
  { key: "videoViews", label: "Video Views (ThruPlay)", default: false },
];

const TABS = ["Campaigns", "Ad Sets", "Ads"] as const;

const DATE_PRESETS = ["Today", "Yesterday", "Last 7 Days", "Last 30 Days", "Last Month", "This Year"];

// ─── Calendar Helper ──────────────────────────────────────────────────────────

function getCalendarDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const blanks = Array.from({ length: firstDay }, () => 0);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  return [...blanks, ...days];
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function MetaAdsPage() {
  const [activeTab, setActiveTab] = useState<string>("Campaigns");
  const [searchQuery, setSearchQuery] = useState("");
  const [columnsOpen, setColumnsOpen] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState("Last 30 Days");
  const [calMonth, setCalMonth] = useState(5); // June = 5 (0-indexed)
  const [calYear, setCalYear] = useState(2026);
  const datePickerRef = useRef<HTMLDivElement>(null);

  const [enabledColumns, setEnabledColumns] = useState<Record<string, boolean>>(
    Object.fromEntries(ALL_COLUMNS.map(c => [c.key, c.default]))
  );

  const allRows = [...CAMPAIGNS, ...AD_SETS, ...ADS];
  const [statuses, setStatuses] = useState<Record<number, "Active" | "Paused">>(
    Object.fromEntries(allRows.map(r => [r.id, r.status]))
  );

  // Close date picker on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (datePickerRef.current && !datePickerRef.current.contains(e.target as Node)) {
        setShowDatePicker(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Pick data based on active tab
  const sourceData: RowData[] =
    activeTab === "Campaigns" ? CAMPAIGNS :
    activeTab === "Ad Sets" ? AD_SETS : ADS;

  const filtered = sourceData.filter(r =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const tabLabel =
    activeTab === "Campaigns" ? "campaigns" :
    activeTab === "Ad Sets" ? "ad sets" : "ads";

  function toggleStatus(id: number) {
    setStatuses(prev => ({
      ...prev,
      [id]: prev[id] === "Active" ? "Paused" : "Active",
    }));
  }

  function toggleColumn(key: string) {
    setEnabledColumns(prev => ({ ...prev, [key]: !prev[key] }));
  }

  const calDays = getCalendarDays(calYear, calMonth);
  const monthName = new Date(calYear, calMonth).toLocaleString("en-US", { month: "long", year: "numeric" });

  return (
    <div className="space-y-6 overflow-hidden">
      {/* ── Header ── */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Meta Ads Performance</h1>
          <p className="text-sm text-gray-500 mt-1">Campaign analytics and lead attribution</p>
        </div>

        {/* Date Picker */}
        <div className="relative" ref={datePickerRef}>
          <button
            onClick={() => setShowDatePicker(v => !v)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
          >
            {selectedPreset}
            <ChevronDown size={14} className={`text-gray-400 transition-transform duration-200 ${showDatePicker ? "rotate-180" : ""}`} />
          </button>

          {showDatePicker && (
            <div className="absolute right-0 top-full mt-2 w-[480px] bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 flex overflow-hidden">
              {/* Left: Presets */}
              <div className="w-[160px] border-r border-gray-100 py-3 flex flex-col">
                <p className="px-4 pb-2 text-[10px] font-semibold uppercase tracking-wider text-gray-400">Quick Select</p>
                {DATE_PRESETS.map(preset => (
                  <button
                    key={preset}
                    onClick={() => { setSelectedPreset(preset); setShowDatePicker(false); }}
                    className={`w-full text-left px-4 py-2 text-[13px] font-medium transition-colors
                      ${selectedPreset === preset
                        ? "bg-indigo-50 text-indigo-700"
                        : "text-gray-600 hover:bg-gray-50"
                      }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>

              {/* Right: Calendar */}
              <div className="flex-1 p-4">
                <div className="flex items-center justify-between mb-4">
                  <button
                    onClick={() => { if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1); } else setCalMonth(m => m - 1); }}
                    className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <span className="text-sm font-semibold text-gray-900">{monthName}</span>
                  <button
                    onClick={() => { if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1); } else setCalMonth(m => m + 1); }}
                    className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>

                {/* Weekday headers */}
                <div className="grid grid-cols-7 mb-1">
                  {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(d => (
                    <div key={d} className="text-center text-[10px] font-semibold text-gray-400 uppercase tracking-wider py-1">{d}</div>
                  ))}
                </div>

                {/* Days grid */}
                <div className="grid grid-cols-7 gap-px">
                  {calDays.map((day, i) => (
                    <button
                      key={i}
                      disabled={day === 0}
                      className={`h-8 rounded-lg text-[12px] font-medium transition-colors
                        ${day === 0 ? "" : "hover:bg-indigo-50 hover:text-indigo-700 text-gray-700"}`}
                    >
                      {day > 0 ? day : ""}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {KPI_DATA.map(kpi => (
          <div key={kpi.label} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-2">{kpi.label}</p>
            <div className="text-xl font-bold text-gray-900 mb-1">{kpi.value}</div>
            <div className={`flex items-center gap-1 text-[11px] font-semibold ${kpi.positive ? "text-emerald-600" : "text-rose-600"}`}>
              {kpi.positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {kpi.change} vs last month
            </div>
          </div>
        ))}
      </div>

      {/* ── Tabs ── */}
      <div className="border-b border-gray-200">
        <div className="flex gap-0">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors
                ${activeTab === tab
                  ? "border-indigo-600 text-indigo-700"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* ── Action Bar ── */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={`Search ${tabLabel}...`}
            className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all"
          />
        </div>
        <button
          onClick={() => setColumnsOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <SlidersHorizontal size={14} className="text-gray-400" />
          Customize Columns
        </button>
      </div>

      {/* ── Data Table ── */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="w-full overflow-x-auto pb-4">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                {enabledColumns.status && <th className="px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap w-[80px]">Status</th>}
                {enabledColumns.name && <th className="px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap min-w-[260px]">Name</th>}
                {enabledColumns.creative && <th className="px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Creative</th>}
                {enabledColumns.delivery && <th className="px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Delivery</th>}
                {enabledColumns.budget && <th className="px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Budget</th>}
                {enabledColumns.spent && <th className="px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Spent</th>}
                {enabledColumns.frequency && <th className="px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Freq.</th>}
                {enabledColumns.cpc && <th className="px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">CPC</th>}
                {enabledColumns.ctr && <th className="px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">CTR</th>}
                {enabledColumns.leads && <th className="px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Leads</th>}
                {enabledColumns.cpm && <th className="px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">CPM</th>}
                {enabledColumns.linkClicks && <th className="px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Link Clicks</th>}
                {enabledColumns.purchases && <th className="px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Purchases</th>}
                {enabledColumns.costPerResult && <th className="px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Cost/Result</th>}
                {enabledColumns.reach && <th className="px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Reach</th>}
                {enabledColumns.videoViews && <th className="px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">Video Views</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(row => {
                const isActive = statuses[row.id] === "Active";
                const delivery = isActive ? row.delivery : "Off";
                return (
                  <tr key={row.id} className="hover:bg-gray-50/80 transition-colors">
                    {/* Status toggle */}
                    {enabledColumns.status && (
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <button
                          onClick={() => toggleStatus(row.id)}
                          className={`relative w-9 h-5 rounded-full transition-colors duration-200 ${isActive ? "bg-emerald-500" : "bg-gray-300"}`}
                        >
                          <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${isActive ? "left-[18px]" : "left-0.5"}`} />
                        </button>
                      </td>
                    )}

                    {/* Name */}
                    {enabledColumns.name && (
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${isActive ? "bg-emerald-500" : "bg-gray-300"}`} />
                          <span className="text-sm font-medium text-gray-900">{row.name}</span>
                        </div>
                      </td>
                    )}

                    {/* Creative Type (Ads tab) */}
                    {enabledColumns.creative && (
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        {row.creative ? (
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">
                            <Image size={10} className="text-gray-400" />
                            {row.creative}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-300">—</span>
                        )}
                      </td>
                    )}

                    {/* Delivery */}
                    {enabledColumns.delivery && (
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full
                          ${delivery === "Active" ? "bg-emerald-100 text-emerald-700" : ""}
                          ${delivery === "Learning" ? "bg-amber-100 text-amber-700" : ""}
                          ${delivery === "Off" ? "bg-gray-100 text-gray-500" : ""}
                        `}>
                          {delivery === "Active" && <Play size={10} />}
                          {delivery === "Off" && <Pause size={10} />}
                          {delivery}
                        </span>
                      </td>
                    )}

                    {/* Budget */}
                    {enabledColumns.budget && (
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className="text-sm text-gray-700 font-medium">{row.budget}</span>
                        {row.budget !== "—" && <span className="text-[10px] text-gray-400 ml-1">{row.budgetType}</span>}
                      </td>
                    )}

                    {/* Spent */}
                    {enabledColumns.spent && (
                      <td className="px-4 py-3.5 text-sm font-semibold text-gray-900 whitespace-nowrap">{row.spent}</td>
                    )}

                    {/* Frequency */}
                    {enabledColumns.frequency && (
                      <td className="px-4 py-3.5 text-sm text-gray-600 whitespace-nowrap">{row.frequency}</td>
                    )}

                    {/* CPC */}
                    {enabledColumns.cpc && (
                      <td className="px-4 py-3.5 text-sm text-gray-600 whitespace-nowrap">{row.cpc}</td>
                    )}

                    {/* CTR */}
                    {enabledColumns.ctr && (
                      <td className="px-4 py-3.5 text-sm text-gray-600 whitespace-nowrap">{row.ctr}</td>
                    )}

                    {/* Leads */}
                    {enabledColumns.leads && (
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className="text-sm font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full">{row.leads}</span>
                      </td>
                    )}

                    {/* Extended columns — show placeholder data */}
                    {enabledColumns.cpm && <td className="px-4 py-3.5 text-sm text-gray-600 whitespace-nowrap">$8.40</td>}
                    {enabledColumns.linkClicks && <td className="px-4 py-3.5 text-sm text-gray-600 whitespace-nowrap">{Math.round(row.leads * 4.2)}</td>}
                    {enabledColumns.purchases && <td className="px-4 py-3.5 text-sm text-gray-600 whitespace-nowrap">{Math.round(row.leads * 0.3)}</td>}
                    {enabledColumns.costPerResult && <td className="px-4 py-3.5 text-sm text-gray-600 whitespace-nowrap">${(12.5 + row.id * 1.3).toFixed(2)}</td>}
                    {enabledColumns.reach && <td className="px-4 py-3.5 text-sm text-gray-600 whitespace-nowrap">{(row.leads * 312).toLocaleString()}</td>}
                    {enabledColumns.videoViews && <td className="px-4 py-3.5 text-sm text-gray-600 whitespace-nowrap">{(row.leads * 28).toLocaleString()}</td>}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="px-4 py-3 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
          <p className="text-[12px] text-gray-500">
            Showing <span className="font-semibold text-gray-700">{filtered.length}</span> of{" "}
            <span className="font-semibold text-gray-700">{sourceData.length}</span> {tabLabel}
          </p>
          <p className="text-[11px] text-gray-400">Data refreshed 5 min ago</p>
        </div>
      </div>

      {/* ── Customize Columns Drawer ── */}
      {columnsOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={() => setColumnsOpen(false)}
          />
          <div className="fixed right-0 top-0 h-full w-[360px] bg-white shadow-2xl z-50 flex flex-col border-l border-gray-200">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div>
                <h2 className="text-base font-semibold text-gray-900">Customize Columns</h2>
                <p className="text-xs text-gray-400 mt-0.5">Select which metrics to display</p>
              </div>
              <button
                onClick={() => setColumnsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-900 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Column List */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
              {ALL_COLUMNS.map(col => {
                const isEnabled = enabledColumns[col.key];
                return (
                  <button
                    key={col.key}
                    onClick={() => toggleColumn(col.key)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left
                      ${isEnabled ? "bg-indigo-50 text-indigo-800" : "text-gray-500 hover:bg-gray-50"}`}
                  >
                    <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all
                      ${isEnabled ? "bg-indigo-600 border-indigo-600" : "border-gray-300 bg-white"}`}>
                      {isEnabled && <Check size={12} className="text-white" strokeWidth={3} />}
                    </div>
                    {col.label}
                  </button>
                );
              })}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
              <button
                onClick={() => setColumnsOpen(false)}
                className="w-full px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-sm transition-all"
              >
                Apply Changes
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
