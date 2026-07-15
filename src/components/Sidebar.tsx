"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Building2,
  CalendarCheck,
  ChevronRight,
  ChevronDown,
  Mail,
  Plug,
  Target,
  SearchCheck,
  Store,
} from "lucide-react";

// ─── Navigation Sections ──────────────────────────────────────────────────────

const crmItems = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Clients", href: "/clients", icon: Users },
  { label: "Mail", href: "/mail", icon: Mail },
  { label: "Properties", href: "/properties", icon: Building2 },
  { label: "Showings", href: "/showings", icon: CalendarCheck },
];

const marketingItems = [
  { label: "Meta Ads", href: "/ads/meta", icon: Target },
  { label: "Google Ads", href: "/ads/google", icon: SearchCheck },
];

const systemItems = [
  { label: "Integrations", href: "/integrations", icon: Plug },
];

// ─── Dynamic Marketplaces ─────────────────────────────────────────────────────
// This array drives the sidebar links under "MARKETPLACES".
// To add a new marketplace, simply push its key here:
//   connectedMarketplaces.push('rightmove')
// Then add its config to MARKETPLACE_CONFIG below.

const connectedMarketplaces = ["sahibinden"];

// Add future marketplaces here — the sidebar will auto-generate their links.
// Example:
//   rightmove:  { label: "Rightmove",  href: "/marketplace/rightmove",  icon: Store },
//   zillow:     { label: "Zillow",     href: "/marketplace/zillow",     icon: Store },
const MARKETPLACE_CONFIG: Record<string, { label: string; href: string; icon: React.ElementType }> = {
  sahibinden: { label: "Sahibinden", href: "/marketplace/sahibinden", icon: Store },
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function Sidebar() {
  const pathname = usePathname();

  function NavLink({ label, href, icon: Icon }: { label: string; href: string; icon: React.ElementType }) {
    const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));
    return (
      <Link
        href={href}
        className={`group flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium transition-all duration-200
          ${isActive
            ? "bg-gray-100 text-gray-900"
            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          }`}
      >
        <Icon
          size={16}
          strokeWidth={isActive ? 2.5 : 2}
          className={isActive
            ? "text-gray-900"
            : "text-gray-400 group-hover:text-gray-600 transition-colors"
          }
        />
        <span className="flex-1">{label}</span>
        {isActive && <ChevronRight size={14} className="text-gray-400" />}
      </Link>
    );
  }

  // Dynamically resolve marketplace nav items from the connected array
  const marketplaceLinks = connectedMarketplaces
    .map(key => MARKETPLACE_CONFIG[key])
    .filter(Boolean);

  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex w-[260px] flex-col bg-white text-gray-900 border-r border-gray-200 transition-colors duration-300">

      {/* ── Top User Profile ── */}
      <div className="flex h-[72px] items-center gap-3 border-b border-gray-200 px-6 cursor-pointer hover:bg-gray-50 transition-colors">
        <div className="flex h-7 w-7 items-center justify-center rounded bg-gray-900 text-white text-xs font-bold shrink-0">
          C2C
        </div>
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold shrink-0">
          KU
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-[13px] font-semibold text-gray-900 truncate">
            Koray Uçak Higgins
          </h1>
        </div>
        <ChevronDown size={14} className="text-gray-400" />
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 overflow-y-auto px-4 pt-6 space-y-6">
        {/* CRM */}
        <div className="space-y-1">
          <p className="mb-3 px-2 text-[10px] font-semibold uppercase tracking-wider text-gray-400">CRM</p>
          {crmItems.map(item => <NavLink key={item.href} {...item} />)}
        </div>

        {/* Performance Marketing */}
        <div className="space-y-1">
          <p className="mb-3 px-2 text-[10px] font-semibold uppercase tracking-wider text-gray-400">Performance Marketing</p>
          {marketingItems.map(item => <NavLink key={item.href} {...item} />)}
        </div>

        {/* Dynamic Marketplaces — only renders if connectedMarketplaces has entries */}
        {marketplaceLinks.length > 0 && (
          <div className="space-y-1">
            <p className="mb-3 px-2 text-[10px] font-semibold uppercase tracking-wider text-gray-400">Marketplaces</p>
            {marketplaceLinks.map(item => <NavLink key={item.href} {...item} />)}
          </div>
        )}

        {/* System */}
        <div className="space-y-1">
          <p className="mb-3 px-2 text-[10px] font-semibold uppercase tracking-wider text-gray-400">System</p>
          {systemItems.map(item => <NavLink key={item.href} {...item} />)}
        </div>
      </nav>

      {/* ── Bottom ── */}
      <div className="p-4">
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
          <p className="text-xs font-medium text-gray-500 mb-2">Monthly Target</p>
          <div className="w-full bg-gray-200 rounded-full h-1.5 mb-1">
            <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: "65%" }}></div>
          </div>
          <p className="text-[10px] text-gray-400">65% to goal</p>
        </div>
      </div>
    </aside>
  );
}
