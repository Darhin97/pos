"use client";

import { useState } from "react";
import { Icon } from "../shared/Icon";

interface PromoCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (promoCode: string) => void;
  onRemove: () => void;
}

export const PromoCodeModal = ({ isOpen, onClose, onApply, onRemove }: PromoCodeModalProps) => {
  const [promoCode, setPromoCode] = useState<string>("");

  if (!isOpen) return null;

  const handleApply = () => {
    if (promoCode.trim()) {
      onApply(promoCode.trim());
      onClose();
    }
  };

  const handleCancel = () => {
    setPromoCode("");
    onClose();
  };

  const handleRemove = () => {
    setPromoCode("");
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
        <h2 className="text-gray-900 text-xl font-semibold mb-8">Add promo code</h2>

        {/* Promo Code Input */}
        <div className="flex gap-3 mb-6">
          <input
            type="text"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            placeholder="Enter promo code"
            className="flex-1 py-3 px-4 rounded-lg border-2 border-gray-300 bg-white text-gray-900 text-base placeholder:text-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
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
          Enter a valid promo code to apply discount
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
            Apply
          </button>
        </div>
      </div>
    </>
  );
};
