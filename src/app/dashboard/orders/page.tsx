"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { ProductCard } from "@/components/dashboard/ProductCard";
import { Cart } from "@/components/dashboard/Cart";
import { PRODUCTS } from "@/lib/data";
import { useShift } from "@/contexts/ShiftContext";
import { Icon } from "@/components/shared/Icon";

export default function OrdersPage() {
  const router = useRouter();
  const { isShiftOpen } = useShift();

  useEffect(() => {
    if (!isShiftOpen) {
      router.push("/dashboard/register");
    }
  }, [isShiftOpen, router]);

  // Show loading state while checking shift status
  if (!isShiftOpen) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full bg-blue-50 border-2 border-blue-200 flex items-center justify-center mx-auto mb-3">
            <Icon name="Lock" size={24} className="text-blue-600" />
          </div>
          <p className="text-sm text-gray-500">Redirecting to register...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full overflow-hidden">
      {/* Left side - Products */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden border-r border-gray-200">
        <PageHeader
          title="Orders"
          subtitle="Manage point of sale and inventory seamlessly"
          breadcrumb="Orders"
        />

        <div className="flex-1 overflow-y-auto p-6 pt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 pb-8">
            {PRODUCTS.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>

      {/* Right side - Cart */}
      <Cart />
    </div>
  );
}
