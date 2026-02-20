"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/shared/Icon";
import { QuoteCreationData, Customer, NewCustomerForm, CartItem } from "@/lib/types";

export default function QuoteConfirmationPage() {
  const router = useRouter();
  const [quoteData, setQuoteData] = useState<QuoteCreationData | null>(null);
  const [quoteNumber, setQuoteNumber] = useState<string>("");

  useEffect(() => {
    // Load quote data from localStorage
    const storedData = localStorage.getItem("pendingQuote");
    if (storedData) {
      const data = JSON.parse(storedData) as QuoteCreationData;
      setQuoteData(data);

      // Generate quote number (in real app, this would come from backend)
      const quoteNum = `Q-${Date.now().toString().slice(-6)}`;
      setQuoteNumber(quoteNum);
    } else {
      // No quote data, redirect to orders
      router.push("/dashboard/orders");
    }
  }, [router]);

  const handleCompleteQuote = () => {
    if (!quoteData) return;

    // Prepare quote for saving
    const customer: Customer = quoteData.isNew
      ? {
          id: Date.now().toString(),
          name: `${(quoteData.customer as NewCustomerForm).firstName} ${(quoteData.customer as NewCustomerForm).lastName}`,
          email: (quoteData.customer as NewCustomerForm).email,
          customerId: `${(quoteData.customer as NewCustomerForm).firstName}-${Date.now().toString().slice(-4)}`,
          tags: ["All customers"],
        }
      : (quoteData.customer as Customer);

    const quote = {
      id: Date.now(),
      quoteNumber,
      customer,
      servedBy: {
        name: "Current User", // In real app, get from auth
        outlet: "Main Branch",
      },
      note: quoteData.quoteNote || "",
      total: quoteData.total,
      status: "Open" as const,
      items: quoteData.items.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        qty: item.qty,
      })),
      createdAt: Date.now(),
      discount: quoteData.discount,
      promoCode: quoteData.promoCode,
      subtotal: quoteData.subtotal,
      tax: quoteData.tax,
    };

    // Save quote to localStorage (in real app, save to backend)
    const existingQuotes = JSON.parse(localStorage.getItem("quotes") || "[]");
    existingQuotes.push(quote);
    localStorage.setItem("quotes", JSON.stringify(existingQuotes));

    // Clear pending quote
    localStorage.removeItem("pendingQuote");

    // Trigger print
    window.print();

    // After print, redirect to quotes page
    router.push("/dashboard/orders/quotes");
  };

  const handleCancel = () => {
    localStorage.removeItem("pendingQuote");
    router.push("/dashboard/orders");
  };

  if (!quoteData) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-400">
          <Icon name="Loader" size={32} className="animate-spin" />
        </div>
      </div>
    );
  }

  const customerName = quoteData.isNew
    ? `${(quoteData.customer as NewCustomerForm).firstName} ${(quoteData.customer as NewCustomerForm).lastName}`
    : (quoteData.customer as Customer).name;

  const customerEmail = quoteData.isNew
    ? (quoteData.customer as NewCustomerForm).email
    : (quoteData.customer as Customer).email;

  const customerContact = quoteData.isNew
    ? (quoteData.customer as NewCustomerForm).contact
    : "";

  const discountAmount = quoteData.discount
    ? quoteData.discount.type === "percentage"
      ? (quoteData.subtotal * quoteData.discount.value) / 100
      : quoteData.discount.value
    : 0;

  const promoCodeDiscount = quoteData.promoCode === "FLASH" ? 50 : 0;
  const totalDiscount = discountAmount + promoCodeDiscount;

  return (
    <div className="flex flex-col h-full overflow-auto bg-gray-50">
      {/* Header - hide on print */}
      <div className="flex-none px-8 pt-8 pb-6 bg-white border-b border-gray-200 print:hidden">
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
          <span>Orders</span>
          <Icon name="ChevronRight" size={12} />
          <span>Quotes</span>
          <Icon name="ChevronRight" size={12} />
          <span className="text-gray-700 font-medium">Confirmation</span>
        </div>
        <h1 className="text-2xl font-semibold text-slate-900 mb-1">
          Confirm Quote
        </h1>
        <p className="text-sm text-gray-500">
          Review quote details before completing
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 px-8 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Quote card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden print:shadow-none print:border-0">
            {/* Quote header */}
            <div className="px-8 py-6 border-b border-gray-200">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900 mb-1">
                    Quote {quoteNumber}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {new Date().toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 mb-1">Served by</p>
                  <p className="text-sm font-medium text-slate-900">Current User</p>
                  <p className="text-xs text-gray-500">Main Branch</p>
                </div>
              </div>

              {/* Customer info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
                    {customerName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-900 mb-1">
                      {customerName}
                    </p>
                    <p className="text-sm text-gray-600">{customerEmail}</p>
                    {customerContact && (
                      <p className="text-sm text-gray-600">{customerContact}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Quote note */}
              {quoteData.quoteNote && (
                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-xs font-medium text-amber-900 mb-1">Note</p>
                  <p className="text-sm text-amber-800">{quoteData.quoteNote}</p>
                </div>
              )}
            </div>

            {/* Items */}
            <div className="px-8 py-6">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
                Items
              </h3>
              <div className="space-y-3">
                {quoteData.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-900">
                          {item.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {item.size} {item.color ? `• ${item.color}` : ""}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-slate-900">
                        GH₵{(item.price * item.qty).toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-500">Qty: {item.qty}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals */}
            <div className="px-8 py-6 bg-gray-50 border-t border-gray-200">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900 font-medium">
                    GH₵{quoteData.subtotal.toFixed(2)}
                  </span>
                </div>
                {quoteData.discount && (
                  <div className="flex justify-between text-sm text-orange-600">
                    <span>
                      Discount (
                      {quoteData.discount.type === "percentage"
                        ? `${quoteData.discount.value}%`
                        : `GH₵${quoteData.discount.value}`}
                      )
                    </span>
                    <span className="font-medium">
                      -GH₵{discountAmount.toFixed(2)}
                    </span>
                  </div>
                )}
                {quoteData.promoCode && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Promo Code ({quoteData.promoCode})</span>
                    <span className="font-medium">
                      -GH₵{promoCodeDiscount.toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span className="text-gray-900 font-medium">
                    GH₵{quoteData.tax.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-semibold text-slate-900 pt-2 border-t border-gray-300">
                  <span>Total</span>
                  <span>GH₵{quoteData.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions - hide on print */}
          <div className="flex items-center justify-end gap-3 mt-6 print:hidden">
            <button
              onClick={handleCancel}
              className="px-5 py-2.5 border border-gray-300 hover:bg-gray-50 text-slate-700 rounded-lg text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleCompleteQuote}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"
            >
              <Icon name="Printer" size={16} />
              Complete Quote
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
