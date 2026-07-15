"use client";

import { useState } from "react";
import {
  Search,
  Pencil,
  Paperclip,
  Send,
  Star,
  Reply,
  MoreHorizontal,
  Trash2,
  Archive,
  ChevronDown,
  X,
  Tag,
} from "lucide-react";

// ─── Dummy Data ────────────────────────────────────────────────────────────────

interface Email {
  id: number;
  from: string;
  email: string;
  subject: string;
  preview: string;
  time: string;
  unread: boolean;
  starred: boolean;
  avatar: string;
  avatarBg: string;
  avatarText: string;
  tag?: { label: string; color: string };
  body: string;
}

const EMAILS: Email[] = [
  {
    id: 1,
    from: "Ahmed Al-Rashid",
    email: "ahmed.alrashid@palmproperties.ae",
    subject: "Re: Property Viewing at Palm Jumeirah Villa",
    preview: "I'm available tomorrow afternoon for the viewing. Please confirm the time and I'll make sure to be there.",
    time: "2m ago",
    unread: true,
    starred: true,
    avatar: "A",
    avatarBg: "bg-violet-100",
    avatarText: "text-violet-700",
    tag: { label: "Client", color: "bg-blue-100 text-blue-700" },
    body: `Hi,

I'm available tomorrow afternoon for the viewing. Please confirm the time and I'll make sure to be there. Looking forward to seeing the property in person.

Also, could you please share the floor plan and HOA details before we meet? I'd like to review them beforehand so we can have a more focused discussion.

One more thing — my wife will be joining me. Is it possible to arrange a brief meeting with the building manager as well?

Thank you for your time and looking forward to hearing from you.

Best regards,
Ahmed Al-Rashid`,
  },
  {
    id: 2,
    from: "Sarah Mitchell",
    email: "sarah.m@coastlineagency.com",
    subject: "Signed Offer Documents – Dubai Hills Villa",
    preview: "Please find attached the signed offer documents. The buyer has agreed to the revised terms and conditions.",
    time: "1h ago",
    unread: true,
    starred: false,
    avatar: "S",
    avatarBg: "bg-rose-100",
    avatarText: "text-rose-700",
    tag: { label: "Urgent", color: "bg-rose-100 text-rose-700" },
    body: `Hi Team,

Please find attached the signed offer documents for your review and approval. The buyer (Mr. James Henderson) has agreed to all revised terms and conditions discussed in yesterday's call.

Key highlights of the offer:
• Purchase Price: AED 4,250,000
• Deposit: 10% within 7 days
• Completion: 60 days from signing
• Included: All white goods and built-in wardrobes

Please review and countersign at your earliest convenience. The buyer is motivated and we'd like to keep this moving.

Let me know if you have any questions.

Best,
Sarah Mitchell
Senior Property Advisor`,
  },
  {
    id: 3,
    from: "Mohammed Al-Farsi",
    email: "m.alfarsi@emiratesinvest.ae",
    subject: "Portfolio Inquiry – Downtown Dubai Properties",
    preview: "I was referred to you by a mutual colleague and I'd like to discuss available off-plan units.",
    time: "3h ago",
    unread: false,
    starred: false,
    avatar: "M",
    avatarBg: "bg-sky-100",
    avatarText: "text-sky-700",
    tag: { label: "Follow-up", color: "bg-amber-100 text-amber-700" },
    body: `Good morning,

I was referred to you by a colleague of mine, Mr. Tariq Hassan from Emirates Invest, and I'd like to discuss available off-plan units in the Downtown Dubai corridor.

Our investment group is looking to acquire a portfolio of 5–10 units in a single tower, ideally with a handover date in Q4 2027 or early 2028. We have a budget of AED 20–30M and are prepared to move quickly for the right opportunity.

Could you arrange a meeting this week? I'm available Wednesday or Thursday afternoon.

Regards,
Mohammed Al-Farsi
Managing Director, Emirates Invest Group`,
  },
  {
    id: 4,
    from: "Lena Hoffman",
    email: "lena.h@eurogroup.de",
    subject: "Tenancy Renewal – Jumeirah Beach Apartment",
    preview: "My current tenancy ends on August 15th and I would like to explore renewal options with a rent reduction.",
    time: "Yesterday",
    unread: false,
    starred: false,
    avatar: "L",
    avatarBg: "bg-emerald-100",
    avatarText: "text-emerald-700",
    body: `Dear Team,

My current tenancy at Unit 1204, Jumeirah Beach Residence (Tower C) ends on August 15th, 2026.

I have been a tenant for the past 3 years and have always paid on time. I would like to explore renewal options, ideally with a 5–10% reduction given the current market rates in the area.

I have found comparable units in the same building listed for AED 105,000/year, whereas I'm currently paying AED 118,000. I believe a fair renewal would be in the AED 108,000–112,000 range.

I would appreciate a call this week to discuss further. Please let me know your availability.

Kind regards,
Lena Hoffman`,
  },
  {
    id: 5,
    from: "Coast2Coast CRM",
    email: "noreply@coast2coast.ae",
    subject: "Monthly Performance Report – June 2026",
    preview: "Your pipeline is up 14% this month. 3 pending closings, 8 active showings, and 2 new leads.",
    time: "2 days ago",
    unread: false,
    starred: false,
    avatar: "C",
    avatarBg: "bg-indigo-100",
    avatarText: "text-indigo-700",
    body: `Coast2Coast Properties CRM — Monthly Report

Pipeline Summary for June 2026:

📈 Pipeline Value: AED 24.5M (+14% vs May)
💰 Projected Commission: AED 490,000
🏠 Active Listings: 12
📅 Showings Booked: 20
✅ Closings This Month: 3
🆕 New Leads from Portal: 8

Top Performers:
1. Palm Jumeirah – 4 Bed Villa (AED 6.2M) — Offer Stage
2. Dubai Hills – Town House (AED 2.8M) — Under Review
3. Downtown – Studio Portfolio (AED 8.4M) — New Lead

This report was auto-generated by your CRM.`,
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function MailPage() {
  const [selectedId, setSelectedId] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [reply, setReply] = useState("");
  const [composeOpen, setComposeOpen] = useState(false);
  const [starred, setStarred] = useState<Record<number, boolean>>(
    Object.fromEntries(EMAILS.map(e => [e.id, e.starred]))
  );

  const filteredEmails = EMAILS.filter(e =>
    e.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selected = EMAILS.find(e => e.id === selectedId)!;

  return (
    <div
      className="flex overflow-hidden -m-6 bg-gray-50"
      style={{ height: "calc(100vh - 60px)" }}
    >
      {/* ── Left Column: Inbox List (38%) ─────────────────────────── */}
      <div className="w-[38%] flex flex-col border-r border-gray-200 bg-white">

        {/* Inbox Header */}
        <div className="px-5 pt-5 pb-4 space-y-3 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-[15px] font-semibold text-gray-900">Inbox</h2>
              <span className="text-[10px] font-bold bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">
                {EMAILS.filter(e => e.unread).length} new
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setComposeOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-[12px] font-semibold transition-colors shadow-sm"
              >
                <Pencil size={12} strokeWidth={2.5} /> Compose
              </button>
              <button className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
                <ChevronDown size={15} />
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search messages..."
              className="w-full pl-8 pr-4 py-2 bg-gray-100 border-none rounded-lg text-[13px] text-gray-700 placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-gray-50 focus:border-indigo-300 border border-transparent transition-all"
            />
          </div>
        </div>

        {/* Email List */}
        <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
          {filteredEmails.map(email => {
            const isSelected = email.id === selectedId;
            return (
              <button
                key={email.id}
                onClick={() => setSelectedId(email.id)}
                className={`w-full text-left px-4 py-3.5 transition-colors group relative
                  ${isSelected
                    ? "bg-indigo-50 border-l-2 border-indigo-500"
                    : "hover:bg-gray-50 border-l-2 border-transparent"
                  }`}
              >
                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  <div className={`w-9 h-9 rounded-full ${email.avatarBg} ${email.avatarText} flex items-center justify-center text-[13px] font-bold shrink-0 mt-0.5`}>
                    {email.avatar}
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* Row 1: Name + time */}
                    <div className="flex items-center justify-between mb-0.5">
                      <span className={`text-[13px] truncate ${email.unread ? "font-bold text-gray-900" : "font-medium text-gray-500"}`}>
                        {email.from}
                      </span>
                      <span className="text-[10px] text-gray-400 shrink-0 ml-2">{email.time}</span>
                    </div>

                    {/* Row 2: Subject */}
                    <p className={`text-[12px] truncate mb-1 ${email.unread ? "font-semibold text-gray-800" : "text-gray-400"}`}>
                      {email.subject}
                    </p>

                    {/* Row 3: Preview + tag */}
                    <div className="flex items-center gap-2">
                      <p className="text-[11px] text-gray-400 truncate flex-1">{email.preview}</p>
                      {email.tag && (
                        <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded shrink-0 ${email.tag.color}`}>
                          {email.tag.label}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Unread dot */}
                  {email.unread && (
                    <div className="w-2 h-2 rounded-full bg-indigo-500 shrink-0 mt-2" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Right Column: Reading Pane (62%) ─────────────────────── */}
      <div className="flex-1 flex flex-col bg-white overflow-hidden border-l border-gray-100">

        {/* Email Header */}
        <div className="px-8 pt-6 pb-5 border-b border-gray-200 shrink-0 bg-white">
          {/* Action toolbar */}
          <div className="flex items-center gap-2 mb-5">
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-gray-600 text-[12px] font-medium hover:text-gray-900 hover:bg-gray-50 transition-all">
              <Reply size={13} /> Reply
            </button>
            <button className="p-1.5 rounded-lg bg-white border border-gray-200 text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-all">
              <Archive size={14} />
            </button>
            <button className="p-1.5 rounded-lg bg-white border border-gray-200 text-gray-400 hover:text-rose-500 hover:bg-rose-50 hover:border-rose-200 transition-all">
              <Trash2 size={14} />
            </button>
            <button className="p-1.5 rounded-lg bg-white border border-gray-200 text-gray-400 hover:text-amber-500 hover:bg-amber-50 hover:border-amber-200 transition-all">
              <Tag size={14} />
            </button>
            <button
              onClick={() => setStarred(s => ({ ...s, [selected.id]: !s[selected.id] }))}
              className="p-1.5 rounded-lg bg-white border border-gray-200 transition-all hover:bg-amber-50 hover:border-amber-200"
            >
              <Star
                size={14}
                className={starred[selected.id] ? "text-amber-500 fill-amber-500" : "text-gray-400 hover:text-amber-400"}
              />
            </button>
            <div className="ml-auto">
              <button className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
                <MoreHorizontal size={15} />
              </button>
            </div>
          </div>

          {/* Subject */}
          <h1 className="text-xl font-bold text-gray-900 mb-4 leading-snug">{selected.subject}</h1>

          {/* Sender info */}
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full ${selected.avatarBg} ${selected.avatarText} flex items-center justify-center text-[14px] font-bold shrink-0`}>
              {selected.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[14px] font-semibold text-gray-900">{selected.from}</span>
                <span className="text-[11px] text-gray-300">•</span>
                <span className="text-[11px] text-gray-400">{selected.time}</span>
              </div>
              <p className="text-[11px] text-gray-400 mt-0.5">{selected.email}</p>
            </div>
          </div>
        </div>

        {/* Email Body */}
        <div className="flex-1 overflow-y-auto px-8 py-7 bg-white">
          <div className="max-w-2xl space-y-0">
            {selected.body.split("\n").map((line, i) => (
              line === "" ? (
                <div key={i} className="h-4" />
              ) : (
                <p key={i} className={`text-[14px] leading-relaxed text-gray-600 ${line.startsWith("•") ? "pl-4" : ""}`}>
                  {line}
                </p>
              )
            ))}
          </div>
        </div>

        {/* Reply Box */}
        <div className="px-6 pb-6 pt-4 border-t border-gray-200 bg-gray-50 shrink-0">
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
            {/* Reply context pill */}
            <div className="px-4 pt-3.5 flex items-center gap-2">
              <Reply size={12} className="text-gray-300" />
              <span className="text-[11px] text-gray-400">Replying to <span className="text-gray-600 font-medium">{selected.from}</span></span>
            </div>

            {/* Textarea */}
            <textarea
              value={reply}
              onChange={e => setReply(e.target.value)}
              placeholder="Write your reply..."
              rows={4}
              className="w-full px-4 pt-3 pb-2 bg-transparent text-[13px] text-gray-700 placeholder-gray-400 resize-none outline-none leading-relaxed"
            />

            {/* Toolbar */}
            <div className="px-3 pb-3 flex items-center justify-between">
              <div className="flex items-center gap-1">
                <button className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
                  <Paperclip size={15} />
                </button>
                <button className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
                  <MoreHorizontal size={15} />
                </button>
              </div>

              <button
                disabled={!reply.trim()}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-[12px] font-semibold shadow-sm disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <Send size={13} strokeWidth={2.5} /> Send
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Compose Modal ──────────────────────────────────────────── */}
      {composeOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[520px] bg-white border border-gray-200 rounded-2xl shadow-2xl shadow-gray-200/80 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3.5 bg-gray-50 border-b border-gray-200">
            <h3 className="text-[13px] font-semibold text-gray-800">New Message</h3>
            <button
              onClick={() => setComposeOpen(false)}
              className="p-1 rounded text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition-colors"
            >
              <X size={15} />
            </button>
          </div>
          <div className="flex flex-col divide-y divide-gray-100">
            {["To", "Subject"].map(label => (
              <div key={label} className="flex items-center gap-3 px-5 py-2.5">
                <span className="text-[11px] text-gray-400 font-medium w-12 shrink-0">{label}</span>
                <input
                  type="text"
                  className="flex-1 bg-transparent text-[13px] text-gray-700 placeholder-gray-400 outline-none"
                  placeholder={label === "To" ? "Recipients..." : "Subject..."}
                />
              </div>
            ))}
          </div>
          <textarea
            rows={8}
            placeholder="Write your message..."
            className="flex-1 px-5 py-4 bg-white text-[13px] text-gray-700 placeholder-gray-400 resize-none outline-none leading-relaxed"
          />
          <div className="px-4 pb-4 flex items-center justify-between border-t border-gray-100 pt-3">
            <button className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
              <Paperclip size={15} />
            </button>
            <button className="flex items-center gap-2 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-[12px] font-semibold shadow-sm transition-all">
              <Send size={13} strokeWidth={2.5} /> Send Message
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
