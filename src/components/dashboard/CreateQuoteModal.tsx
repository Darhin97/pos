"use client";

import { useState, useRef, useEffect } from "react";
import { Icon } from "../shared/Icon";
import { Customer, NewCustomerForm } from "@/lib/types";
import { CUSTOMERS } from "@/lib/data";

type Step = "customer-select" | "new-customer";

interface CreateQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateQuote: (data: {
    customer: Customer | NewCustomerForm;
    isNew: boolean;
    quoteNote?: string;
  }) => void;
}

export const CreateQuoteModal = ({
  isOpen,
  onClose,
  onCreateQuote,
}: CreateQuoteModalProps) => {
  const [step, setStep] = useState<Step>("customer-select");
  const [search, setSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [form, setForm] = useState<NewCustomerForm>({
    firstName: "",
    lastName: "",
    contact: "",
    email: "",
    quoteNote: "",
  });
  const [errors, setErrors] = useState<Partial<NewCustomerForm>>({});
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setStep("customer-select");
      setSearch("");
      setSelectedCustomer(null);
      setShowDropdown(false);
      setForm({ firstName: "", lastName: "", contact: "", email: "", quoteNote: "" });
      setErrors({});
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (!isOpen) return null;

  const filteredCustomers = search.trim()
    ? CUSTOMERS.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))
    : CUSTOMERS;

  const getInitials = (name: string) =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  const handleSelectCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setSearch(customer.name);
    setShowDropdown(false);
  };

  const handleAddNewCustomer = () => {
    setStep("new-customer");
    setShowDropdown(false);
    const parts = search.trim().split(" ");
    setForm((f) => ({
      ...f,
      firstName: parts[0] || "",
      lastName: parts.slice(1).join(" ") || "",
    }));
  };

  const handleNext = () => {
    if (!selectedCustomer) return;
    onCreateQuote({ customer: selectedCustomer, isNew: false });
    onClose();
  };

  const validateForm = () => {
    const newErrors: Partial<NewCustomerForm> = {};
    if (!form.firstName.trim()) newErrors.firstName = "Required";
    if (!form.lastName.trim()) newErrors.lastName = "Required";
    if (!form.email.trim()) newErrors.email = "Required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = "Invalid email";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateQuote = () => {
    if (!validateForm()) return;
    onCreateQuote({ customer: form, isNew: true, quoteNote: form.quoteNote });
    onClose();
  };

  const inputClass = (error?: string) =>
    `w-full border ${
      error ? "border-red-400" : "border-gray-300"
    } rounded-lg px-3 py-2.5 text-sm text-slate-900 placeholder:text-gray-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-colors`;

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
              {/* Breadcrumb */}
              <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-2">
                <span
                  className={
                    step === "new-customer"
                      ? "text-blue-600 cursor-pointer hover:underline"
                      : "text-gray-500 font-medium"
                  }
                  onClick={() => step === "new-customer" && setStep("customer-select")}
                >
                  Customer
                </span>
                <Icon name="ChevronRight" size={11} className="text-gray-300" />
                <span className="text-gray-500 font-medium">
                  {step === "customer-select" ? "Details" : "New Customer"}
                </span>
              </div>

              <h2 className="text-lg font-semibold text-slate-900">
                {step === "customer-select"
                  ? "Quote contact information"
                  : "Add new customer"}
              </h2>
              <p className="text-sm text-gray-500 mt-0.5">
                {step === "customer-select"
                  ? "Add an existing or a new customer to this quote"
                  : "Enter the customer's details to create a quote"}
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
            {step === "customer-select" ? (
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-2">
                  Customer
                </label>
                <div className="relative" ref={dropdownRef}>
                  <div
                    className={`flex items-center border ${
                      showDropdown ? "border-blue-500 ring-2 ring-blue-500/10" : "border-gray-300"
                    } rounded-lg overflow-hidden transition-colors`}
                  >
                    <Icon name="User" size={15} className="ml-3 text-gray-400 shrink-0" />
                    <input
                      ref={inputRef}
                      type="text"
                      value={search}
                      onChange={(e) => {
                        setSearch(e.target.value);
                        setSelectedCustomer(null);
                        setShowDropdown(true);
                      }}
                      onFocus={() => setShowDropdown(true)}
                      placeholder="Select or add a customer"
                      className="flex-1 px-3 py-2.5 text-sm text-slate-900 placeholder:text-gray-400 outline-none"
                    />
                    {selectedCustomer && (
                      <button
                        onClick={() => {
                          setSearch("");
                          setSelectedCustomer(null);
                          inputRef.current?.focus();
                        }}
                        className="mr-3 text-gray-400 hover:text-gray-600"
                      >
                        <Icon name="X" size={14} />
                      </button>
                    )}
                  </div>

                  {/* Dropdown */}
                  {showDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-52 overflow-y-auto">
                      {filteredCustomers.map((customer) => (
                        <button
                          key={customer.id}
                          onMouseDown={() => handleSelectCustomer(customer)}
                          className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-left transition-colors"
                        >
                          <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center shrink-0 text-xs font-semibold">
                            {getInitials(customer.name)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-900 truncate">
                              {customer.name}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {customer.email}
                            </p>
                          </div>
                        </button>
                      ))}

                      {/* Add new customer */}
                      <button
                        onMouseDown={handleAddNewCustomer}
                        className="w-full flex items-center gap-2 px-4 py-2.5 hover:bg-gray-50 text-left border-t border-gray-100 transition-colors"
                      >
                        <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center shrink-0">
                          <Icon name="UserPlus" size={14} className="text-blue-600" />
                        </div>
                        <span className="text-sm text-blue-600 font-medium">
                          Add new customer
                        </span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Selected customer badge */}
                {selectedCustomer && (
                  <div className="mt-2.5 flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg">
                    <Icon name="UserCheck" size={14} className="text-blue-600 shrink-0" />
                    <span className="text-sm text-blue-700 font-medium">
                      {selectedCustomer.name}
                    </span>
                    <span className="text-xs text-gray-500 ml-auto truncate">
                      {selectedCustomer.email}
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {/* Name row */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1.5">
                      First name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.firstName}
                      onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
                      placeholder="John"
                      className={inputClass(errors.firstName)}
                    />
                    {errors.firstName && (
                      <p className="text-xs text-red-500 mt-1">{errors.firstName}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1.5">
                      Last name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.lastName}
                      onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
                      placeholder="Doe"
                      className={inputClass(errors.lastName)}
                    />
                    {errors.lastName && (
                      <p className="text-xs text-red-500 mt-1">{errors.lastName}</p>
                    )}
                  </div>
                </div>

                {/* Contact */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    Contact{" "}
                    <span className="text-gray-400 font-normal">(optional)</span>
                  </label>
                  <input
                    type="tel"
                    value={form.contact}
                    onChange={(e) => setForm((f) => ({ ...f, contact: e.target.value }))}
                    placeholder="+233 XX XXX XXXX"
                    className={inputClass()}
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    placeholder="john@example.com"
                    className={inputClass(errors.email)}
                  />
                  {errors.email && (
                    <p className="text-xs text-red-500 mt-1">{errors.email}</p>
                  )}
                </div>

                {/* Quote note */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    Quote note{" "}
                    <span className="text-gray-400 font-normal">(optional)</span>
                  </label>
                  <textarea
                    rows={3}
                    value={form.quoteNote}
                    onChange={(e) => setForm((f) => ({ ...f, quoteNote: e.target.value }))}
                    placeholder="Add a note to this quote..."
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-slate-900 placeholder:text-gray-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-colors resize-none"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 pb-5">
            {step === "customer-select" ? (
              <>
                <button
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-slate-700 rounded-lg text-sm font-medium transition-colors"
                >
                  Don&apos;t create quote
                </button>
                <button
                  onClick={handleNext}
                  disabled={!selectedCustomer}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg text-sm font-semibold transition-colors"
                >
                  Next
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setStep("customer-select")}
                  className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-slate-700 rounded-lg text-sm font-medium transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleCreateQuote}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors"
                >
                  Create Quote
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
