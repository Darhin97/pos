"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/shared/Icon";
import { PageHeader } from "@/components/shared/PageHeader";
import { ContentContainer } from "@/components/shared/ContentContainer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DateRangePicker, type DateRangePickerValue } from "@/components/ui/date-range-picker";
import { PROMOTIONS } from "@/lib/data";

type TabType = "current" | "past" | "all";

export default function PromotionsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("current");
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRangeValue, setDateRangeValue] = useState<DateRangePickerValue>();

  const handleEdit = (promotionId: number) => {
    router.push(`/dashboard/products/promotions/edit/${promotionId}`);
  };

  const handleDelete = (promotionId: number) => {
    if (window.confirm("Are you sure you want to delete this promotion?")) {
      console.log("Delete promotion:", promotionId);
      // TODO: Implement delete logic here
    }
  };

  const filteredPromotions = PROMOTIONS.filter((promo) => {
    if (activeTab === "current") {
      return promo.status === "current" || promo.status === "upcoming";
    } else if (activeTab === "past") {
      return promo.status === "past";
    }
    return true;
  });

  return (
    <div className="flex flex-col h-full overflow-auto bg-gray-50">
      <PageHeader
        breadcrumbs={[
          { label: "Products" },
          { label: "Promotions" }
        ]}
        title="Promotions"
      />

      <div className="w-4/5 mx-auto">
        {/* Tabs */}
        <div className="flex-none pt-4">
        <div className="flex gap-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("current")}
            className="pb-3 px-1 text-sm font-medium transition-colors relative"
            style={{ color: activeTab === "current" ? "#7c3aed" : "#6b7280" }}
          >
            Current and upcoming
            {activeTab === "current" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-600" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("past")}
            className="pb-3 px-1 text-sm font-medium transition-colors relative"
            style={{ color: activeTab === "past" ? "#7c3aed" : "#6b7280" }}
          >
            Past
            {activeTab === "past" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-600" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("all")}
            className="pb-3 px-1 text-sm font-medium transition-colors relative"
            style={{ color: activeTab === "all" ? "#7c3aed" : "#6b7280" }}
          >
            All
            {activeTab === "all" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-600" />
            )}
          </button>
        </div>
      </div>

        {/* Filters */}
        <div className="flex-none py-6 bg-gray-100 px-6 rounded-lg mt-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          <div className="md:col-span-4">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Search for promotions
            </label>
            <div className="relative">
              <Icon
                name="Search"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={16}
              />
              <Input
                type="text"
                placeholder="Enter promotion name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 h-10 bg-white"
              />
            </div>
          </div>

          <div className="md:col-span-4">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Date
            </label>
            <DateRangePicker
              value={dateRangeValue}
              onChange={setDateRangeValue}
              placeholder="Choose date range..."
            />
          </div>

          <div className="md:col-span-2">
            <Button className="h-10 w-full bg-violet-600 hover:bg-violet-700 text-white">
              Search
            </Button>
          </div>

          <div className="md:col-span-2">
            <Button
              onClick={() => router.push("/dashboard/products/promotions/new")}
              className="h-10 w-full bg-violet-600 hover:bg-violet-700 text-white"
            >
              Add promotion
            </Button>
          </div>
        </div>
      </div>

        {/* Results */}
        <div className="flex-1 pb-8 bg-white rounded-lg mt-4 px-6">
        <div className="pt-6">
          <p className="text-sm text-gray-600 mb-6">
            Displaying {filteredPromotions.length} promotions
          </p>

          <ContentContainer>
            <table className="w-full">
              <thead className="bg-white sticky top-0 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-900">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-900">
                    Description
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-900">
                    Schedule
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-900">
                    Discount
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-900">
                    Products
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-900">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-900">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {filteredPromotions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-400">
                        <Icon name="Package" size={48} className="mb-3" />
                        <p className="text-sm text-gray-500">No promotions found</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredPromotions.map((promo) => {
                    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
                    const scheduleText = promo.scheduleType === "one-time"
                      ? `${promo.startDate} - ${promo.endDate}`
                      : `Weekly: ${promo.daysOfWeek?.map(d => daysOfWeek[d]).join(", ") || "N/A"}`;

                    const discountText = promo.discountType === "percentage"
                      ? `${promo.discountValue}%`
                      : `GH₵${promo.discountValue.toFixed(2)}`;

                    const productsText = promo.productScope === "all"
                      ? "All products"
                      : `${promo.productFilters?.length || 0} filter(s)`;

                    return (
                      <tr
                        key={promo.id}
                        className="hover:bg-gray-50 transition-colors border-b border-gray-100"
                      >
                        <td className="px-4 py-3 text-sm font-medium text-slate-900">
                          {promo.name}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {promo.description}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {scheduleText}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {discountText}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {productsText}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            promo.active
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-700"
                          }`}>
                            {promo.active ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEdit(promo.id)}
                              className="p-1.5 hover:bg-violet-50 rounded transition-colors group"
                              title="Edit promotion"
                            >
                              <Icon
                                name="Pencil"
                                size={16}
                                className="text-gray-400 group-hover:text-violet-600"
                              />
                            </button>
                            <button
                              onClick={() => handleDelete(promo.id)}
                              className="p-1.5 hover:bg-red-50 rounded transition-colors group"
                              title="Delete promotion"
                            >
                              <Icon
                                name="Trash2"
                                size={16}
                                className="text-gray-400 group-hover:text-red-600"
                              />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </ContentContainer>
        </div>
      </div>
      </div>
    </div>
  );
}
