import { SimplePage } from "@/components/dashboard/SimplePage";

export default function ProductTagsPage() {
  return (
    <SimplePage
      breadcrumbs={[{ label: "Products" }, { label: "Tags" }]}
      title="Product Tags"
      description="Manage product tags and labels."
    />
  );
}
