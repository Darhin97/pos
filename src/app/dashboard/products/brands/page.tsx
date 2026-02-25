import { SimplePage } from "@/components/dashboard/SimplePage";

export default function BrandsPage() {
  return (
    <SimplePage
      breadcrumbs={[{ label: "Products" }, { label: "Brands" }]}
      title="Brands"
      description="Manage product brands and manufacturers."
    />
  );
}
