"use client";

import { useState, useRef, useEffect } from "react";
import { Icon } from "../shared/Icon";
import { Customer } from "@/lib/types";
import { CUSTOMERS } from "@/lib/data";

type Step = "customer-select" | "new-customer";

interface NewCustomerForm {
  firstName: string;
  lastName: string;
  contact: string;
  email: string;
  quoteNote: string;
}

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

  // Reset state when modal opens
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

  // Close dropdown on outside click
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
    ? CUSTOMERS.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase())
      )
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
    // Pre-fill first name from search if typed
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
    if (!form.contact.trim()) newErrors.contact = "Required";
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
    `w-full bg-[#2c2c2e] border ${
      error ? "border-red-500" : "border-[#3a3a3c]"
    } rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-gray-500 outline-none focus:border-blue-500 transition-colors`;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 z-40" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-[#1c1c1e] rounded-xl shadow-2xl w-full max-w-lg text-white">

          {/* Close button */}
          <div className="flex justify-end px-5 pt-4 pb-0">
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            >
              <Icon name="X" size={18} />
            </button>
          </div>

          {step === "customer-select" ? (
            <>
              {/* Step 1 header */}
              <div className="px-6 pt-1 pb-6">
                {/* Breadcrumb */}
                <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-4">
                  <span className="text-gray-300 font-medium">Customer</span>
                  <Icon name="ChevronRight" size={12} />
                  <span>Details</span>
                </div>

                <h2 className="text-xl font-semibold text-white mb-1">
                  Quote contact information
                </h2>
                <p className="text-sm text-gray-400">
                  Add an existing or a new customer to this quote
                </p>

                {/* Customer field */}
                <div className="mt-6">
                  <label className="block text-sm font-semibold text-white mb-2">
                    Customer
                  </label>
                  <div className="relative" ref={dropdownRef}>
                    <div
                      className={`flex items-center bg-[#2c2c2e] border ${
                        showDropdown ? "border-blue-500" : "border-[#3a3a3c]"
                      } rounded-lg overflow-hidden transition-colors`}
                    >
                      <Icon
                        name="User"
                        size={16}
                        className="ml-3 text-gray-500 shrink-0"
                      />
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
                        className="flex-1 bg-transparent px-3 py-3 text-sm text-white placeholder:text-gray-500 outline-none"
                      />
                      {selectedCustomer && (
                        <button
                          onClick={() => {
                            setSearch("");
                            setSelectedCustomer(null);
                            inputRef.current?.focus();
                          }}
                          className="mr-3 text-gray-500 hover:text-gray-300"
                        >
                          <Icon name="X" size={14} />
                        </button>
                      )}
                    </div>

                    {/* Dropdown */}
                    {showDropdown && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-[#2c2c2e] border border-[#3a3a3c] rounded-lg shadow-xl z-10 max-h-56 overflow-y-auto">
                        {filteredCustomers.map((customer) => (
                          <button
                            key={customer.id}
                            onMouseDown={() => handleSelectCustomer(customer)}
                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 text-left transition-colors"
                          >
                            <div className="w-8 h-8 rounded-full bg-gray-600 text-white flex items-center justify-center shrink-0 text-xs font-semibold">
                              {getInitials(customer.name)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-white truncate">
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
                          className="w-full flex items-center gap-2 px-4 py-3 hover:bg-white/5 text-left border-t border-[#3a3a3c] transition-colors"
                        >
                          <div className="w-8 h-8 rounded-full bg-blue-600/20 border border-blue-600/40 flex items-center justify-center shrink-0">
                            <Icon name="UserPlus" size={14} className="text-blue-400" />
                          </div>
                          <span className="text-sm text-blue-400 font-medium">
                            Add new customer
                          </span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Selected customer badge */}
                  {selectedCustomer && (
                    <div className="mt-2 flex items-center gap-2 px-3 py-2 bg-blue-600/15 border border-blue-600/30 rounded-lg">
                      <Icon name="UserCheck" size={14} className="text-blue-400 shrink-0" />
                      <span className="text-xs text-blue-300 font-medium">
                        {selectedCustomer.name}
                      </span>
                      <span className="text-xs text-gray-500 ml-auto">
                        {selectedCustomer.email}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Step 1 footer */}
              <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-white/10">
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-[#2c2c2e] hover:bg-[#3a3a3c] text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Don&apos;t create quote
                </button>
                <button
                  onClick={handleNext}
                  disabled={!selectedCustomer}
                  className="px-5 py-2 bg-[#2c2c2e] hover:bg-[#3a3a3c] disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Next
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Step 2 header */}
              <div className="px-6 pt-1 pb-6">
                {/* Breadcrumb */}
                <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-4">
                  <button
                    onClick={() => setStep("customer-select")}
                    className="text-gray-300 font-medium hover:text-white transition-colors"
                  >
                    Customer
                  </button>
                  <Icon name="ChevronRight" size={12} />
                  <span>New Customer</span>
                </div>

                <h2 className="text-xl font-semibold text-white mb-1">
                  Add new customer
                </h2>
                <p className="text-sm text-gray-400">
                  Enter the customer&apos;s details to create a quote
                </p>

                {/* Form */}
                <div className="mt-6 space-y-4">
                  {/* Name row */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1.5">
                        First name <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={form.firstName}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, firstName: e.target.value }))
                        }
                        placeholder="John"
                        className={inputClass(errors.firstName)}
                      />
                      {errors.firstName && (
                        <p className="text-xs text-red-400 mt-1">{errors.firstName}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1.5">
                        Last name <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={form.lastName}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, lastName: e.target.value }))
                        }
                        placeholder="Doe"
                        className={inputClass(errors.lastName)}
                      />
                      {errors.lastName && (
                        <p className="text-xs text-red-400 mt-1">{errors.lastName}</p>
                      )}
                    </div>
                  </div>

                  {/* Contact */}
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">
                      Contact <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="tel"
                      value={form.contact}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, contact: e.target.value }))
                      }
                      placeholder="+233 XX XXX XXXX"
                      className={inputClass(errors.contact)}
                    />
                    {errors.contact && (
                      <p className="text-xs text-red-400 mt-1">{errors.contact}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">
                      Email <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, email: e.target.value }))
                      }
                      placeholder="john@example.com"
                      className={inputClass(errors.email)}
                    />
                    {errors.email && (
                      <p className="text-xs text-red-400 mt-1">{errors.email}</p>
                    )}
                  </div>

                  {/* Quote note */}
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">
                      Quote note{" "}
                      <span className="text-gray-600 font-normal">(optional)</span>
                    </label>
                    <textarea
                      rows={3}
                      value={form.quoteNote}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, quoteNote: e.target.value }))
                      }
                      placeholder="Add a note to this quote..."
                      className="w-full bg-[#2c2c2e] border border-[#3a3a3c] rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-gray-500 outline-none focus:border-blue-500 transition-colors resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Step 2 footer */}
              <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-white/10">
                <button
                  onClick={() => setStep("customer-select")}
                  className="px-4 py-2 bg-[#2c2c2e] hover:bg-[#3a3a3c] text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleCreateQuote}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors"
                >
                  Create Quote
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};
