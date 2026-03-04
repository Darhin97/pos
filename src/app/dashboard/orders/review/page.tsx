"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CART_ITEMS, CUSTOMERS } from "@/lib/data";
import { Customer } from "@/lib/types";
import { Icon } from "@/components/shared/Icon";
import { CustomerDropdown } from "@/components/dashboard/CustomerDropdown";
import { CashPaymentModal } from "@/components/dashboard/CashPaymentModal";
import { ReceiptModal } from "@/components/dashboard/ReceiptModal";

type PaymentMethod = "momo" | "card" | null;

export default function OrderReviewPage() {
  const router = useRouter();
  const [customerSearch, setCustomerSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isEditingAmount, setIsEditingAmount] = useState(false);
  const [isCashModalOpen, setIsCashModalOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [receiptPayment, setReceiptPayment] = useState<{
    method: "cash" | "momo" | "card";
    amountGiven?: number;
    change?: number;
  } | null>(null);
  const [momoAmount, setMomoAmount] = useState("");

  // Load customer from localStorage on mount
  useEffect(() => {
    const savedCustomer = localStorage.getItem("orderCustomer");
    if (savedCustomer) {
      try {
        const customer = JSON.parse(savedCustomer);
        setSelectedCustomer(customer);
        setCustomerSearch(customer.name);
      } catch (error) {
        console.error("Failed to parse customer data:", error);
      }
    }
  }, []);

  const cartItems = CART_ITEMS;

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.qty,
    0,
  );
  const tax = 0;
  const total = subtotal + tax;
  const totalItems = cartItems.reduce((sum, item) => sum + item.qty, 0);

  const filteredCustomers = CUSTOMERS.filter((c) =>
    c.name.toLowerCase().includes(customerSearch.toLowerCase()),
  );

  const handleSelectCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setCustomerSearch(customer.name);
  };

  const handleAddNewCustomer = (name: string) => {
    setCustomerSearch(name);
  };

  return (
    <div className="h-full bg-gray-50 flex items-center justify-center">
      <div className="w-[70%] h-[80%] flex flex-col px-6 pb-8 overflow-y-auto">
        {/* Page header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => router.back()}
            className="p-1.5 rounded-lg hover:bg-gray-200 transition-colors text-gray-500 hover:text-slate-900"
          >
            <Icon name="ArrowLeft" size={20} />
          </button>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Review Sale
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 flex-1 min-h-0">
          {/* Left card — Sale summary */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wide">
                Order Summary
              </h2>
            </div>

            {/* Items */}
            <div className="px-5 divide-y divide-gray-100 flex-1 overflow-y-auto">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-start gap-3 py-3.5">
                  <span className="text-xs text-gray-400 w-4 shrink-0 mt-0.5">
                    {item.qty}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-900 font-medium leading-snug">
                      {item.name}
                    </p>
                    {item.size && (
                      <p className="text-xs text-gray-400 mt-0.5">
                        {item.size}
                      </p>
                    )}
                  </div>
                  <span className="text-sm text-slate-900 font-medium shrink-0">
                    GH₵{(item.price * item.qty).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="px-5 py-4 border-t border-gray-100 space-y-2.5">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span className="text-slate-900 font-medium">
                  GH₵{subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Tax</span>
                <span className="text-gray-400">No tax</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-100">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                    Sale Total
                  </span>
                  <span className="text-xs text-gray-400">
                    {totalItems} items
                  </span>
                </div>
                <span className="text-base font-semibold text-slate-900">
                  GH₵{total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Right card — Payment */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wide">
                Pay
              </h2>
            </div>

            <div className="px-5 py-5 space-y-4">
              {/* Amount display */}
              <div>
                <div
                  className="border border-gray-200 rounded-lg px-5 py-4 cursor-pointer hover:border-gray-300 transition-colors bg-gray-50"
                  onClick={() => setIsEditingAmount(true)}
                >
                  {isEditingAmount ? (
                    <input
                      autoFocus
                      type="number"
                      defaultValue={total.toFixed(2)}
                      onBlur={() => setIsEditingAmount(false)}
                      className="w-full bg-transparent text-right text-3xl font-light text-slate-900 outline-none"
                    />
                  ) : (
                    <p className="text-right text-3xl font-light text-slate-900">
                      {total.toFixed(2)}
                    </p>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-1.5 text-right">
                  Edit to make a partial payment
                </p>
              </div>

              {/* Payment method buttons */}
              <div className="grid grid-cols-3 gap-3">
                {/* Cash */}
                <button
                  onClick={() => {
                    setSelectedMethod(null);
                    setIsCashModalOpen(true);
                  }}
                  className="flex flex-col items-center gap-2 py-4 bg-[#6366f1] hover:bg-[#5558e3] text-white rounded-lg font-medium text-sm transition-colors"
                >
                  <Icon name="Banknote" size={20} />
                  Cash
                </button>

                {/* Momo */}
                <button
                  onClick={() => {
                    const newMethod = selectedMethod === "momo" ? null : "momo";
                    setSelectedMethod(newMethod);
                    if (newMethod !== "momo") {
                      setMomoAmount("");
                    }
                  }}
                  className={`flex flex-col items-center gap-2 py-4 rounded-lg font-medium text-sm transition-colors border-2 ${
                    selectedMethod === "momo"
                      ? "bg-amber-500 border-amber-500 text-white"
                      : "bg-amber-500 hover:bg-amber-600 border-transparent text-white"
                  }`}
                >
                  <Icon name="Smartphone" size={20} />
                  Momo
                </button>

                {/* Credit Card */}
                <button
                  onClick={() => {
                    const newMethod = selectedMethod === "card" ? null : "card";
                    setSelectedMethod(newMethod);
                    setMomoAmount("");
                  }}
                  className={`flex flex-col items-center gap-2 py-4 rounded-lg font-medium text-sm transition-colors border-2 ${
                    selectedMethod === "card"
                      ? "bg-slate-700 border-slate-500 text-white"
                      : "bg-slate-700 hover:bg-slate-800 border-transparent text-white"
                  }`}
                >
                  <Icon name="CreditCard" size={20} />
                  Card
                </button>
              </div>

              {/* Momo amount input — shown only when Momo is selected */}
              {selectedMethod === "momo" && (
                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-2">
                    Amount received (Momo)
                  </label>
                  <div className="flex items-center border border-[#6366f1] rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-[#6366f1]/20">
                    <span className="pl-4 pr-2 text-sm text-gray-500 shrink-0">GH₵</span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={momoAmount}
                      onChange={(e) => setMomoAmount(e.target.value)}
                      placeholder="0.00"
                      className="flex-1 py-3 pr-4 text-sm text-right text-slate-900 outline-none bg-transparent"
                    />
                  </div>
                </div>
              )}

              {/* Complete Sale — shown for Momo or Card */}
              {selectedMethod && (
                <button
                  onClick={() => {
                    // For momo, validate amount is entered
                    if (selectedMethod === "momo") {
                      const amount = parseFloat(momoAmount);
                      if (!amount || amount <= 0) {
                        alert("Please enter the momo amount received");
                        return;
                      }
                      setReceiptPayment({
                        method: selectedMethod,
                        amountGiven: amount,
                        change: amount - total
                      });
                    } else {
                      setReceiptPayment({ method: selectedMethod });
                    }
                    setIsReceiptOpen(true);
                  }}
                  className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold text-sm transition-colors flex items-center justify-center gap-2"
                >
                  <Icon name="Printer" size={16} />
                  Complete Sale &amp; Print Receipt
                </button>
              )}

              {/* Customer field - show badge if selected, otherwise show input */}
              {selectedCustomer ? (
                <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2.5 flex items-center gap-3">
                  {/* Avatar with initials */}
                  <div className="w-10 h-10 rounded bg-amber-500 flex items-center justify-center text-white font-semibold text-sm shrink-0">
                    {selectedCustomer.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)}
                  </div>
                  {/* Customer info */}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-gray-900">
                      {selectedCustomer.name}
                    </div>
                    <div className="text-xs text-gray-600 mt-0.5">
                      {selectedCustomer.customerId} | {selectedCustomer.email}
                    </div>
                  </div>
                  {/* Delete icon */}
                  <button
                    onClick={() => {
                      setSelectedCustomer(null);
                      setCustomerSearch("");
                      localStorage.removeItem("orderCustomer");
                    }}
                    className="p-1.5 hover:bg-amber-100 rounded transition-colors text-gray-500 hover:text-gray-700 shrink-0"
                  >
                    <Icon name="Trash2" size={16} />
                  </button>
                </div>
              ) : (
                <div className="relative">
                  <Icon
                    name="User"
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10"
                  />
                  <input
                    type="text"
                    value={customerSearch}
                    onChange={(e) => setCustomerSearch(e.target.value)}
                    placeholder="Add a customer"
                    className="w-full pl-9 pr-3 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-slate-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                  <CustomerDropdown
                    customers={filteredCustomers}
                    searchQuery={customerSearch}
                    onSelectCustomer={handleSelectCustomer}
                    onAddNewCustomer={handleAddNewCustomer}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Cash Payment Modal */}
      <CashPaymentModal
        isOpen={isCashModalOpen}
        total={total}
        onClose={() => setIsCashModalOpen(false)}
        onComplete={({ amountGiven, change }) => {
          setIsCashModalOpen(false);
          setReceiptPayment({ method: "cash", amountGiven, change });
          setIsReceiptOpen(true);
        }}
      />

      {/* Receipt Modal */}
      {receiptPayment && (
        <ReceiptModal
          isOpen={isReceiptOpen}
          onClose={() => setIsReceiptOpen(false)}
          cartItems={cartItems}
          subtotal={subtotal}
          tax={tax}
          total={total}
          paymentMethod={receiptPayment.method}
          amountGiven={receiptPayment.amountGiven}
          change={receiptPayment.change}
          customer={selectedCustomer}
        />
      )}
    </div>
  );
}
