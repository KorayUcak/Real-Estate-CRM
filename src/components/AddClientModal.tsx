"use client";

import { useState } from "react";
import { createClient } from "@/lib/api";
import { X } from "lucide-react";

interface AddClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddClientModal({ isOpen, onClose, onSuccess }: AddClientModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    status: "Warm",
    pipeline_stage: "New Lead"
  });

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createClient(formData);
      onSuccess();
      onClose();
      setFormData({ name: "", email: "", phone: "", status: "Warm", pipeline_stage: "New Lead" });
    } catch (error) {
      console.error("Error creating client:", error);
      alert("Failed to create client. Please try again.");
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
          <h2 className="text-lg font-semibold text-gray-900">Add New Client</h2>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-900 transition-colors rounded-lg hover:bg-gray-100">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6">
          <form id="add-client-form" onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className={labelClass}>Full Name *</label>
              <input required type="text" name="name" value={formData.name} onChange={handleChange} className={inputClass} placeholder="John Doe" />
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>Email *</label>
                <input required type="email" name="email" value={formData.email} onChange={handleChange} className={inputClass} placeholder="john@example.com" />
              </div>
              <div>
                <label className={labelClass}>Phone *</label>
                <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} className={inputClass} placeholder="(555) 123-4567" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>Lead Temp</label>
                <select name="status" value={formData.status} onChange={handleChange} className={inputClass}>
                  <option value="Hot">Hot</option>
                  <option value="Warm">Warm</option>
                  <option value="Cold">Cold</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Starting Stage</label>
                <select name="pipeline_stage" value={formData.pipeline_stage} onChange={handleChange} className={inputClass}>
                  <option value="New Lead">New Lead</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Viewing Scheduled">Viewing Scheduled</option>
                  <option value="Offer Made">Offer Made</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
            </div>
          </form>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
          <button type="submit" form="add-client-form" disabled={loading} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors disabled:opacity-50">
            {loading ? "Saving..." : "Add Client"}
          </button>
        </div>
      </div>
    </div>
  );
}
