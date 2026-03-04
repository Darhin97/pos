"use client";

import { useState, useEffect } from "react";
import { Icon } from "../shared/Icon";

interface AddCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (customer: {
    firstName: string;
    lastName: string;
    email: string;
    contactNumber: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  }) => void;
  initialName?: string;
}

export const AddCustomerModal = ({
  isOpen,
  onClose,
  onSave,
  initialName = "",
}: AddCustomerModalProps) => {
  const [activeTab, setActiveTab] = useState<"contact" | "details">("contact");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");

  // Helper function to capitalize first letter of each word
  const capitalizeWords = (str: string) => {
    return str
      .split(" ")
      .filter((word) => word.length > 0)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  // Update first and last name when initialName changes
  useEffect(() => {
    if (initialName) {
      const nameParts = initialName.trim().split(" ").filter((part) => part.length > 0);
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      // Capitalize first and last names
      setFirstName(capitalizeWords(firstName));
      setLastName(capitalizeWords(lastName));
    }
  }, [initialName]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setFirstName("");
      setLastName("");
      setEmail("");
      setContactNumber("");
      setAddress("");
      setCity("");
      setState("");
      setPostalCode("");
      setCountry("");
      setActiveTab("contact");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave({
      firstName,
      lastName,
      email,
      contactNumber,
      address,
      city,
      state,
      postalCode,
      country,
    });
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />

      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-xl shadow-2xl border border-gray-200 w-[900px] max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-gray-200">
          <h2 className="text-gray-900 text-2xl font-semibold">Add customer</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-900 transition-colors"
          >
            <Icon name="X" size={28} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab("contact")}
            className={`px-8 py-4 text-base font-medium transition-colors relative ${
              activeTab === "contact"
                ? "text-gray-900"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Contact
            {activeTab === "contact" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("details")}
            className={`px-8 py-4 text-base font-medium transition-colors relative ${
              activeTab === "details"
                ? "text-gray-900"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Details
            {activeTab === "details" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />
            )}
          </button>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto max-h-[calc(90vh-240px)] bg-gray-50">
          {activeTab === "contact" && (
            <div className="space-y-6">
              {/* First Name and Last Name */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 text-base mb-3 font-medium">
                    First name
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="j"
                    className="w-full px-5 py-3.5 bg-white border border-gray-300 rounded-lg text-gray-900 text-base placeholder:text-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-base mb-3 font-medium">
                    Last name
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Enter last name"
                    className="w-full px-5 py-3.5 bg-white border border-gray-300 rounded-lg text-gray-900 text-base placeholder:text-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              {/* Email and Contact Number */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 text-base mb-3 font-medium">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email"
                    className="w-full px-5 py-3.5 bg-white border border-gray-300 rounded-lg text-gray-900 text-base placeholder:text-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-base mb-3 font-medium">
                    Contact number
                  </label>
                  <div className="flex gap-3">
                    <select className="px-4 py-3.5 bg-white border border-gray-300 rounded-lg text-gray-900 text-base focus:outline-none focus:border-blue-500 transition-colors">
                      <option value="mobile">
                        Mobile
                      </option>
                      <option value="home">
                        Home
                      </option>
                      <option value="work">
                        Work
                      </option>
                    </select>
                    <input
                      type="tel"
                      value={contactNumber}
                      onChange={(e) => setContactNumber(e.target.value)}
                      placeholder="Enter mobile number"
                      className="flex-1 px-5 py-3.5 bg-white border border-gray-300 rounded-lg text-gray-900 text-base placeholder:text-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "details" && (
            <div className="space-y-6">
              {/* Address */}
              <div>
                <label className="block text-gray-700 text-base mb-3 font-medium">
                  Address
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter street address"
                  className="w-full px-5 py-3.5 bg-white border border-gray-300 rounded-lg text-gray-900 text-base placeholder:text-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              {/* City and State */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 text-base mb-3 font-medium">
                    City
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Enter city"
                    className="w-full px-5 py-3.5 bg-white border border-gray-300 rounded-lg text-gray-900 text-base placeholder:text-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-base mb-3 font-medium">
                    State / Region
                  </label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="Enter state or region"
                    className="w-full px-5 py-3.5 bg-white border border-gray-300 rounded-lg text-gray-900 text-base placeholder:text-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              {/* Postal Code and Country */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 text-base mb-3 font-medium">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="Enter postal code"
                    className="w-full px-5 py-3.5 bg-white border border-gray-300 rounded-lg text-gray-900 text-base placeholder:text-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-base mb-3 font-medium">
                    Country
                  </label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="Enter country"
                    className="w-full px-5 py-3.5 bg-white border border-gray-300 rounded-lg text-gray-900 text-base placeholder:text-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-4 px-8 py-5 border-t border-gray-200 bg-white">
          <button
            onClick={onClose}
            className="px-8 py-3 border border-gray-300 text-gray-900 text-base rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white text-base rounded-lg transition-colors font-medium"
          >
            Save
          </button>
        </div>
      </div>
    </>
  );
};
