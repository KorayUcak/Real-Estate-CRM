"use client";

import { useState, useEffect } from "react";
import { createShowing, getClients, getProperties, Client, Property } from "@/lib/api";
import { X } from "lucide-react";

interface ScheduleShowingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ScheduleShowingModal({ isOpen, onClose, onSuccess }: ScheduleShowingModalProps) {
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [formData, setFormData] = useState({
    client_id: "",
    property_id: "",
    showing_date: "",
    notes: "",
    status: "Scheduled"
  });

  useEffect(() => {
    if (isOpen) {
      Promise.all([getClients(), getProperties()]).then(([clientsData, propertiesData]) => {
        setClients(clientsData || []);
        setProperties(propertiesData || []);
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createShowing({
        ...formData,
        showing_date: new Date(formData.showing_date).toISOString(),
      });
      onSuccess();
      onClose();
      setFormData({ client_id: "", property_id: "", showing_date: "", notes: "", status: "Scheduled" });
    } catch (error) {
      console.error("Error scheduling showing:", error);
      alert("Failed to schedule showing.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-colors";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1.5";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl border border-gray-200 overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Schedule Showing</h2>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-900 transition-colors rounded-lg hover:bg-gray-100">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6">
          <form id="schedule-showing-form" onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className={labelClass}>Client *</label>
              <select required name="client_id" value={formData.client_id} onChange={handleChange} className={inputClass}>
                <option value="" disabled>Select a client...</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            <div>
              <label className={labelClass}>Property *</label>
              <select required name="property_id" value={formData.property_id} onChange={handleChange} className={inputClass}>
                <option value="" disabled>Select a property...</option>
                {properties.map(p => <option key={p.id} value={p.id}>{p.address}</option>)}
              </select>
            </div>

            <div>
              <label className={labelClass}>Date & Time *</label>
              <input required type="datetime-local" name="showing_date" value={formData.showing_date} onChange={handleChange} className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Notes</label>
              <textarea name="notes" value={formData.notes} onChange={handleChange} rows={3} className={inputClass} placeholder="Gate code is 1234, client wants to check the plumbing..." />
            </div>
          </form>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
          <button type="submit" form="schedule-showing-form" disabled={loading} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors disabled:opacity-50">
            {loading ? "Saving..." : "Schedule"}
          </button>
        </div>
      </div>
    </div>
  );
}
