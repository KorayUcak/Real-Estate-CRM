"use client";

import { useState } from "react";
import { createProperty } from "@/lib/api";
import { X } from "lucide-react";

interface AddPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddPropertyModal({ isOpen, onClose, onSuccess }: AddPropertyModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    address: "",
    city: "",
    state: "",
    zip_code: "",
    price: "",
    bedrooms: "",
    bathrooms: "",
    sqft: "",
    image_url: "",
    status: "Available",
  });

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        bedrooms: parseInt(formData.bedrooms),
        bathrooms: parseInt(formData.bathrooms),
        sqft: parseInt(formData.sqft),
      };
      await createProperty(payload);
      onSuccess();
      onClose();
      setFormData({
        title: "", address: "", city: "", state: "", zip_code: "",
        price: "", bedrooms: "", bathrooms: "", sqft: "", image_url: "", status: "Available"
      });
    } catch (error) {
      console.error("Error creating property:", error);
      alert("Failed to create property.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-colors";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1.5";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-xl border border-gray-200 flex flex-col my-8">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between shrink-0">
          <h2 className="text-lg font-semibold text-gray-900">Add New Property</h2>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-900 transition-colors rounded-lg hover:bg-gray-100">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          <form id="add-property-form" onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-5">
              <div className="col-span-2">
                <label className={labelClass}>Property Title *</label>
                <input required type="text" name="title" value={formData.title} onChange={handleChange} className={inputClass} placeholder="Modern Downtown Loft" />
              </div>

              <div className="col-span-2">
                <label className={labelClass}>Street Address *</label>
                <input required type="text" name="address" value={formData.address} onChange={handleChange} className={inputClass} placeholder="123 Ocean Drive, Apt 4B" />
              </div>

              <div>
                <label className={labelClass}>City *</label>
                <input required type="text" name="city" value={formData.city} onChange={handleChange} className={inputClass} placeholder="Miami" />
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>State *</label>
                  <input required type="text" name="state" value={formData.state} onChange={handleChange} className={inputClass} placeholder="FL" />
                </div>
                <div>
                  <label className={labelClass}>Zip Code *</label>
                  <input required type="text" name="zip_code" value={formData.zip_code} onChange={handleChange} className={inputClass} placeholder="33132" />
                </div>
              </div>

              <div>
                <label className={labelClass}>Listing Price ($) *</label>
                <input required type="number" name="price" value={formData.price} onChange={handleChange} className={inputClass} placeholder="850000" />
              </div>

              <div>
                <label className={labelClass}>Status</label>
                <select name="status" value={formData.status} onChange={handleChange} className={inputClass}>
                  <option value="Available">Available</option>
                  <option value="Pending">Pending</option>
                  <option value="Sold">Sold</option>
                </select>
              </div>

              <div className="col-span-2 grid grid-cols-3 gap-5 pt-4 border-t border-gray-100">
                <div>
                  <label className={labelClass}>Beds *</label>
                  <input required type="number" name="bedrooms" value={formData.bedrooms} onChange={handleChange} className={inputClass} placeholder="3" />
                </div>
                <div>
                  <label className={labelClass}>Baths *</label>
                  <input required type="number" name="bathrooms" value={formData.bathrooms} onChange={handleChange} className={inputClass} placeholder="2" />
                </div>
                <div>
                  <label className={labelClass}>Sqft *</label>
                  <input required type="number" name="sqft" value={formData.sqft} onChange={handleChange} className={inputClass} placeholder="1500" />
                </div>
              </div>

              <div className="col-span-2">
                <label className={labelClass}>Main Image URL</label>
                <input type="url" name="image_url" value={formData.image_url} onChange={handleChange} className={inputClass} placeholder="https://example.com/image.jpg" />
              </div>
            </div>
          </form>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3 shrink-0">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
          <button type="submit" form="add-property-form" disabled={loading} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors disabled:opacity-50">
            {loading ? "Saving..." : "Add Property"}
          </button>
        </div>
      </div>
    </div>
  );
}
