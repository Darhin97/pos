"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useShift } from "@/contexts/ShiftContext";
import { OpenRegisterModal } from "@/components/dashboard/OpenRegisterModal";
import { CloseRegisterModal } from "@/components/dashboard/CloseRegisterModal";
import { Icon } from "@/components/shared/Icon";

export default function RegisterPage() {
  const router = useRouter();
  const { isShiftOpen, currentShift, openShift, closeShift, getShiftSummary } = useShift();
  const [showOpenModal, setShowOpenModal] = useState(!isShiftOpen);
  const [showCloseModal, setShowCloseModal] = useState(false);

  const handleOpenRegister = (data: { opening_float: number; opening_notes?: string }) => {
    openShift(data);
    setShowOpenModal(false);
    // Redirect to orders page after opening
    router.push("/dashboard/orders");
  };

  const handleCloseRegister = (data: { closing_cash: number; closing_notes?: string }) => {
    closeShift(data);
    setShowCloseModal(false);
    setShowOpenModal(true);
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

  const shiftSummary = getShiftSummary();

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Register Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your register shifts and cash operations
          </p>
        </div>

        {/* Status Card */}
        {isShiftOpen && currentShift && shiftSummary ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            {/* Status Badge */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-50 border border-green-200 flex items-center justify-center">
                  <Icon name="Unlock" size={20} className="text-green-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Register Open</h2>
                  <p className="text-sm text-gray-500">Your shift is currently active</p>
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-semibold text-green-700">Active</span>
              </div>
            </div>

            {/* Shift Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Left Column */}
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Icon name="Clock" size={16} className="text-gray-500" />
                    <h3 className="text-sm font-semibold text-slate-900">Shift Information</h3>
                  </div>
                  <div className="space-y-2.5">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Opened at</span>
                      <span className="text-slate-900 font-medium">{formatDate(currentShift.opened_at)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Cashier</span>
                      <span className="text-slate-900 font-medium">{currentShift.opened_by}</span>
                    </div>
                    {currentShift.opening_notes && (
                      <div className="pt-2 border-t border-gray-200">
                        <p className="text-xs text-gray-600 mb-1">Opening Notes</p>
                        <p className="text-sm text-slate-900">{currentShift.opening_notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Icon name="DollarSign" size={16} className="text-gray-500" />
                    <h3 className="text-sm font-semibold text-slate-900">Financial Summary</h3>
                  </div>
                  <div className="space-y-2.5">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Opening float</span>
                      <span className="text-slate-900 font-medium">{formatCurrency(currentShift.opening_float)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Total sales</span>
                      <span className="text-slate-900 font-medium">{formatCurrency(currentShift.sales_total)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Transactions</span>
                      <span className="text-slate-900 font-medium">{currentShift.transaction_count}</span>
                    </div>
                    <div className="h-px bg-gray-200 my-2"></div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-900 font-semibold">Expected cash</span>
                      <span className="text-slate-900 font-bold">{formatCurrency(shiftSummary.expected_cash)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={() => router.push("/dashboard/orders")}
                className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <Icon name="ShoppingCart" size={16} />
                Go to Orders
              </button>
              <button
                onClick={() => setShowCloseModal(true)}
                className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <Icon name="Lock" size={16} />
                Close Register
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 border-2 border-gray-200 flex items-center justify-center mx-auto mb-4">
              <Icon name="Lock" size={28} className="text-gray-400" />
            </div>
            <h2 className="text-lg font-semibold text-slate-900 mb-2">Register Closed</h2>
            <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">
              Open your register to start your shift and begin processing sales
            </p>
            <button
              onClick={() => setShowOpenModal(true)}
              className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-semibold transition-colors inline-flex items-center gap-2"
            >
              <Icon name="Unlock" size={16} />
              Open Register
            </button>
          </div>
        )}
      </div>

      {/* Modals */}
      <OpenRegisterModal
        isOpen={showOpenModal}
        onClose={() => setShowOpenModal(false)}
        onOpenRegister={handleOpenRegister}
      />

      {shiftSummary && (
        <CloseRegisterModal
          isOpen={showCloseModal}
          onClose={() => setShowCloseModal(false)}
          onCloseRegister={handleCloseRegister}
          shiftSummary={shiftSummary}
        />
      )}
    </div>
  );
}
