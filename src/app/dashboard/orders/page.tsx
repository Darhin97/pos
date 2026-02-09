"use client";

import { PageHeader } from "@/components/dashboard/PageHeader";
import { ProductCard } from "@/components/dashboard/ProductCard";
import { Cart } from "@/components/dashboard/Cart";
import { PRODUCTS } from "@/lib/data";

export default function OrdersPage() {
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
