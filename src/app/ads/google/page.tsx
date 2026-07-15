"use client";

import { SearchCheck } from "lucide-react";

export default function GoogleAdsPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center py-24">
      <div className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-center mb-5">
        <SearchCheck size={28} className="text-gray-300" />
      </div>
      <h1 className="text-xl font-semibold text-gray-900 mb-2">Google Ads</h1>
      <p className="text-sm text-gray-500 max-w-xs leading-relaxed">
        Google Ads reporting is coming soon. This module will mirror the Meta Ads dashboard with search campaign analytics.
      </p>
    </div>
  );
}
