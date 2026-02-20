"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { RegisterShift, ShiftSummary, PaymentBreakdown } from "@/lib/types";

interface ShiftContextType {
  currentShift: RegisterShift | null;
  isShiftOpen: boolean;
  openShift: (data: { opening_float: number; opening_notes?: string }) => void;
  closeShift: (data: { closing_cash: number; closing_notes?: string }) => void;
  getShiftSummary: () => ShiftSummary | null;
}

const ShiftContext = createContext<ShiftContextType | undefined>(undefined);

const SHIFT_STORAGE_KEY = "pos_current_shift";

export const ShiftProvider = ({ children }: { children: ReactNode }) => {
  const [currentShift, setCurrentShift] = useState<RegisterShift | null>(null);

  // Load shift from localStorage on mount
  useEffect(() => {
    const storedShift = localStorage.getItem(SHIFT_STORAGE_KEY);
    if (storedShift) {
      try {
        const shift = JSON.parse(storedShift) as RegisterShift;
        // Only load if shift is still open
        if (shift.status === "open") {
          setCurrentShift(shift);
        } else {
          // Clean up closed shifts
          localStorage.removeItem(SHIFT_STORAGE_KEY);
        }
      } catch (e) {
        console.error("Failed to parse stored shift:", e);
        localStorage.removeItem(SHIFT_STORAGE_KEY);
      }
    }
  }, []);

  // Save shift to localStorage whenever it changes
  useEffect(() => {
    if (currentShift) {
      localStorage.setItem(SHIFT_STORAGE_KEY, JSON.stringify(currentShift));
    } else {
      localStorage.removeItem(SHIFT_STORAGE_KEY);
    }
  }, [currentShift]);

  const openShift = (data: { opening_float: number; opening_notes?: string }) => {
    const newShift: RegisterShift = {
      id: `shift_${Date.now()}`,
      register_id: "register_1", // TODO: Get from actual register
      cashier_id: "cashier_1", // TODO: Get from authenticated user
      tenant_id: "tenant_1", // TODO: Get from tenant context
      opened_at: Date.now(),
      opened_by: "Current User", // TODO: Get from authenticated user
      opening_float: data.opening_float,
      opening_notes: data.opening_notes,
      status: "open",
      sales_total: 0,
      transaction_count: 0,
    };

    setCurrentShift(newShift);
  };

  const closeShift = (data: { closing_cash: number; closing_notes?: string }) => {
    if (!currentShift) return;

    const closedShift: RegisterShift = {
      ...currentShift,
      status: "closed",
      closed_at: Date.now(),
      closed_by: "Current User", // TODO: Get from authenticated user
      closing_cash: data.closing_cash,
      expected_cash: currentShift.opening_float + currentShift.sales_total,
      closing_notes: data.closing_notes,
      discrepancy: data.closing_cash - (currentShift.opening_float + currentShift.sales_total),
    };

    // TODO: In production, sync this to backend before clearing
    // For now, just clear the current shift
    setCurrentShift(null);

    // TODO: Store closed shift in history
    // This could be added to a separate "shift_history" localStorage key
  };

  const getShiftSummary = (): ShiftSummary | null => {
    if (!currentShift) return null;

    // TODO: In production, calculate actual payment breakdown from transactions
    // For now, mock it with all sales as cash
    const paymentBreakdown: PaymentBreakdown = {
      cash: currentShift.sales_total,
      card: 0,
      mobile: 0,
      other: 0,
    };

    return {
      shift_id: currentShift.id,
      opening_float: currentShift.opening_float,
      sales_total: currentShift.sales_total,
      expected_cash: currentShift.opening_float + currentShift.sales_total,
      actual_cash: currentShift.closing_cash,
      discrepancy: currentShift.discrepancy,
      transaction_count: currentShift.transaction_count,
      payment_breakdown: paymentBreakdown,
      opened_at: currentShift.opened_at,
      closed_at: currentShift.closed_at,
    };
  };

  return (
    <ShiftContext.Provider
      value={{
        currentShift,
        isShiftOpen: currentShift?.status === "open",
        openShift,
        closeShift,
        getShiftSummary,
      }}
    >
      {children}
    </ShiftContext.Provider>
  );
};

export const useShift = () => {
  const context = useContext(ShiftContext);
  if (context === undefined) {
    throw new Error("useShift must be used within a ShiftProvider");
  }
  return context;
};
