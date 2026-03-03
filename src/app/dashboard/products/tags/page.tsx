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
import { TAGS } from "@/lib/data";

export default function ProductTagsPage() {
  const [tags, setTags] = useState(TAGS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<typeof TAGS[0] | null>(null);
  const [tagName, setTagName] = useState("");

  const clearForm = () => {
    setTagName("");
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this tag?")) {
      setTags((prev) => prev.filter((tag) => tag.id !== id));
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
    setEditingTag(null);
    setIsEditModalOpen(false);
  };

  const handleAddTag = () => {
    if (tagName.trim()) {
      const newTag = {
        id: Math.max(...tags.map((t) => t.id)) + 1,
        name: tagName.trim(),
        productCount: 0,
      };
      setTags((prev) => [...prev, newTag]);
      clearForm();
      setIsModalOpen(false);
    }
  };

  const handleEditClick = (tag: typeof TAGS[0]) => {
    setEditingTag(tag);
    setTagName(tag.name);
    setIsEditModalOpen(true);
  };

  const handleUpdateTag = () => {
    if (tagName.trim() && editingTag) {
      setTags((prev) =>
        prev.map((tag) =>
          tag.id === editingTag.id
            ? { ...tag, name: tagName.trim() }
            : tag
        )
      );
      clearForm();
      setEditingTag(null);
      setIsEditModalOpen(false);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-auto bg-white">
      <PageHeader
        breadcrumbs={[
          { label: "Products" },
          { label: "Product Tags" }
        ]}
        title="Product Tags"
      />

      {/* Header section */}
      <div className="flex-none px-8 pb-6 pt-4">
        <ContentContainer>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              A list of all of your product tags.
            </p>
            <Button
              onClick={handleOpenAddModal}
              className="h-9 px-4 bg-violet-600 hover:bg-violet-700 text-white"
            >
              Add tag
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
              {tags.map((tag) => (
                <tr
                  key={tag.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <span className="text-sm font-medium text-slate-900 underline cursor-pointer hover:text-violet-600">
                      {tag.name}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 text-center">
                    {tag.productCount}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3 justify-end">
                      <button
                        onClick={() => handleEditClick(tag)}
                        className="text-violet-600 hover:text-violet-700"
                      >
                        <Icon name="Pencil" size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(tag.id)}
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

      {/* Add Tag Modal */}
      <Dialog open={isModalOpen} onOpenChange={(open) => !open && handleCloseAddModal()}>
        <DialogContent className="sm:max-w-[600px] bg-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Add tag</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Tag name
              </label>
              <Input
                placeholder="Enter a tag name"
                value={tagName}
                onChange={(e) => setTagName(e.target.value)}
                className="w-full"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button
              onClick={handleAddTag}
              className="bg-violet-600 hover:bg-violet-700 text-white px-6"
            >
              Add tag
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Tag Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={(open) => !open && handleCloseEditModal()}>
        <DialogContent className="sm:max-w-[600px] bg-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Edit tag</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Tag name
              </label>
              <Input
                placeholder="Enter a tag name"
                value={tagName}
                onChange={(e) => setTagName(e.target.value)}
                className="w-full"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button
              onClick={handleUpdateTag}
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
