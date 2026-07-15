import { Info } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-semibold text-gray-900">Pipeline Overview</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard 
          title="Pipeline Value" 
          subtitle="Total Asset Volume" 
          value="$24.5M" 
          trend="14% vs last month" 
          positive={true} 
        />
        <MetricCard 
          title="Commission" 
          subtitle="Projected Revenue" 
          value="$490k" 
          trend="5% vs last month" 
          positive={true} 
        />
        <MetricCard 
          title="Deal Activity" 
          subtitle="Viewings Booked" 
          value="20" 
          trend="12% vs last month" 
          positive={true} 
        />
        <MetricCard 
          title="Conversion & Speed" 
          subtitle="Avg. Days to Close" 
          value="42" 
          trend="5% vs last month" 
          positive={false} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6 shadow-sm h-96 flex items-center justify-center">
          <p className="text-gray-400 font-medium text-sm">Revenue Overview Chart (Coming Soon)</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm h-96 flex flex-col">
          <h3 className="font-semibold text-gray-900 text-sm mb-4">Upcoming Showings</h3>
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-400 font-medium text-sm">No upcoming showings</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, subtitle, value, trend, positive }: { title: string; subtitle: string; value: string; trend: string; positive: boolean }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[13px] font-semibold text-gray-900">{title}</h3>
        <Info size={14} className="text-gray-400" />
      </div>
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
        <div className="text-[11px] font-medium text-gray-500 mb-1">{subtitle}</div>
        <div className="text-2xl font-bold text-gray-900 mb-2">{value}</div>
        <div className={`text-[11px] font-medium flex items-center ${positive ? 'text-emerald-600' : 'text-amber-600'}`}>
          {positive ? '↑' : '↓'} {trend}
        </div>
      </div>
    </div>
  );
}
