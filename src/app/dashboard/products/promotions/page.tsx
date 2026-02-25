import { SimplePage } from "@/components/dashboard/SimplePage";

export default function PromotionsPage() {
  return (
    <SimplePage
      breadcrumbs={[{ label: "Products" }, { label: "Promotions" }]}
      title="Promotions"
      description="Create and manage product promotions and discounts."
    />
  );
}
