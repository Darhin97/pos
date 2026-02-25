import { SimplePage } from "@/components/dashboard/SimplePage";

export default function ProductCategoriesPage() {
  return (
    <SimplePage
      breadcrumbs={[{ label: "Products" }, { label: "Categories" }]}
      title="Product Categories"
      description="Organize and manage product categories."
    />
  );
}
