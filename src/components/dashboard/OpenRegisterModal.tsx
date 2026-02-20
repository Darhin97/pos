"use client";

import { useState, useEffect, useRef } from "react";
import { Icon } from "../shared/Icon";

interface OpenRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenRegister: (data: { opening_float: number; opening_notes?: string }) => void;
}

export const OpenRegisterModal = ({
  isOpen,
  onClose,
  onOpenRegister,
}: OpenRegisterModalProps) => {
  const [openingFloat, setOpeningFloat] = useState("");
  const [openingNotes, setOpeningNotes] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setOpeningFloat("");
      setOpeningNotes("");
      setError("");
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    const float = parseFloat(openingFloat);

    if (!openingFloat.trim()) {
      setError("Opening float is required");
      return;
    }

    if (isNaN(float) || float < 0) {
      setError("Please enter a valid positive amount");
      return;
    }

    onOpenRegister({
      opening_float: float,
      opening_notes: openingNotes.trim() || undefined,
    });
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-md">

          {/* Header */}
          <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-gray-100">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-green-50 border border-green-200 flex items-center justify-center">
                  <Icon name="DollarSign" size={16} className="text-green-600" />
                </div>
              </div>
              <h2 className="text-lg font-semibold text-slate-900">
                Open Register
              </h2>
              <p className="text-sm text-gray-500 mt-0.5">
                Set an opening float to start your shift and make sales
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
              {/* Opening Float */}
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">
                  Opening Float <span className="text-red-500">*</span>
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
                    value={openingFloat}
                    onChange={(e) => {
                      setOpeningFloat(e.target.value);
                      setError("");
                    }}
                    onKeyDown={handleKeyDown}
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
                  Enter the initial cash amount in the register
                </p>
              </div>

              {/* Opening Notes */}
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">
                  Notes{" "}
                  <span className="text-gray-400 font-normal text-xs">(optional)</span>
                </label>
                <textarea
                  rows={3}
                  value={openingNotes}
                  onChange={(e) => setOpeningNotes(e.target.value)}
                  placeholder="Add any notes about this shift opening..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-slate-900 placeholder:text-gray-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-colors resize-none"
                />
              </div>

              {/* Info Banner */}
              <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <Icon name="Info" size={14} className="text-blue-600 shrink-0 mt-0.5" />
                <p className="text-xs text-blue-700">
                  Before starting your shift, make sure to count the cash at hand. After opening, you&apos;ll be redirected to the orders page.
                </p>
              </div>
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
              className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"
            >
              <Icon name="CheckCircle" size={14} />
              Open Register
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
