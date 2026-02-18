"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "../shared/Icon";
import { CartItem } from "./CartItem";
import { DiscountModal } from "./DiscountModal";
import { PromoCodeModal } from "./PromoCodeModal";
import { CustomerDropdown } from "./CustomerDropdown";
import { AddCustomerModal } from "./AddCustomerModal";
import { HoldSaleModal } from "./HoldSaleModal";
import { CART_ITEMS, CUSTOMERS } from "@/lib/data";
import { Customer, HeldSale } from "@/lib/types";

export const Cart = () => {
  const router = useRouter();
  const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);
  const [isPromoCodeModalOpen, setIsPromoCodeModalOpen] = useState(false);
  const [isAddCustomerModalOpen, setIsAddCustomerModalOpen] = useState(false);
  const [isMoreActionsOpen, setIsMoreActionsOpen] = useState(false);
  const [isHoldSaleModalOpen, setIsHoldSaleModalOpen] = useState(false);
  const [isRetrieveSaleOpen, setIsRetrieveSaleOpen] = useState(false);
  const [discount, setDiscount] = useState<{
    type: "percentage" | "amount";
    value: number;
  } | null>(null);
  const [promoCode, setPromoCode] = useState<string | null>(null);
  const [customerSearch, setCustomerSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [newCustomerName, setNewCustomerName] = useState("");
  const [cartItems, setCartItems] = useState(CART_ITEMS);
  const [heldSales, setHeldSales] = useState<HeldSale[]>([]);

  const totalItems = cartItems.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.qty,
    0,
  );

  // Calculate discount amount
  const discountAmount = discount
    ? discount.type === "percentage"
      ? (subtotal * discount.value) / 100
      : discount.value
    : 0;

  // Calculate promo code discount
  const promoCodeDiscount = promoCode === "FLASH" ? 50 : 0;

  // Total discount
  const totalDiscount = discountAmount + promoCodeDiscount;

  const tax = 0; // No tax

  // Handle promo code application with validation
  const handlePromoCodeApply = (code: string) => {
    const upperCode = code.toUpperCase();
    if (upperCode === "FLASH") {
      setPromoCode(upperCode);
    } else {
      // Invalid promo code - you could show an error message here
      alert("Invalid promo code. Please try again.");
    }
  };

  // Filter customers based on search query
  const filteredCustomers = CUSTOMERS.filter((customer) =>
    customer.name.toLowerCase().includes(customerSearch.toLowerCase())
  );

  // Handle customer selection
  const handleSelectCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setCustomerSearch(customer.name);
  };

  // Handle adding new customer
  const handleAddNewCustomer = (name: string) => {
    setNewCustomerName(name);
    setIsAddCustomerModalOpen(true);
  };

  // Handle saving new customer
  const handleSaveNewCustomer = (customerData: {
    firstName: string;
    lastName: string;
    email: string;
    contactNumber: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  }) => {
    // In a real app, this would create a new customer in the database
    const fullName = `${customerData.firstName} ${customerData.lastName}`.trim();
    setCustomerSearch(fullName);
    setSelectedCustomer({
      id: Date.now().toString(),
      name: fullName,
      email: customerData.email,
      customerId: `${customerData.firstName}-${Date.now()}`,
      tags: ["All customers"],
    });
    // Address data would be saved to database in real app
    console.log("Customer address:", {
      address: customerData.address,
      city: customerData.city,
      state: customerData.state,
      postalCode: customerData.postalCode,
      country: customerData.country,
    });
  };

  // Handle hold sale
  const handleHoldSale = (reason: string) => {
    if (cartItems.length === 0) {
      alert("Cart is empty");
      return;
    }

    const heldSale: HeldSale = {
      id: Date.now().toString(),
      reason,
      items: [...cartItems],
      customer: selectedCustomer,
      timestamp: Date.now(),
    };

    setHeldSales([...heldSales, heldSale]);
    setCartItems([]);
    setDiscount(null);
    setPromoCode(null);
    setCustomerSearch("");
    setSelectedCustomer(null);
  };

  // Handle retrieve sale
  const handleRetrieveSale = (saleId: string) => {
    const sale = heldSales.find((s) => s.id === saleId);
    if (sale) {
      setCartItems(sale.items);
      if (sale.customer) {
        setSelectedCustomer(sale.customer);
        setCustomerSearch(sale.customer.name);
      }
      setHeldSales(heldSales.filter((s) => s.id !== saleId));
      setIsRetrieveSaleOpen(false);
    }
  };

  return (
    <aside className="w-[500px] bg-white flex flex-col shrink-0 h-full overflow-hidden">
      {/* Top action buttons */}
      <div className="px-6 pt-4 pb-3 border-b border-gray-200 shrink-0">
        <div className="flex items-center gap-3 text-sm">
          <div className="relative">
            <button
              onClick={() => setIsRetrieveSaleOpen(!isRetrieveSaleOpen)}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
            >
              <Icon name="RotateCcw" size={16} />
              <span>Retrieve sale</span>
            </button>

            {/* Retrieve Sale Dropdown */}
            {isRetrieveSaleOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setIsRetrieveSaleOpen(false)}
                />
                <div className="absolute left-0 top-full mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-80 overflow-y-auto">
                  {heldSales.length > 0 ? (
                    heldSales.map((sale) => (
                      <button
                        key={sale.id}
                        onClick={() => handleRetrieveSale(sale.id)}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                      >
                        <div className="font-medium text-gray-900 text-sm mb-1">
                          {sale.reason}
                        </div>
                        <div className="text-xs text-gray-500">
                          {sale.items.length} items • {new Date(sale.timestamp).toLocaleTimeString()}
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-6 text-center text-sm text-gray-500">
                      No held sales
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
          <button
            onClick={() => setIsHoldSaleModalOpen(true)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
          >
            <Icon name="Clock" size={16} />
            <span>Hold sale</span>
          </button>
          <div className="ml-auto relative">
            <button
              onClick={() => setIsMoreActionsOpen(!isMoreActionsOpen)}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
            >
              <span>More actions...</span>
              <Icon name="ChevronDown" size={16} />
            </button>

            {/* Dropdown Menu */}
            {isMoreActionsOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setIsMoreActionsOpen(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20 overflow-hidden">
                  <button
                    onClick={() => {
                      // Clear cart logic
                      setIsMoreActionsOpen(false);
                      alert("Clear cart clicked");
                    }}
                    className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                  >
                    <Icon name="Trash2" size={16} />
                    <span>Clear cart</span>
                  </button>
                  <button
                    onClick={() => {
                      // Create quote logic
                      setIsMoreActionsOpen(false);
                      alert("Create quote clicked");
                    }}
                    className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                  >
                    <Icon name="FileText" size={16} />
                    <span>Create quote</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Add customer input */}
      <div className="px-6 pt-4 pb-3 shrink-0">
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
            className="w-full pl-9 pr-3 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
          />
          <CustomerDropdown
            customers={filteredCustomers}
            searchQuery={customerSearch}
            onSelectCustomer={handleSelectCustomer}
            onAddNewCustomer={handleAddNewCustomer}
          />
        </div>
      </div>

      {/* Cart items */}
      <div className="flex-1 overflow-y-auto px-6 scrollbar-hide">
        <div className="space-y-4 py-4">
          {cartItems.length > 0 ? (
            cartItems.map((item) => (
              <CartItem key={item.id} item={item} />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
              <Icon name="ShoppingCart" size={48} />
              <p className="mt-4 text-sm">Cart is empty</p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom section */}
      <div className="px-6 pb-6 pt-4 border-t border-gray-200 shrink-0">
        {/* ADD button with options */}
        <div className="flex items-center justify-between mb-4 text-sm">
          <button className="text-gray-600 hover:text-gray-900 transition-colors font-medium">
            ADD
          </button>
          <div className="flex items-center gap-4 text-blue-600">
            <button
              onClick={() => setIsDiscountModalOpen(true)}
              className="hover:text-blue-700 transition-colors"
            >
              Discount
            </button>
            <button
              onClick={() => setIsPromoCodeModalOpen(true)}
              className="hover:text-blue-700 transition-colors"
            >
              Promo code
            </button>
          </div>
        </div>

        {/* Subtotal and Tax */}
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal</span>
            <span className="text-gray-900 font-medium">
              GH₵{subtotal.toFixed(2)}
            </span>
          </div>
          {discount && (
            <div className="flex justify-between text-sm text-orange-600">
              <span>
                Discount ({discount.type === "percentage" ? `${discount.value}%` : `GH₵${discount.value}`})
              </span>
              <span className="font-medium">
                -GH₵{discountAmount.toFixed(2)}
              </span>
            </div>
          )}
          {promoCode && (
            <div className="flex justify-between text-sm text-green-600">
              <span>Promo Code ({promoCode})</span>
              <span className="font-medium">
                -GH₵{promoCodeDiscount.toFixed(2)}
              </span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Tax</span>
            <span className="text-gray-500 font-medium">No tax</span>
            <span className="text-gray-900 font-medium">
              GH₵{tax.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Pay button */}
        <button
          onClick={() => router.push("/dashboard/orders/review")}
          className="w-full py-4 bg-[#6366f1] hover:bg-[#5558e3] text-white rounded-lg font-semibold transition-colors flex items-center justify-between px-6 text-lg"
        >
          <span>Pay</span>
          <span className="text-base">{totalItems} items</span>
          <span>GH₵{(subtotal - totalDiscount + tax).toFixed(2)}</span>
        </button>
      </div>

      {/* Discount Modal */}
      <DiscountModal
        isOpen={isDiscountModalOpen}
        onClose={() => setIsDiscountModalOpen(false)}
        onApply={(newDiscount) => setDiscount(newDiscount)}
        onRemove={() => setDiscount(null)}
      />

      {/* Promo Code Modal */}
      <PromoCodeModal
        isOpen={isPromoCodeModalOpen}
        onClose={() => setIsPromoCodeModalOpen(false)}
        onApply={handlePromoCodeApply}
        onRemove={() => setPromoCode(null)}
      />

      {/* Add Customer Modal */}
      <AddCustomerModal
        isOpen={isAddCustomerModalOpen}
        onClose={() => setIsAddCustomerModalOpen(false)}
        onSave={handleSaveNewCustomer}
        initialName={newCustomerName}
      />

      {/* Hold Sale Modal */}
      <HoldSaleModal
        isOpen={isHoldSaleModalOpen}
        onClose={() => setIsHoldSaleModalOpen(false)}
        onSave={handleHoldSale}
      />
    </aside>
  );
};
