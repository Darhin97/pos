"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/shared/Icon";
import { PageHeader } from "@/components/shared/PageHeader";
import { ContentContainer } from "@/components/shared/ContentContainer";
import { QUOTES } from "@/lib/data";
import { Quote } from "@/lib/types";

type StatusFilter = "All" | "Open" | "Closed" | "Expired" | "Converted";

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

const formatDate = (ts: number) => {
  const d = new Date(ts);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }) + ", " + d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
};

const AVATAR_COLORS: Record<string, string> = {
  JG: "bg-purple-600",
  JB: "bg-purple-500",
  SJ: "bg-blue-600",
  EW: "bg-pink-600",
  AK: "bg-teal-600",
};

const getAvatarColor = (initials: string) =>
  AVATAR_COLORS[initials] ?? "bg-gray-500";

const StatusBadge = ({ status }: { status: Quote["status"] }) => {
  const styles: Record<Quote["status"], string> = {
    Open: "bg-green-100 text-green-700 border border-green-200",
    Closed: "bg-gray-100 text-gray-600 border border-gray-200",
    Expired: "bg-red-100 text-red-600 border border-red-200",
    Converted: "bg-blue-100 text-blue-700 border border-blue-200",
  };
  return (
    <span className={`inline-flex items-center justify-center w-24 px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}>
      {status}
    </span>
  );
};

export default function QuotesPage() {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("Open");
  const [customerSearch, setCustomerSearch] = useState("");
  const [quoteSearch, setQuoteSearch] = useState("");
  const [activeStatus, setActiveStatus] = useState<StatusFilter>("Open");
  const [activeCustomer, setActiveCustomer] = useState("");
  const [activeQuote, setActiveQuote] = useState("");
  const [sortAsc, setSortAsc] = useState(false);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [allQuotes] = useState<Quote[]>(() => {
    // Load quotes from localStorage and merge with QUOTES on initial mount
    if (typeof window !== "undefined") {
      const storedQuotes = JSON.parse(localStorage.getItem("quotes") || "[]");
      return [...storedQuotes, ...QUOTES];
    }
    return QUOTES;
  });

  const handleSearch = () => {
    setActiveStatus(statusFilter);
    setActiveCustomer(customerSearch);
    setActiveQuote(quoteSearch);
  };

  const handleRetrieveQuote = (quote: Quote) => {
    // Store quote data in localStorage for orders page to retrieve
    localStorage.setItem("retrievedQuote", JSON.stringify(quote));
    // Navigate to orders page
    router.push("/dashboard/orders");
  };

  const filtered = useMemo(() => {
    let results = [...allQuotes];

    if (activeStatus !== "All") {
      results = results.filter((q) => q.status === activeStatus);
    }
    if (activeCustomer.trim()) {
      const term = activeCustomer.toLowerCase();
      results = results.filter((q) => q.customer.name.toLowerCase().includes(term));
    }
    if (activeQuote.trim()) {
      results = results.filter((q) => q.quoteNumber.includes(activeQuote.trim()));
    }

    results.sort((a, b) => sortAsc ? a.id - b.id : b.id - a.id);
    return results;
  }, [allQuotes, activeStatus, activeCustomer, activeQuote, sortAsc]);

  const resultLabel = (() => {
    const count = filtered.length;
    const parts: string[] = [];
    if (activeStatus !== "All") parts.push(`status "${activeStatus}"`);
    if (activeCustomer.trim()) parts.push(`customer "${activeCustomer}"`);
    if (activeQuote.trim()) parts.push(`quote "${activeQuote}"`);

    const qualifier = parts.length > 0 ? ` matching ${parts.join(", ")}` : "";
    return `Displaying ${count} quote${count !== 1 ? "s" : ""}${qualifier}`;
  })();

  return (
    <div className="flex flex-col h-full overflow-auto">
      <PageHeader
        breadcrumbs={[
          { label: "Orders" },
          { label: "Quotes" }
        ]}
        title="Quotes"
        description="View or process quotes."
      />

      {/* Filter bar */}
      <div className="flex-none px-8 pb-4">
        <ContentContainer>
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <div className="flex flex-wrap items-end gap-3">
            {/* Status */}
            <div className="flex flex-col gap-1 min-w-[160px]">
              <label className="text-xs font-medium text-gray-600">Status</label>
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                  className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-3 py-2 pr-8 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-colors cursor-pointer"
                >
                  <option value="All">All</option>
                  <option value="Open">Open</option>
                  <option value="Closed">Closed</option>
                  <option value="Expired">Expired</option>
                  <option value="Converted">Converted</option>
                </select>
                <Icon
                  name="ChevronDown"
                  size={14}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
              </div>
            </div>

            {/* Customer */}
            <div className="flex flex-col gap-1 flex-1 min-w-[180px]">
              <label className="text-xs font-medium text-gray-600">Customer</label>
              <div className="relative flex items-center">
                <Icon
                  name="User"
                  size={14}
                  className="absolute left-3 text-gray-400"
                />
                <input
                  type="text"
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  placeholder="Search for customers"
                  className="w-full border border-gray-300 rounded-lg pl-8 pr-3 py-2 text-sm text-slate-900 placeholder:text-gray-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-colors"
                />
              </div>
            </div>

            {/* Quote number */}
            <div className="flex flex-col gap-1 flex-1 min-w-[180px]">
              <label className="text-xs font-medium text-gray-600">Quote</label>
              <div className="relative flex items-center">
                <Icon
                  name="Search"
                  size={14}
                  className="absolute left-3 text-gray-400"
                />
                <input
                  type="text"
                  value={quoteSearch}
                  onChange={(e) => setQuoteSearch(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  placeholder="Search quote number"
                  className="w-full border border-gray-300 rounded-lg pl-8 pr-3 py-2 text-sm text-slate-900 placeholder:text-gray-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-colors"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-end gap-2 pb-0">
              <button
                onClick={handleSearch}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors"
              >
                Search
              </button>
            </div>
          </div>
        </div>
        </ContentContainer>
      </div>

      {/* Results */}
      <div className="flex-1 px-8 pb-8 min-h-0">
        <ContentContainer className="h-full flex flex-col">
        {/* Count */}
        <p className="text-xs text-gray-500 mb-3">{resultLabel}</p>

        {/* Table */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-[2fr_2.5fr_2fr_1.5fr_1.5fr_1fr_100px] border-b border-gray-100 px-4">
            <button
              onClick={() => setSortAsc((v) => !v)}
              className="flex items-center gap-1.5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hover:text-slate-900 transition-colors text-left"
            >
              Quote
              <Icon name="ArrowUpDown" size={12} className="text-gray-400" />
            </button>
            <span className="py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Customer
            </span>
            <span className="py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Served by
            </span>
            <span className="py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Note
            </span>
            <button
              className="py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide underline underline-offset-2 hover:text-slate-900 transition-colors text-left"
            >
              Quote total
            </button>
            <span className="py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Status
            </span>
            <span />
          </div>

          {/* Empty state */}
          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <Icon name="FileText" size={32} className="mb-3 opacity-40" />
              <p className="text-sm">No quotes found</p>
            </div>
          )}

          {/* Rows */}
          {filtered.map((quote, idx) => {
            const custInitials = getInitials(quote.customer.name);
            const serverInitials = getInitials(quote.servedBy.name);
            const isExpanded = expandedRow === quote.id;
            const isLast = idx === filtered.length - 1;

            return (
              <div key={quote.id} className={!isLast ? "border-b border-gray-100" : ""}>
                {/* Main row */}
                <div
                  className="grid grid-cols-[2fr_2.5fr_2fr_1.5fr_1.5fr_1fr_100px] px-4 py-3 hover:bg-gray-50 transition-colors items-center cursor-pointer"
                  onClick={() => setExpandedRow(isExpanded ? null : quote.id)}
                >
                  {/* Quote number + date */}
                  <div className="flex items-center gap-2">
                    <Icon
                      name={isExpanded ? "ChevronDown" : "ChevronRight"}
                      size={14}
                      className="text-gray-400 shrink-0"
                    />
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {quote.quoteNumber}
                      </p>
                      <p className="text-xs text-gray-500">{formatDate(quote.createdAt)}</p>
                    </div>
                  </div>

                  {/* Customer */}
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-8 h-8 rounded-md ${getAvatarColor(custInitials)} flex items-center justify-center text-white text-xs font-bold shrink-0`}
                    >
                      {custInitials}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-blue-600 truncate hover:underline">
                        {quote.customer.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {quote.customer.customerId} | {quote.customer.email}
                      </p>
                    </div>
                  </div>

                  {/* Served by */}
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-8 h-8 rounded-md ${getAvatarColor(serverInitials)} flex items-center justify-center text-white text-xs font-bold shrink-0`}
                    >
                      {serverInitials}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm text-slate-900 truncate">{quote.servedBy.name}</p>
                      <p className="text-xs text-gray-500 truncate">{quote.servedBy.outlet}</p>
                    </div>
                  </div>

                  {/* Note */}
                  <p className="text-sm text-gray-500 truncate pr-2">
                    {quote.note || ""}
                  </p>

                  {/* Total */}
                  <p className="text-sm font-medium text-slate-900">
                    GH&#8373;{quote.total.toFixed(2)}
                  </p>

                  {/* Status */}
                  <StatusBadge status={quote.status} />

                  {/* Action */}
                  <div className="flex justify-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRetrieveQuote(quote);
                      }}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-gray-300 text-slate-700 hover:bg-gray-100 transition-colors whitespace-nowrap"
                    >
                      Retrieve
                    </button>
                  </div>
                </div>

                {/* Expanded: items */}
                {isExpanded && (
                  <div className="bg-gray-50 border-t border-gray-100 px-14 py-3">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                      Items
                    </p>
                    <div className="space-y-1.5">
                      {quote.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between text-sm"
                        >
                          <span className="text-slate-800">
                            {item.name}{" "}
                            <span className="text-gray-400 text-xs">x{item.qty}</span>
                          </span>
                          <span className="text-slate-700 font-medium">
                            GH&#8373;{(item.price * item.qty).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-2 pt-2 border-t border-gray-200 flex justify-between text-sm font-semibold text-slate-900">
                      <span>Total</span>
                      <span>GH&#8373;{quote.total.toFixed(2)}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        </ContentContainer>
      </div>
    </div>
  );
}
