"use client";

import { useEffect, useState } from "react";
import { getShowings, Showing } from "@/lib/api";
import { Calendar, MapPin, User, Clock, CheckCircle2, XCircle, Edit3 } from "lucide-react";
import ScheduleShowingModal from "@/components/ScheduleShowingModal";
import EditShowingModal from "@/components/EditShowingModal";

export default function ShowingsPage() {
  const [showings, setShowings] = useState<Showing[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editShowing, setEditShowing] = useState<Showing | null>(null);

  useEffect(() => {
    loadShowings();
  }, []);

  async function loadShowings() {
    try {
      const data = await getShowings();
      setShowings(data || []);
    } catch (error) {
      console.error("Error loading showings:", error);
    } finally {
      setLoading(false);
    }
  }

  const handleShowingUpdated = (updated: Showing) => {
    setShowings(prev => prev.map(s => s.id === updated.id ? { ...s, ...updated } : s));
  };

  // Group by date (ignoring time)
  const groupedShowings = showings.reduce((acc, showing) => {
    const dateObj = new Date(showing.showing_date);
    const dateStr = dateObj.toLocaleDateString("en-US", { weekday: 'long', month: 'long', day: 'numeric' });
    if (!acc[dateStr]) acc[dateStr] = [];
    acc[dateStr].push(showing);
    return acc;
  }, {} as Record<string, Showing[]>);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'Completed':
        return { icon: <CheckCircle2 size={13} className="text-emerald-500" />, class: "bg-emerald-100 text-emerald-700" };
      case 'Cancelled':
        return { icon: <XCircle size={13} className="text-rose-500" />, class: "bg-rose-100 text-rose-700" };
      default:
        return { icon: <Clock size={13} className="text-blue-500" />, class: "bg-blue-100 text-blue-700" };
    }
  };

  return (
    <div className="space-y-6 flex flex-col h-[calc(100vh-6rem)]">
      <div className="flex items-center justify-between mb-2 shrink-0">
        <h1 className="text-2xl font-semibold text-gray-900">Showings</h1>
        <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-900 text-sm font-medium rounded-lg transition-colors flex items-center gap-2">
          <Calendar size={15} /> Schedule Showing
        </button>
      </div>

      <ScheduleShowingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={loadShowings} />
      <EditShowingModal showing={editShowing} onClose={() => setEditShowing(null)} onSuccess={handleShowingUpdated} />

      {loading ? (
        <div className="flex-1 flex items-center justify-center text-gray-400">Loading showings...</div>
      ) : showings.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
          <Calendar className="w-12 h-12 text-gray-300 mb-4" />
          <p className="text-sm">No showings scheduled. Click the button above to schedule your first showing.</p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto space-y-8 pb-4">
          {Object.entries(groupedShowings).map(([dateStr, dayShowings]) => (
            <div key={dateStr} className="space-y-4">
              <h2 className="text-[15px] font-semibold text-gray-900 flex items-center border-b border-gray-200 pb-2">
                <Calendar size={15} className="mr-2 text-indigo-500" />
                {dateStr}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {dayShowings.map(showing => {
                  const timeStr = new Date(showing.showing_date).toLocaleTimeString("en-US", { hour: 'numeric', minute: '2-digit' });
                  const { icon, class: statusClass } = getStatusConfig(showing.status);

                  return (
                    <div
                      key={showing.id}
                      onClick={() => setEditShowing(showing)}
                      className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all flex flex-col cursor-pointer group"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="font-bold text-gray-900 text-base">{timeStr}</div>
                        <div className={`flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${statusClass}`}>
                          {icon}
                          <span>{showing.status}</span>
                        </div>
                      </div>

                      <div className="space-y-2.5 flex-1">
                        <div className="flex items-start gap-2">
                          <MapPin size={14} className="text-indigo-400 mt-0.5 shrink-0" />
                          <span className="text-[13px] font-medium text-gray-700 leading-snug">
                            {showing.properties?.address || "Unknown Property"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User size={14} className="text-indigo-400 shrink-0" />
                          <span className="text-[13px] text-gray-500">{showing.clients?.name || "Unknown Client"}</span>
                        </div>
                      </div>

                      {showing.notes && (
                        <div className="mt-3 pt-3 border-t border-gray-100 text-[11px] text-gray-400 italic">
                          &ldquo;{showing.notes}&rdquo;
                        </div>
                      )}

                      <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between">
                        <span className="text-[11px] text-gray-400">Click to edit</span>
                        <Edit3 size={13} className="text-gray-300 group-hover:text-indigo-400 transition-colors" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
