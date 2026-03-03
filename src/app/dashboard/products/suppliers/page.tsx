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
import { SUPPLIERS } from "@/lib/data";

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState(SUPPLIERS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<typeof SUPPLIERS[0] | null>(null);
  const [supplierName, setSupplierName] = useState("");
  const [description, setDescription] = useState("");
  const [representative, setRepresentative] = useState("");
  const [contact, setContact] = useState("");

  const clearForm = () => {
    setSupplierName("");
    setDescription("");
    setRepresentative("");
    setContact("");
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this supplier?")) {
      setSuppliers((prev) => prev.filter((supplier) => supplier.id !== id));
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
    setEditingSupplier(null);
    setIsEditModalOpen(false);
  };

  const handleAddSupplier = () => {
    if (supplierName.trim()) {
      const newSupplier = {
        id: Math.max(...suppliers.map((s) => s.id)) + 1,
        name: supplierName.trim(),
        description: description.trim(),
        representative: representative.trim(),
        contact: contact.trim(),
        productCount: 0,
      };
      setSuppliers((prev) => [...prev, newSupplier]);
      clearForm();
      setIsModalOpen(false);
    }
  };

  const handleEditClick = (supplier: typeof SUPPLIERS[0]) => {
    setEditingSupplier(supplier);
    setSupplierName(supplier.name);
    setDescription(supplier.description || "");
    setRepresentative(supplier.representative || "");
    setContact(supplier.contact || "");
    setIsEditModalOpen(true);
  };

  const handleUpdateSupplier = () => {
    if (supplierName.trim() && editingSupplier) {
      setSuppliers((prev) =>
        prev.map((supplier) =>
          supplier.id === editingSupplier.id
            ? {
                ...supplier,
                name: supplierName.trim(),
                description: description.trim(),
                representative: representative.trim(),
                contact: contact.trim(),
              }
            : supplier
        )
      );
      clearForm();
      setEditingSupplier(null);
      setIsEditModalOpen(false);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-auto bg-white">
      <PageHeader
        breadcrumbs={[
          { label: "Products" },
          { label: "Suppliers" }
        ]}
        title="Suppliers"
      />

      {/* Header section */}
      <div className="flex-none px-8 pb-6 pt-4">
        <ContentContainer>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              A list of all of your suppliers.
            </p>
            <Button
              onClick={handleOpenAddModal}
              className="h-9 px-4 bg-violet-600 hover:bg-violet-700 text-white"
            >
              Add supplier
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
                    Supplier
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
              {suppliers.map((supplier) => (
                <tr
                  key={supplier.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <span className="text-sm font-medium text-slate-900 underline cursor-pointer hover:text-violet-600">
                      {supplier.name}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {supplier.description || "-"}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 text-center">
                    {supplier.productCount}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3 justify-end">
                      <button
                        onClick={() => handleEditClick(supplier)}
                        className="text-violet-600 hover:text-violet-700"
                      >
                        <Icon name="Pencil" size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(supplier.id)}
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

      {/* Add Supplier Modal */}
      <Dialog open={isModalOpen} onOpenChange={(open) => !open && handleCloseAddModal()}>
        <DialogContent className="sm:max-w-[600px] bg-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Add supplier</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Supplier name
              </label>
              <Input
                placeholder="Enter supplier name"
                value={supplierName}
                onChange={(e) => setSupplierName(e.target.value)}
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
                className="w-full min-h-[100px] resize-none"
              />
            </div>

            {/* Contact Info Section */}
            <div className="space-y-4 pt-2">
              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Contact Info</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Representative
                    </label>
                    <Input
                      placeholder="Enter representative name"
                      value={representative}
                      onChange={(e) => setRepresentative(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Contact
                    </label>
                    <Input
                      placeholder="Enter contact number"
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <Button
              onClick={handleAddSupplier}
              className="bg-violet-600 hover:bg-violet-700 text-white px-6"
            >
              Add supplier
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Supplier Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={(open) => !open && handleCloseEditModal()}>
        <DialogContent className="sm:max-w-[600px] bg-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Edit supplier</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Supplier name
              </label>
              <Input
                placeholder="Enter supplier name"
                value={supplierName}
                onChange={(e) => setSupplierName(e.target.value)}
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
                className="w-full min-h-[100px] resize-none"
              />
            </div>

            {/* Contact Info Section */}
            <div className="space-y-4 pt-2">
              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Contact Info</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Representative
                    </label>
                    <Input
                      placeholder="Enter representative name"
                      value={representative}
                      onChange={(e) => setRepresentative(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Contact
                    </label>
                    <Input
                      placeholder="Enter contact number"
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <Button
              onClick={handleUpdateSupplier}
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
