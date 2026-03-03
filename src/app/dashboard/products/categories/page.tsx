"use client";

import { useState } from "react";
import { Icon } from "@/components/shared/Icon";
import { PageHeader } from "@/components/shared/PageHeader";
import { ContentContainer } from "@/components/shared/ContentContainer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CATEGORIES } from "@/lib/data";

export default function ProductCategoriesPage() {
  const [categories, setCategories] = useState(CATEGORIES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<typeof CATEGORIES[0] | null>(null);
  const [categoryName, setCategoryName] = useState("");

  const clearForm = () => {
    setCategoryName("");
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this category?")) {
      setCategories((prev) => prev.filter((category) => category.id !== id));
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
    setEditingCategory(null);
    setIsEditModalOpen(false);
  };

  const handleAddCategory = () => {
    if (categoryName.trim()) {
      const newCategory = {
        id: Math.max(...categories.map((c) => c.id)) + 1,
        name: categoryName.trim(),
        productCount: 0,
      };
      setCategories((prev) => [...prev, newCategory]);
      clearForm();
      setIsModalOpen(false);
    }
  };

  const handleEditClick = (category: typeof CATEGORIES[0]) => {
    setEditingCategory(category);
    setCategoryName(category.name);
    setIsEditModalOpen(true);
  };

  const handleUpdateCategory = () => {
    if (categoryName.trim() && editingCategory) {
      setCategories((prev) =>
        prev.map((category) =>
          category.id === editingCategory.id
            ? { ...category, name: categoryName.trim() }
            : category
        )
      );
      clearForm();
      setEditingCategory(null);
      setIsEditModalOpen(false);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-auto bg-white">
      <PageHeader
        breadcrumbs={[
          { label: "Products" },
          { label: "Product Categories" }
        ]}
        title="Product Categories"
      />

      {/* Header section */}
      <div className="flex-none px-8 pb-6 pt-4">
        <ContentContainer>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              A list of all of your product categories.
            </p>
            <Button
              onClick={handleOpenAddModal}
              className="h-9 px-4 bg-violet-600 hover:bg-violet-700 text-white"
            >
              Add category
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
                <th className="px-4 py-3 text-center text-xs font-semibold text-slate-900">
                  Number of products
                </th>
                <th className="w-24 px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {categories.map((category) => (
                <tr
                  key={category.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <span className="text-sm font-medium text-slate-900 underline cursor-pointer hover:text-violet-600">
                      {category.name}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 text-center">
                    {category.productCount}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3 justify-end">
                      <button
                        onClick={() => handleEditClick(category)}
                        className="text-violet-600 hover:text-violet-700"
                      >
                        <Icon name="Pencil" size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(category.id)}
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

      {/* Add Category Modal */}
      <Dialog open={isModalOpen} onOpenChange={(open) => !open && handleCloseAddModal()}>
        <DialogContent className="sm:max-w-[600px] bg-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Add category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Category name
              </label>
              <Input
                placeholder="Enter a category name"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                className="w-full"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button
              onClick={handleAddCategory}
              className="bg-violet-600 hover:bg-violet-700 text-white px-6"
            >
              Add category
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Category Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={(open) => !open && handleCloseEditModal()}>
        <DialogContent className="sm:max-w-[600px] bg-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Edit category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Category name
              </label>
              <Input
                placeholder="Enter a category name"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                className="w-full"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button
              onClick={handleUpdateCategory}
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
