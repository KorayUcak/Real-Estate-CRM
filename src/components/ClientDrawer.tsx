"use client";

import { useState, useEffect } from "react";
import { X, Phone, Mail, Calendar, MessageSquare, Save } from "lucide-react";
import { Client, updateClientNotes } from "@/lib/api";

interface ClientDrawerProps {
  client: Client | null;
  onClose: () => void;
  onNotesUpdated: (clientId: string, notes: string) => void;
}

const STAGE_COLORS: Record<string, string> = {
  "New Lead": "bg-purple-100 text-purple-700",
  "Contacted": "bg-orange-100 text-orange-700",
  "Viewing Scheduled": "bg-yellow-100 text-yellow-700",
  "Offer Made": "bg-blue-100 text-blue-700",
  "Closed": "bg-emerald-100 text-emerald-700",
};

const STATUS_COLORS: Record<string, string> = {
  Hot: "bg-rose-100 text-rose-700",
  Warm: "bg-amber-100 text-amber-700",
  Cold: "bg-sky-100 text-sky-700",
};

export default function ClientDrawer({ client, onClose, onNotesUpdated }: ClientDrawerProps) {
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (client) {
      setNotes(client.notes || "");
      setSaved(false);
    }
  }, [client]);

  if (!client) return null;

  const handleSaveNotes = async () => {
    setSaving(true);
    const updated = await updateClientNotes(client.id, notes);
    if (updated) {
      onNotesUpdated(client.id, notes);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }
    setSaving(false);
  };

  const stageClass = STAGE_COLORS[client.pipeline_stage || "New Lead"] || "bg-gray-100 text-gray-700";
  const statusClass = STATUS_COLORS[client.status] || "bg-gray-100 text-gray-700";

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/25 backdrop-blur-sm z-40 transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-[420px] bg-white shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-out">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-start justify-between bg-gradient-to-r from-indigo-50 to-white">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-lg">
              {client.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900">{client.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${statusClass}`}>
                  {client.status}
                </span>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${stageClass}`}>
                  {client.pipeline_stage || "New Lead"}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-900 transition-colors mt-0.5"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Contact Info */}
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Contact Information</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Mail size={16} className="text-indigo-500 shrink-0" />
                <div>
                  <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Email</p>
                  <p className="text-sm text-gray-800 font-medium">{client.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Phone size={16} className="text-indigo-500 shrink-0" />
                <div>
                  <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Phone</p>
                  <p className="text-sm text-gray-800 font-medium">{client.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Calendar size={16} className="text-indigo-500 shrink-0" />
                <div>
                  <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Added</p>
                  <p className="text-sm text-gray-800 font-medium">
                    {new Date(client.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Notes */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <MessageSquare size={14} className="text-indigo-500" />
              <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400">Client Notes</h3>
            </div>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={7}
              placeholder="Add notes about this client — budget, preferences, timeline..."
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all"
            />
          </section>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/80">
          <button
            onClick={handleSaveNotes}
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-sm transition-all disabled:opacity-50"
          >
            <Save size={16} />
            {saving ? "Saving..." : saved ? "✓ Saved!" : "Save Notes"}
          </button>
        </div>
      </div>
    </>
  );
}
