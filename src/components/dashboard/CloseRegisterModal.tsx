"use client";

import { useState, useEffect, useRef } from "react";
import { Icon } from "../shared/Icon";
import { ShiftSummary } from "@/lib/types";

interface CloseRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCloseRegister: (data: { closing_cash: number; closing_notes?: string }) => void;
  shiftSummary: ShiftSummary;
}

export const CloseRegisterModal = ({
  isOpen,
  onClose,
  onCloseRegister,
  shiftSummary,
}: CloseRegisterModalProps) => {
  const [closingCash, setClosingCash] = useState("");
  const [closingNotes, setClosingNotes] = useState("");
  const [error, setError] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const discrepancy = closingCash
    ? parseFloat(closingCash) - shiftSummary.expected_cash
    : 0;

  useEffect(() => {
    if (isOpen) {
      setClosingCash("");
      setClosingNotes("");
      setError("");
      setShowConfirmation(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    const cash = parseFloat(closingCash);

    if (!closingCash.trim()) {
      setError("Closing cash count is required");
      return;
    }

    if (isNaN(cash) || cash < 0) {
      setError("Please enter a valid positive amount");
      return;
    }

    // Show confirmation if there's a discrepancy
    if (Math.abs(discrepancy) > 0 && !showConfirmation) {
      setShowConfirmation(true);
      return;
    }

    onCloseRegister({
      closing_cash: cash,
      closing_notes: closingNotes.trim() || undefined,
    });
    onClose();
  };

  const formatCurrency = (amount: number) => {
    return `GH₵ ${amount.toFixed(2)}`;
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">

          {/* Header */}
          <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-gray-100">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-red-50 border border-red-200 flex items-center justify-center">
                  <Icon name="Lock" size={16} className="text-red-600" />
                </div>
              </div>
              <h2 className="text-lg font-semibold text-slate-900">
                Close Register
              </h2>
              <p className="text-sm text-gray-500 mt-0.5">
                Finalize payments and sales for your shift
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors shrink-0 mt-0.5"
            >
              <Icon name="X" size={16} />
            </button>
          </div>

          {/* Body */}
          <div className="px-6 py-5">
            <div className="space-y-4">

              {/* Shift Summary */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-slate-900 mb-3">Shift Summary</h3>
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Opened at</span>
                    <span className="text-slate-900 font-medium">{formatDate(shiftSummary.opened_at)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Opening float</span>
                    <span className="text-slate-900 font-medium">{formatCurrency(shiftSummary.opening_float)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Total sales</span>
                    <span className="text-slate-900 font-medium">{formatCurrency(shiftSummary.sales_total)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Transactions</span>
                    <span className="text-slate-900 font-medium">{shiftSummary.transaction_count}</span>
                  </div>
                  <div className="h-px bg-gray-200 my-2"></div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-900 font-semibold">Expected cash</span>
                    <span className="text-slate-900 font-bold">{formatCurrency(shiftSummary.expected_cash)}</span>
                  </div>
                </div>
              </div>

              {/* Payment Breakdown */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-slate-900 mb-3">Payment Breakdown</h3>
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="flex items-center gap-2">
                    <Icon name="Banknote" size={14} className="text-gray-500" />
                    <span className="text-xs text-gray-600">Cash:</span>
                    <span className="text-xs text-slate-900 font-medium ml-auto">{formatCurrency(shiftSummary.payment_breakdown.cash)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon name="CreditCard" size={14} className="text-gray-500" />
                    <span className="text-xs text-gray-600">Card:</span>
                    <span className="text-xs text-slate-900 font-medium ml-auto">{formatCurrency(shiftSummary.payment_breakdown.card)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon name="Smartphone" size={14} className="text-gray-500" />
                    <span className="text-xs text-gray-600">Mobile:</span>
                    <span className="text-xs text-slate-900 font-medium ml-auto">{formatCurrency(shiftSummary.payment_breakdown.mobile)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon name="Wallet" size={14} className="text-gray-500" />
                    <span className="text-xs text-gray-600">Other:</span>
                    <span className="text-xs text-slate-900 font-medium ml-auto">{formatCurrency(shiftSummary.payment_breakdown.other)}</span>
                  </div>
                </div>
              </div>

              {/* Actual Cash Count */}
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">
                  Actual Cash Counted <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">
                    GH₵
                  </div>
                  <input
                    ref={inputRef}
                    type="number"
                    step="0.01"
                    min="0"
                    value={closingCash}
                    onChange={(e) => {
                      setClosingCash(e.target.value);
                      setError("");
                      setShowConfirmation(false);
                    }}
                    placeholder="0.00"
                    className={`w-full border ${
                      error ? "border-red-400" : "border-gray-300"
                    } rounded-lg pl-14 pr-3 py-2.5 text-sm text-slate-900 placeholder:text-gray-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-colors`}
                  />
                </div>
                {error && (
                  <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                    <Icon name="AlertCircle" size={12} />
                    {error}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1.5">
                  Count all cash in the register drawer
                </p>
              </div>

              {/* Discrepancy Alert */}
              {closingCash && Math.abs(discrepancy) > 0 && (
                <div className={`flex items-start gap-2 p-3 border rounded-lg ${
                  discrepancy > 0
                    ? "bg-green-50 border-green-200"
                    : "bg-yellow-50 border-yellow-200"
                }`}>
                  <Icon
                    name={discrepancy > 0 ? "TrendingUp" : "TrendingDown"}
                    size={14}
                    className={discrepancy > 0 ? "text-green-600" : "text-yellow-600"}
                  />
                  <div className="flex-1">
                    <p className={`text-xs font-semibold ${
                      discrepancy > 0 ? "text-green-800" : "text-yellow-800"
                    }`}>
                      {discrepancy > 0 ? "Overage" : "Shortage"}: {formatCurrency(Math.abs(discrepancy))}
                    </p>
                    <p className={`text-xs mt-0.5 ${
                      discrepancy > 0 ? "text-green-700" : "text-yellow-700"
                    }`}>
                      {discrepancy > 0
                        ? "You have more cash than expected"
                        : "You have less cash than expected"}
                    </p>
                  </div>
                </div>
              )}

              {/* Closing Notes */}
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">
                  Notes{" "}
                  <span className="text-gray-400 font-normal text-xs">(optional)</span>
                </label>
                <textarea
                  rows={2}
                  value={closingNotes}
                  onChange={(e) => setClosingNotes(e.target.value)}
                  placeholder="Add any notes about this shift closing..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-slate-900 placeholder:text-gray-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-colors resize-none"
                />
              </div>

              {/* Confirmation Warning */}
              {showConfirmation && (
                <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <Icon name="AlertTriangle" size={14} className="text-red-600 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-red-800">Confirm Discrepancy</p>
                    <p className="text-xs text-red-700 mt-0.5">
                      You are about to close with a discrepancy. Click &quot;Close Register&quot; again to confirm.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 pb-5">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-slate-700 rounded-lg text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className={`px-5 py-2 ${
                showConfirmation
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-blue-600 hover:bg-blue-700"
              } text-white rounded-lg text-sm font-semibold transition-colors flex items-center gap-2`}
            >
              <Icon name="Lock" size={14} />
              Close Register
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
