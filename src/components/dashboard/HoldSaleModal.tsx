"use client";

import { useState } from "react";
import { Icon } from "../shared/Icon";

interface HoldSaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (reason: string) => void;
}

export const HoldSaleModal = ({ isOpen, onClose, onSave }: HoldSaleModalProps) => {
  const [reason, setReason] = useState("");

  if (!isOpen) return null;

  const handleSave = () => {
    if (reason.trim()) {
      onSave(reason.trim());
      setReason("");
      onClose();
    }
  };

  const handleCancel = () => {
    setReason("");
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />

      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-xl shadow-2xl border border-gray-200 w-[500px] p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-gray-900 text-xl font-semibold">Hold Sale</h2>
          <button
            onClick={handleCancel}
            className="text-gray-500 hover:text-gray-900 transition-colors"
          >
            <Icon name="X" size={24} />
          </button>
        </div>

        {/* Reason Input */}
        <div className="mb-6">
          <label className="block text-gray-700 text-base mb-3 font-medium">
            Reason for holding sale
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Enter reason (e.g., Customer needs more time, Waiting for approval, etc.)"
            rows={4}
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 text-base placeholder:text-gray-400 focus:outline-none focus:border-blue-500 transition-colors resize-none"
          />
        </div>

        {/* Action buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={handleCancel}
            className="px-6 py-2.5 border border-gray-300 text-gray-900 text-base rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!reason.trim()}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-base rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Hold Sale
          </button>
        </div>
      </div>
    </>
  );
};
