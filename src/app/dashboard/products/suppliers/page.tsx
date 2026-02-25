import { SimplePage } from "@/components/dashboard/SimplePage";

export default function SuppliersPage() {
  return (
    <SimplePage
      breadcrumbs={[{ label: "Products" }, { label: "Suppliers" }]}
      title="Suppliers"
      description="Manage your product suppliers and vendors."
    />
  );
}
