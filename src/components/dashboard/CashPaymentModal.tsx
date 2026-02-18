"use client";

import { useState, useEffect } from "react";
import { Icon } from "../shared/Icon";

interface CashPaymentModalProps {
  isOpen: boolean;
  total: number;
  onClose: () => void;
  onComplete: (data: { amountGiven: number; change: number }) => void;
}

export const CashPaymentModal = ({
  isOpen,
  total,
  onClose,
  onComplete,
}: CashPaymentModalProps) => {
  const [amountGiven, setAmountGiven] = useState("");

  // Reset input when modal opens
  useEffect(() => {
    if (isOpen) setAmountGiven("");
  }, [isOpen]);

  if (!isOpen) return null;

  const given = parseFloat(amountGiven) || 0;
  const change = given - total;
  const hasChange = given > 0 && change >= 0;
  const isShort = given > 0 && change < 0;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div className="flex items-center justify-between w-full">
              <span className="text-base font-semibold text-slate-900">Amount to pay</span>
              <span className="text-base font-semibold text-slate-900">
                GH₵{total.toFixed(2)}
              </span>
            </div>
            <button
              onClick={onClose}
              className="ml-4 p-1 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors shrink-0"
            >
              <Icon name="X" size={18} />
            </button>
          </div>

          {/* Body */}
          <div className="px-6 py-5 space-y-4">
            <p className="text-sm font-medium text-slate-900">Amount given by customer</p>

            {/* Input row */}
            <div className="flex gap-3">
              {/* Amount input */}
              <div className="flex-1 flex items-center border border-[#6366f1] rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-[#6366f1]/20">
                <span className="pl-4 pr-2 text-sm text-gray-500 shrink-0">GH₵</span>
                <input
                  autoFocus
                  type="number"
                  min="0"
                  step="0.01"
                  value={amountGiven}
                  onChange={(e) => setAmountGiven(e.target.value)}
                  placeholder="0.00"
                  className="flex-1 py-3 pr-4 text-sm text-right text-slate-900 outline-none bg-transparent"
                />
              </div>

              {/* Quick-fill button */}
              <button
                onClick={() => setAmountGiven(total.toFixed(2))}
                className="px-4 py-3 bg-slate-700 hover:bg-slate-800 text-white rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
              >
                GH₵{total.toFixed(2)}
              </button>
            </div>

            {/* Change / short display */}
            {hasChange && (
              <div className="flex items-center justify-between px-4 py-3 bg-green-50 border border-green-200 rounded-lg">
                <span className="text-sm font-medium text-green-700">Change</span>
                <span className="text-sm font-semibold text-green-700">
                  GH₵{change.toFixed(2)}
                </span>
              </div>
            )}
            {isShort && (
              <div className="flex items-center justify-between px-4 py-3 bg-red-50 border border-red-200 rounded-lg">
                <span className="text-sm font-medium text-red-600">Amount short</span>
                <span className="text-sm font-semibold text-red-600">
                  GH₵{Math.abs(change).toFixed(2)}
                </span>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 pb-5">
            <button
              disabled={given <= 0 || isShort}
              onClick={() => onComplete({ amountGiven: given, change })}
              className="w-full py-3 bg-[#6366f1] hover:bg-[#5558e3] disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg font-semibold text-sm transition-colors flex items-center justify-center gap-2"
            >
              <Icon name="Check" size={16} />
              Complete Sale
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
