"use client";

import { useState } from "react";
import { Plug, ChevronRight, Home, Target, SearchCheck, Radar, X, Key, Hash } from "lucide-react";

// ─── Integration Data ─────────────────────────────────────────────────────────

interface Integration {
  name: string;
  description: string;
  icon: React.ElementType;
  iconColor: string;
  status: "connected" | "available";
  action: "Connect" | "Configure";
}

const INTEGRATIONS: Integration[] = [
  {
    name: "Sahibinden (Kurumsal API)",
    description: "Sync your active property listings directly from your Kurumsal account.",
    icon: Home,
    iconColor: "bg-orange-50 text-orange-600",
    status: "available",
    action: "Connect",
  },
  {
    name: "Meta Ads",
    description: "Track lead generation campaigns from Facebook and Instagram directly in your pipeline.",
    icon: Target,
    iconColor: "bg-blue-50 text-blue-600",
    status: "available",
    action: "Connect",
  },
  {
    name: "Google Ads",
    description: "Monitor search campaign performance and calculate exact ROI per lead.",
    icon: SearchCheck,
    iconColor: "bg-emerald-50 text-emerald-600",
    status: "available",
    action: "Connect",
  },
  {
    name: "FSBO Market Radar",
    description: "Automated scanner for new 'For Sale By Owner' listings in the local area.",
    icon: Radar,
    iconColor: "bg-violet-50 text-violet-600",
    status: "available",
    action: "Configure",
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function IntegrationsPage() {
  const [connectModal, setConnectModal] = useState<Integration | null>(null);
  const [apiKey, setApiKey] = useState("");
  const [accountId, setAccountId] = useState("");

  const connectedCount = INTEGRATIONS.filter(i => i.status === "connected").length;
  const availableCount = INTEGRATIONS.filter(i => i.status === "available").length;

  function handleOpenModal(integration: Integration) {
    setApiKey("");
    setAccountId("");
    setConnectModal(integration);
  }

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Integrations</h1>
          <p className="text-sm text-gray-500 mt-1">Connect your CRM to the tools you already use.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-sm transition-all">
          <Plug size={15} />
          Browse all
        </button>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <p className="text-[12px] font-medium text-gray-500 mb-1">Connected</p>
          <p className={`text-2xl font-bold ${connectedCount > 0 ? "text-emerald-600" : "text-gray-400"}`}>
            {connectedCount}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <p className="text-[12px] font-medium text-gray-500 mb-1">Available</p>
          <p className="text-2xl font-bold text-gray-900">{availableCount}</p>
        </div>
      </div>

      {/* ── Integration Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {INTEGRATIONS.map(integration => {
          const Icon = integration.icon;
          return (
            <div
              key={integration.name}
              className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-11 h-11 rounded-xl ${integration.iconColor} flex items-center justify-center`}>
                  <Icon size={20} />
                </div>
                <span className="text-[11px] font-medium text-gray-400 bg-gray-50 border border-gray-200 px-2.5 py-1 rounded-full">
                  Available
                </span>
              </div>

              <h3 className="text-sm font-semibold text-gray-900 mb-1">{integration.name}</h3>
              <p className="text-xs text-gray-500 leading-relaxed mb-4">{integration.description}</p>

              <button
                onClick={() => handleOpenModal(integration)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
              >
                {integration.action}
                <ChevronRight size={14} />
              </button>
            </div>
          );
        })}
      </div>

      {/* ── Connect Modal ── */}
      {connectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/25 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-gray-100 overflow-hidden flex flex-col">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-indigo-50 to-white">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-lg ${connectModal.iconColor} flex items-center justify-center`}>
                  <connectModal.icon size={18} />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-gray-900">{connectModal.name}</h2>
                  <p className="text-[11px] text-gray-400">Enter your credentials to connect</p>
                </div>
              </div>
              <button
                onClick={() => setConnectModal(null)}
                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-900 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Form */}
            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">
                  <Key size={12} className="text-indigo-400" /> API Key
                </label>
                <input
                  type="text"
                  value={apiKey}
                  onChange={e => setApiKey(e.target.value)}
                  placeholder="Enter your API key..."
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">
                  <Hash size={12} className="text-indigo-400" /> Account ID
                </label>
                <input
                  type="text"
                  value={accountId}
                  onChange={e => setAccountId(e.target.value)}
                  placeholder="Enter your account ID..."
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/80 flex gap-3">
              <button
                onClick={() => setConnectModal(null)}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-sm transition-all"
              >
                <Plug size={15} />
                Save Connection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
