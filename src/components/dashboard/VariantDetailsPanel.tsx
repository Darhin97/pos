"use client";

import { useState } from "react";
import { Icon } from "@/components/shared/Icon";
import { Button } from "@/components/ui/button";

interface Variant {
  id: number;
  name: string;
  skuCode: string;
  quantity: string;
  supplierPrice: string;
  retailPrice: string;
  enabled: boolean;
}

interface VariantDetailsPanelProps {
  productName: string;
  variants: Variant[];
  onDelete?: () => void;
  onEdit?: () => void;
  onPrintLabels?: () => void;
}

export function VariantDetailsPanel({
  productName,
  variants,
  onDelete,
  onEdit,
  onPrintLabels,
}: VariantDetailsPanelProps) {
  const [activeTab, setActiveTab] = useState<"inventory" | "pricing">("inventory");

  return (
    <div className="bg-gray-50 border-t border-gray-200">
      <div className="px-4 py-4">
        <div className="flex items-start justify-between">
          {/* Left side - Tabs and Content */}
          <div className="flex-1">
            {/* Tabs */}
            <div className="flex items-center gap-8 mb-6 border-b border-gray-200">
              <button
                onClick={() => setActiveTab("inventory")}
                className={`pb-3 text-sm font-medium transition-colors relative ${
                  activeTab === "inventory"
                    ? "text-violet-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Inventory
                {activeTab === "inventory" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-600" />
                )}
              </button>
              <button
                onClick={() => setActiveTab("pricing")}
                className={`pb-3 text-sm font-medium transition-colors relative ${
                  activeTab === "pricing"
                    ? "text-violet-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Pricing
                {activeTab === "pricing" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-600" />
                )}
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === "inventory" && (
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-900">
                        Product
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-900">
                        Available Quantity
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {variants.map((variant) => (
                      <tr key={variant.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-md bg-gray-100 shrink-0"></div>
                            <div>
                              <p className="text-sm font-medium text-slate-900">
                                {productName} / {variant.name}
                              </p>
                              <p className="text-xs text-gray-500">{variant.skuCode}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {variant.quantity || 0}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === "pricing" && (
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-900">
                        Product
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-900">
                        Supplier Price
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-900">
                        Retail Price
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {variants.map((variant) => (
                      <tr key={variant.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-md bg-gray-100 shrink-0"></div>
                            <div>
                              <p className="text-sm font-medium text-slate-900">
                                {productName} / {variant.name}
                              </p>
                              <p className="text-xs text-gray-500">{variant.skuCode}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          GH₵{parseFloat(variant.supplierPrice || "0").toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          GH₵{parseFloat(variant.retailPrice || "0").toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Right side - Action Buttons */}
          <div className="ml-6 flex flex-col gap-2 w-48">
            <Button
              variant="outline"
              onClick={onPrintLabels}
              className="w-full justify-start"
            >
              Print labels...
            </Button>
            <Button
              variant="outline"
              onClick={onEdit}
              className="w-full justify-start"
            >
              Edit
            </Button>
            <Button
              variant="outline"
              onClick={onDelete}
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
