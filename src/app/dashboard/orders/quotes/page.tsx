"use client";

import { useState } from "react";
import { Icon } from "@/components/shared/Icon";
import { CreateQuoteModal } from "@/components/dashboard/CreateQuoteModal";

export default function QuotesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-none p-6 pb-0">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
          <span>Orders</span>
          <Icon name="ChevronRight" size={12} />
          <span className="text-slate-900 font-medium">Quotes</span>
        </div>

        {/* Title row */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900 mb-1">
              Quotes
            </h1>
            <p className="text-gray-500 text-sm">
              Create and manage customer quotes
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors"
          >
            <Icon name="FilePlus" size={16} />
            Create Quote
          </button>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
        No quotes yet. Click &quot;Create Quote&quot; to get started.
      </div>

      <CreateQuoteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreateQuote={(data) => {
          // TODO: persist quote
          console.log("Quote created:", data);
          setIsModalOpen(false);
        }}
      />
    </div>
  );
}
