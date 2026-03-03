"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/shared/Icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DateRangePicker,
  type DateRangePickerValue,
} from "@/components/ui/date-range-picker";
import { CATEGORIES, BRANDS, SUPPLIERS, TAGS, PRODUCTS } from "@/lib/data";
import type { ProductFilter } from "@/lib/types";

export default function NewPromotionPage() {
  const router = useRouter();

  // General information
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  // Schedule
  const [scheduleType, setScheduleType] = useState<"one-time" | "recurring">(
    "one-time",
  );
  const [dateRange, setDateRange] = useState<DateRangePickerValue>();
  const [selectedDays, setSelectedDays] = useState<number[]>([]);

  // Discount
  const [discountType, setDiscountType] = useState<"percentage" | "fixed">(
    "percentage",
  );
  const [discountValue, setDiscountValue] = useState("");

  // Product scope
  const [productScope, setProductScope] = useState<"all" | "specific">("all");
  const [productFilters, setProductFilters] = useState<ProductFilter[]>([]);

  // Filter builder state
  const [filterOperator, setFilterOperator] =
    useState<ProductFilter["operator"]>("include");
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const daysOfWeek = [
    { label: "Sun", value: 0 },
    { label: "Mon", value: 1 },
    { label: "Tue", value: 2 },
    { label: "Wed", value: 3 },
    { label: "Thu", value: 4 },
    { label: "Fri", value: 5 },
    { label: "Sat", value: 6 },
  ];

  const toggleDay = (day: number) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );
  };

  const addFilter = (type: ProductFilter["type"], value: string) => {
    // Check if this exact filter already exists
    const exists = productFilters.some(
      (f) =>
        f.type === type &&
        f.operator === filterOperator &&
        f.values.includes(value)
    );

    if (!exists) {
      // Check if we have a filter with same type and operator
      const existingFilterIndex = productFilters.findIndex(
        (f) => f.type === type && f.operator === filterOperator
      );

      if (existingFilterIndex !== -1) {
        // Add to existing filter's values
        const updatedFilters = [...productFilters];
        updatedFilters[existingFilterIndex].values.push(value);
        setProductFilters(updatedFilters);
      } else {
        // Create new filter
        setProductFilters([
          ...productFilters,
          {
            type,
            operator: filterOperator,
            values: [value],
          },
        ]);
      }
    }

    setSearchTerm("");
    setShowSuggestions(false);
  };

  const removeFilter = (index: number) => {
    setProductFilters(productFilters.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    // Validation
    if (!name.trim()) {
      alert("Please enter a promotion name");
      return;
    }

    if (scheduleType === "one-time" && !dateRange?.dateRange?.from) {
      alert("Please select a date range for one-time promotion");
      return;
    }

    if (scheduleType === "recurring" && selectedDays.length === 0) {
      alert("Please select at least one day for recurring promotion");
      return;
    }

    if (!discountValue || parseFloat(discountValue) <= 0) {
      alert("Please enter a valid discount value");
      return;
    }

    if (discountType === "percentage" && parseFloat(discountValue) > 100) {
      alert("Percentage discount cannot exceed 100%");
      return;
    }

    if (productScope === "specific" && productFilters.length === 0) {
      alert("Please add at least one product filter for specific products");
      return;
    }

    // TODO: Save to database
    console.log("Saving promotion:", {
      name,
      description,
      scheduleType,
      startDate: dateRange?.dateRange?.from,
      endDate: dateRange?.dateRange?.to,
      daysOfWeek: selectedDays,
      discountType,
      discountValue: parseFloat(discountValue),
      productScope,
      productFilters,
    });

    router.push("/dashboard/products/promotions");
  };

  const getSearchSuggestions = () => {
    if (!searchTerm.trim()) return [];

    const term = searchTerm.toLowerCase();
    const suggestions: Array<{ type: ProductFilter["type"]; value: string; label: string }> = [];

    // Search categories
    CATEGORIES.forEach((cat) => {
      if (cat.name.toLowerCase().includes(term)) {
        suggestions.push({ type: "category", value: cat.name, label: `Category: ${cat.name}` });
      }
    });

    // Search brands
    BRANDS.forEach((brand) => {
      if (brand.name.toLowerCase().includes(term)) {
        suggestions.push({ type: "brand", value: brand.name, label: `Brand: ${brand.name}` });
      }
    });

    // Search suppliers
    SUPPLIERS.forEach((supplier) => {
      if (supplier.name.toLowerCase().includes(term)) {
        suggestions.push({ type: "supplier", value: supplier.name, label: `Supplier: ${supplier.name}` });
      }
    });

    // Search tags
    TAGS.forEach((tag) => {
      if (tag.name.toLowerCase().includes(term)) {
        suggestions.push({ type: "tag", value: tag.name, label: `Tag: ${tag.name}` });
      }
    });

    // Search products by SKU
    PRODUCTS.forEach((product) => {
      if (product.sku && product.sku.toLowerCase().includes(term)) {
        suggestions.push({ type: "sku", value: product.sku, label: `SKU: ${product.sku} (${product.name})` });
      }
    });

    return suggestions.slice(0, 10); // Limit to 10 suggestions
  };

  return (
    <div className="flex flex-col h-full overflow-auto bg-white">
      {/* Header */}
      <div className="bg-gray-50 border-b border-gray-200 px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="text-gray-400 hover:text-gray-600"
            >
              <Icon name="ArrowLeft" size={24} />
            </button>
            <h1 className="text-2xl font-semibold text-gray-900">
              New promotion
            </h1>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="h-10 px-6"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="h-10 px-6 bg-violet-600 hover:bg-violet-700 text-white"
            >
              Save
            </Button>
          </div>
        </div>
        <p className="text-sm text-gray-600 mt-2 ml-12">
          Set special offers and discounts for your customers.
        </p>
      </div>

      {/* Form Content */}
      <div className="flex-1 overflow-auto px-8 py-8">
        <div className="max-w-4xl mx-auto">
          {/* General Information Section */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              General
            </h2>
            <div className="space-y-4 bg-gray-50 p-6 rounded-lg">
              <div>
                <Label
                  htmlFor="name"
                  className="text-sm font-medium text-gray-900"
                >
                  Promotion name *
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="e.g., Weekend Sale"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-2 bg-white"
                />
              </div>
              <div>
                <Label
                  htmlFor="description"
                  className="text-sm font-medium text-gray-900"
                >
                  Description
                </Label>
                <textarea
                  id="description"
                  placeholder="Describe the promotion..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="mt-2 w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Schedule Section */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Schedule promotion
            </h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              {/* Schedule Type Toggle */}
              <div className="flex gap-4 mb-6">
                <div className="flex-1">
                  <button
                    onClick={() => setScheduleType("one-time")}
                    className={`w-full py-3 px-4 rounded-lg border-2 text-sm font-medium transition-all ${
                      scheduleType === "one-time"
                        ? "border-violet-600 bg-violet-50 text-violet-700"
                        : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                    }`}
                  >
                    One-time
                  </button>
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    This promotion happens over a set period of time.
                  </p>
                </div>
                <div className="flex-1">
                  <button
                    onClick={() => setScheduleType("recurring")}
                    className={`w-full py-3 px-4 rounded-lg border-2 text-sm font-medium transition-all ${
                      scheduleType === "recurring"
                        ? "border-violet-600 bg-violet-50 text-violet-700"
                        : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                    }`}
                  >
                    Recurring
                  </button>
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    This promotion repeats weekly.
                  </p>
                </div>
              </div>

              {/* One-time schedule */}
              {scheduleType === "one-time" && (
                <div>
                  <Label className="text-sm font-medium text-gray-900 mb-2 block">
                    Date range *
                  </Label>
                  <DateRangePicker
                    value={dateRange}
                    onChange={setDateRange}
                    placeholder="Select start and end dates..."
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    This promotion will run for the selected date range
                  </p>
                </div>
              )}

              {/* Recurring schedule */}
              {scheduleType === "recurring" && (
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-900 mb-2 block">
                      Date range *
                    </Label>
                    <DateRangePicker
                      value={dateRange}
                      onChange={setDateRange}
                      placeholder="Select start and end dates..."
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      When this recurring promotion should be active
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-900 mb-3 block">
                      Select days of the week *
                    </Label>
                    <div className="flex gap-2">
                      {daysOfWeek.map((day) => (
                        <button
                          key={day.value}
                          onClick={() => toggleDay(day.value)}
                          className={`flex-1 py-3 px-2 rounded-lg border-2 text-sm font-medium transition-all ${
                            selectedDays.includes(day.value)
                              ? "border-violet-600 bg-violet-50 text-violet-700"
                              : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                          }`}
                        >
                          {day.label}
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      This promotion will repeat every week on the selected days
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Promotion Type Section */}
          <div className="mb-24">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Type of promotion
            </h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-sm font-medium text-gray-700 mb-4">
                Basic - Offer all customers a discount
              </p>

              {/* Discount configuration */}
              <div className="flex items-start gap-6">
                <div className="flex-none">
                  <Label className="text-sm font-medium text-gray-900 mb-3 block">
                    Get
                  </Label>
                </div>

                <div className="flex-1">
                  <Label className="text-sm font-medium text-gray-900 mb-3 block">
                    Discount
                  </Label>
                  <div className="flex gap-4 items-center">
                    {/* Discount type toggle */}
                    <div className="flex border border-gray-300 rounded-lg overflow-hidden bg-white">
                      <button
                        onClick={() => setDiscountType("percentage")}
                        className={`px-4 py-2 text-sm font-medium transition-colors ${
                          discountType === "percentage"
                            ? "bg-violet-600 text-white"
                            : "bg-white text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        %
                      </button>
                      <button
                        onClick={() => setDiscountType("fixed")}
                        className={`px-4 py-2 text-sm font-medium border-l border-gray-300 transition-colors ${
                          discountType === "fixed"
                            ? "bg-violet-600 text-white"
                            : "bg-white text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        $
                      </button>
                    </div>

                    {/* Discount value input */}
                    <div className="flex-1 max-w-sm">
                      <div className="relative">
                        {discountType === "fixed" && (
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-600">
                            GH₵
                          </span>
                        )}
                        <Input
                          type="number"
                          placeholder="0.00"
                          value={discountValue}
                          onChange={(e) => setDiscountValue(e.target.value)}
                          min="0"
                          max={
                            discountType === "percentage" ? "100" : undefined
                          }
                          step="0.01"
                          className={`bg-white text-right ${
                            discountType === "fixed" ? "pl-14" : ""
                          }`}
                        />
                        {discountType === "percentage" && (
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-600">
                            %
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex-1">
                  <Label className="text-sm font-medium text-gray-900 mb-3 block">
                    Product
                  </Label>
                  <div className="flex border border-gray-300 rounded-lg overflow-hidden bg-white">
                    <button
                      onClick={() => {
                        setProductScope("all");
                        setProductFilters([]);
                      }}
                      className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
                        productScope === "all"
                          ? "bg-violet-600 text-white"
                          : "bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => setProductScope("specific")}
                      className={`flex-1 px-4 py-2 text-sm font-medium border-l border-gray-300 transition-colors ${
                        productScope === "specific"
                          ? "bg-violet-600 text-white"
                          : "bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      Specific
                    </button>
                  </div>
                </div>
              </div>

              {/* Product filters */}
              {productScope === "specific" && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm font-medium text-gray-900">
                      Filter products by tag, category, brand, supplier or SKU
                    </p>
                  </div>

                  {/* Applied filters */}
                  {productFilters.length > 0 && (
                    <div className="mb-4 space-y-2">
                      {productFilters.map((filter, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-4 py-2"
                        >
                          <span className="text-sm font-medium text-gray-700 capitalize">
                            {filter.operator}
                          </span>
                          <span className="text-sm text-gray-600 capitalize">
                            {filter.type}:
                          </span>
                          <span className="text-sm text-gray-900">
                            {filter.values.join(", ")}
                          </span>
                          <button
                            onClick={() => removeFilter(index)}
                            className="ml-auto text-gray-400 hover:text-red-600"
                          >
                            <Icon name="X" size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Filter search input */}
                  <div className="flex gap-3">
                    <div className="w-32">
                      <select
                        value={filterOperator}
                        onChange={(e) =>
                          setFilterOperator(e.target.value as ProductFilter["operator"])
                        }
                        className="w-full h-10 px-3 py-2 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                      >
                        <option value="include">Include</option>
                        <option value="exclude">Exclude</option>
                      </select>
                    </div>
                    <div className="flex-1 relative" ref={searchContainerRef}>
                      <Input
                        type="text"
                        placeholder="Add a filter..."
                        value={searchTerm}
                        onChange={(e) => {
                          setSearchTerm(e.target.value);
                          setShowSuggestions(e.target.value.trim().length > 0);
                        }}
                        onFocus={() => setShowSuggestions(searchTerm.trim().length > 0)}
                        className="bg-white h-10"
                      />

                      {/* Search suggestions dropdown */}
                      {showSuggestions && getSearchSuggestions().length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                          {getSearchSuggestions().map((suggestion, index) => (
                            <button
                              key={index}
                              onClick={() => addFilter(suggestion.type, suggestion.value)}
                              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
                            >
                              {suggestion.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
