"use client";

import { useEffect, useState } from "react";
import { getProperties, Property } from "@/lib/api";
import { MapPin, BedDouble, Bath, Square, Building2 } from "lucide-react";
import AddPropertyModal from "@/components/AddPropertyModal";

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  async function loadProperties() {
    try {
      const data = await getProperties();
      setProperties(data || []);
    } catch (error) {
      console.error("Error loading properties:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProperties();
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "available":
        return <span className="bg-emerald-100 text-emerald-700 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">Available</span>;
      case "pending":
        return <span className="bg-amber-100 text-amber-700 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">Pending</span>;
      case "sold":
        return <span className="bg-gray-100 text-gray-700 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">Sold</span>;
      default:
        return <span className="bg-blue-100 text-blue-700 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">{status || "Unknown"}</span>;
    }
  };

  return (
    <div className="space-y-6 flex flex-col h-[calc(100vh-6rem)]">
      <div className="flex items-center justify-between mb-2 shrink-0">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Properties</h1>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-900 text-sm font-medium rounded-lg transition-colors flex items-center gap-2">
          <Building2 size={16} /> Add Property
        </button>
      </div>

      <AddPropertyModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={loadProperties} />

      {loading ? (
        <div className="flex-1 flex items-center justify-center text-gray-400">
          Loading properties...
        </div>
      ) : properties.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
          <Building2 className="w-12 h-12 text-gray-300 mb-4" />
          <p className="text-sm">No properties found. Add your first listing to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 pb-4">
          {properties.map((property) => (
            <div key={property.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group cursor-pointer flex flex-col">
              <div className="relative h-48 bg-gray-100">
                {property.image_url ? (
                  <img src={property.image_url} alt={property.address} className="w-full h-full object-cover group-hover:opacity-90 transition-opacity" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <Building2 size={48} />
                  </div>
                )}
                <div className="absolute top-4 right-4">
                  {getStatusBadge(property.status)}
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <div className="text-xl font-bold text-gray-900 mb-3">{formatCurrency(property.price)}</div>
                
                <div className="flex items-start text-gray-500 mb-4">
                  <MapPin size={16} className="mr-1.5 mt-0.5 shrink-0" />
                  <span className="text-[13px] leading-snug">
                    {property.address}<br />
                    {property.city}, {property.state} {property.zip_code}
                  </span>
                </div>
                
                <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between text-gray-500 text-[13px]">
                  <div className="flex items-center" title="Bedrooms">
                    <BedDouble size={16} className="mr-1.5" />
                    <span className="font-semibold text-gray-700">{property.bedrooms}</span>
                  </div>
                  <div className="flex items-center" title="Bathrooms">
                    <Bath size={16} className="mr-1.5" />
                    <span className="font-semibold text-gray-700">{property.bathrooms}</span>
                  </div>
                  <div className="flex items-center" title="Square Feet">
                    <Square size={16} className="mr-1.5" />
                    <span className="font-semibold text-gray-700">{property.sqft?.toLocaleString()}</span> sqft
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
