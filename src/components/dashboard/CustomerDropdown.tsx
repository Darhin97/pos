"use client";

import { Customer } from "@/lib/types";

interface CustomerDropdownProps {
  customers: Customer[];
  searchQuery: string;
  onSelectCustomer: (customer: Customer) => void;
  onAddNewCustomer: (name: string) => void;
}

export const CustomerDropdown = ({
  customers,
  searchQuery,
  onSelectCustomer,
  onAddNewCustomer,
}: CustomerDropdownProps) => {
  if (!searchQuery.trim()) return null;

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
      {customers.length > 0 ? (
        <>
          {customers.map((customer) => (
            <button
              key={customer.id}
              onClick={() => onSelectCustomer(customer)}
              className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left"
            >
              {/* Avatar with initials */}
              <div className="w-10 h-10 rounded-full bg-gray-600 text-white flex items-center justify-center shrink-0 font-medium text-sm">
                {getInitials(customer.name)}
              </div>

              {/* Customer info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-gray-900">
                    {customer.name}
                  </span>
                  <span className="text-xs text-gray-500">
                    {customer.tags.join(", ")}
                  </span>
                </div>
                <div className="text-xs text-gray-500">
                  {customer.customerId} | {customer.email}
                </div>
              </div>
            </button>
          ))}
        </>
      ) : null}

      {/* Add new customer option */}
      <button
        onClick={() => onAddNewCustomer(searchQuery)}
        className="w-full px-4 py-3 flex items-center gap-2 hover:bg-gray-50 transition-colors text-left border-t border-gray-200 text-gray-700"
      >
        <span className="text-blue-600 font-medium">+</span>
        <span className="text-sm">
          Add "{searchQuery}" as a new customer
        </span>
      </button>
    </div>
  );
};
