"use client";

import { useState } from "react";
import { Icon } from "../shared/Icon";

interface DiscountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (discount: { type: "percentage" | "amount"; value: number }) => void;
  onRemove: () => void;
}

export const DiscountModal = ({ isOpen, onClose, onApply, onRemove }: DiscountModalProps) => {
  const [discountType, setDiscountType] = useState<"percentage" | "amount">("amount");
  const [discountValue, setDiscountValue] = useState<string>("0.00");

  if (!isOpen) return null;

  const handleApply = () => {
    const value = parseFloat(discountValue) || 0;
    onApply({ type: discountType, value });
    onClose();
  };

  const handleCancel = () => {
    setDiscountValue("0.00");
    onClose();
  };

  const handleRemove = () => {
    setDiscountValue("0.00");
    onRemove();
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed left-1/4 top-1/2 -translate-y-1/2 z-50 bg-white rounded-xl shadow-2xl border border-gray-200 w-[420px] p-8">
        <h2 className="text-gray-900 text-xl font-semibold mb-8">Add discount</h2>

        {/* Toggle buttons and input */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setDiscountType("percentage")}
            className={`py-3 px-4 rounded-lg border-2 text-base font-medium transition-colors ${
              discountType === "percentage"
                ? "border-blue-500 bg-blue-50 text-blue-600"
                : "border-gray-300 bg-white text-gray-600 hover:border-gray-400"
            }`}
          >
            %
          </button>
          <button
            onClick={() => setDiscountType("amount")}
            className={`py-3 px-4 rounded-lg border-2 text-base font-medium transition-colors ${
              discountType === "amount"
                ? "border-blue-500 bg-blue-50 text-blue-600"
                : "border-gray-300 bg-white text-gray-600 hover:border-gray-400"
            }`}
          >
            GH₵
          </button>
          <input
            type="text"
            value={discountType === "percentage" ? `${discountValue}%` : `GH₵ ${discountValue}`}
            onChange={(e) => {
              const value = e.target.value.replace(/[^0-9.]/g, "");
              setDiscountValue(value);
            }}
            className="w-40 py-3 px-4 rounded-lg border-2 border-gray-300 bg-white text-gray-900 text-base font-medium focus:outline-none focus:border-blue-500 transition-colors"
          />
          <button
            onClick={handleRemove}
            className="py-3 px-4 rounded-lg border-2 border-gray-300 bg-white text-gray-600 hover:border-gray-400 hover:text-red-500 transition-colors flex items-center justify-center"
          >
            <Icon name="Trash2" size={18} />
          </button>
        </div>

        {/* Helper text */}
        <p className="text-gray-500 text-sm mb-8">
          This discount will be applied to all items
        </p>

        {/* Action buttons */}
        <div className="flex gap-4">
          <button
            onClick={handleCancel}
            className="flex-1 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 hover:bg-gray-50 transition-colors text-base font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            className="flex-1 py-3 rounded-lg bg-[#6366f1] hover:bg-[#5558e3] text-white transition-colors text-base font-semibold"
          >
            Add
          </button>
        </div>
      </div>
    </>
  );
};
