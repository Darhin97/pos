"use client";

import { useState } from "react";
import { Icon } from "@/components/shared/Icon";
import { PageHeader } from "@/components/shared/PageHeader";
import { ContentContainer } from "@/components/shared/ContentContainer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BRANDS } from "@/lib/data";

export default function BrandsPage() {
  const [brands, setBrands] = useState(BRANDS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<typeof BRANDS[0] | null>(null);
  const [brandName, setBrandName] = useState("");
  const [description, setDescription] = useState("");

  const clearForm = () => {
    setBrandName("");
    setDescription("");
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this brand?")) {
      setBrands((prev) => prev.filter((brand) => brand.id !== id));
    }
  };

  const handleOpenAddModal = () => {
    clearForm();
    setIsModalOpen(true);
  };

  const handleCloseAddModal = () => {
    clearForm();
    setIsModalOpen(false);
  };

  const handleCloseEditModal = () => {
    clearForm();
    setEditingBrand(null);
    setIsEditModalOpen(false);
  };

  const handleAddBrand = () => {
    if (brandName.trim()) {
      const newBrand = {
        id: Math.max(...brands.map((b) => b.id)) + 1,
        name: brandName.trim(),
        description: description.trim(),
        productCount: 0,
      };
      setBrands((prev) => [...prev, newBrand]);
      clearForm();
      setIsModalOpen(false);
    }
  };

  const handleEditClick = (brand: typeof BRANDS[0]) => {
    setEditingBrand(brand);
    setBrandName(brand.name);
    setDescription(brand.description || "");
    setIsEditModalOpen(true);
  };

  const handleUpdateBrand = () => {
    if (brandName.trim() && editingBrand) {
      setBrands((prev) =>
        prev.map((brand) =>
          brand.id === editingBrand.id
            ? { ...brand, name: brandName.trim(), description: description.trim() }
            : brand
        )
      );
      clearForm();
      setEditingBrand(null);
      setIsEditModalOpen(false);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-auto bg-white">
      <PageHeader
        breadcrumbs={[
          { label: "Products" },
          { label: "Brands" }
        ]}
        title="Brands"
      />

      {/* Header section */}
      <div className="flex-none px-8 pb-6 pt-4">
        <ContentContainer>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              A list of all of your brands.
            </p>
            <Button
              onClick={handleOpenAddModal}
              className="h-9 px-4 bg-violet-600 hover:bg-violet-700 text-white"
            >
              Add brand
            </Button>
          </div>
        </ContentContainer>
      </div>

      {/* Table */}
      <div className="flex-1 px-8 pb-8 overflow-auto">
        <ContentContainer>
          <table className="w-full">
            <thead className="bg-white sticky top-0 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left">
                  <button className="flex items-center gap-1 text-xs font-semibold text-slate-900 hover:text-slate-700">
                    Name
                    <Icon name="ArrowUpDown" size={14} />
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-900">
                  Description
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-slate-900">
                  Number of products
                </th>
                <th className="w-24 px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {brands.map((brand) => (
                <tr
                  key={brand.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <span className="text-sm font-medium text-slate-900 underline cursor-pointer hover:text-violet-600">
                      {brand.name}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {brand.description || "-"}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 text-center">
                    {brand.productCount}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3 justify-end">
                      <button
                        onClick={() => handleEditClick(brand)}
                        className="text-violet-600 hover:text-violet-700"
                      >
                        <Icon name="Pencil" size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(brand.id)}
                        className="text-gray-400 hover:text-red-600"
                      >
                        <Icon name="Trash2" size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </ContentContainer>
      </div>

      {/* Add Brand Modal */}
      <Dialog open={isModalOpen} onOpenChange={(open) => !open && handleCloseAddModal()}>
        <DialogContent className="sm:max-w-[600px] bg-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Add brand</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Brand name
              </label>
              <Input
                placeholder="Enter a brand name"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Description
              </label>
              <Textarea
                placeholder=""
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full min-h-[120px] resize-none"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button
              onClick={handleAddBrand}
              className="bg-violet-600 hover:bg-violet-700 text-white px-6"
            >
              Add brand
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Brand Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={(open) => !open && handleCloseEditModal()}>
        <DialogContent className="sm:max-w-[600px] bg-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Edit brand</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Brand name
              </label>
              <Input
                placeholder="Enter a brand name"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Description
              </label>
              <Textarea
                placeholder=""
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full min-h-[120px] resize-none"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button
              onClick={handleUpdateBrand}
              className="bg-violet-600 hover:bg-violet-700 text-white px-6"
            >
              Save changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
