"use client";

import { useState, useEffect } from "react";
import { X, MapPin, User, Clock, CheckCircle2, XCircle, MessageSquare, Save } from "lucide-react";
import { Showing, updateShowing } from "@/lib/api";

interface EditShowingModalProps {
  showing: Showing | null;
  onClose: () => void;
  onSuccess: (updated: Showing) => void;
}

const STATUS_OPTIONS = ["Scheduled", "Completed", "Cancelled"];

const STATUS_STYLES: Record<string, string> = {
  Scheduled: "bg-blue-100 text-blue-700",
  Completed: "bg-emerald-100 text-emerald-700",
  Cancelled: "bg-rose-100 text-rose-700",
};

const STATUS_ICONS: Record<string, React.ReactNode> = {
  Scheduled: <Clock size={14} className="text-blue-500" />,
  Completed: <CheckCircle2 size={14} className="text-emerald-500" />,
  Cancelled: <XCircle size={14} className="text-rose-500" />,
};

export default function EditShowingModal({ showing, onClose, onSuccess }: EditShowingModalProps) {
  const [status, setStatus] = useState("Scheduled");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (showing) {
      setStatus(showing.status || "Scheduled");
      setNotes(showing.notes || "");
    }
  }, [showing]);

  if (!showing) return null;

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await updateShowing(showing.id, { status, notes });
      if (updated) {
        // Merge relational data back so UI updates correctly
        onSuccess({ ...showing, status, notes });
        onClose();
      }
    } finally {
      setSaving(false);
    }
  };

  const timeStr = new Date(showing.showing_date).toLocaleString("en-US", {
    weekday: "long", month: "long", day: "numeric", year: "numeric",
    hour: "numeric", minute: "2-digit"
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/25 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-gray-100 overflow-hidden flex flex-col transition-all duration-300">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-blue-50 to-white">
          <div>
            <h2 className="text-base font-semibold text-gray-900">Edit Showing</h2>
            <p className="text-xs text-gray-400 mt-0.5">{timeStr}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-900 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Info */}
        <div className="px-6 pt-5 pb-2 space-y-3">
          <div className="flex items-center gap-2.5 text-sm text-gray-600">
            <MapPin size={15} className="text-indigo-400 shrink-0" />
            <span className="font-medium">{showing.properties?.address || "Unknown Property"}</span>
          </div>
          <div className="flex items-center gap-2.5 text-sm text-gray-500">
            <User size={15} className="text-indigo-400 shrink-0" />
            <span>{showing.clients?.name || "Unknown Client"}</span>
          </div>
        </div>

        {/* Form */}
        <div className="px-6 py-4 space-y-5">
          {/* Status Selector */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Status</label>
            <div className="grid grid-cols-3 gap-2">
              {STATUS_OPTIONS.map(opt => (
                <button
                  key={opt}
                  onClick={() => setStatus(opt)}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all text-xs font-bold
                    ${status === opt
                      ? "border-indigo-500 bg-indigo-50 text-indigo-700 shadow-sm"
                      : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"
                    }`}
                >
                  {STATUS_ICONS[opt]}
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare size={13} className="text-indigo-400" />
              <label className="text-xs font-semibold uppercase tracking-widest text-gray-400">Post-Showing Notes</label>
            </div>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              placeholder="How did the showing go? Client feedback, next steps..."
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/80 flex gap-3">
          <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-sm transition-all disabled:opacity-50"
          >
            <Save size={15} />
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
