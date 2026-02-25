"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/shared/Icon";
import { SearchableSelect } from "@/components/shared/SearchableSelect";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";

export default function AddProductPage() {
  const router = useRouter();
  const [productType, setProductType] = useState("standard");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [skuCodeType, setSkuCodeType] = useState("auto-generated");
  const [skuCode, setSkuCode] = useState("10029");

  // Brand state
  const [brand, setBrand] = useState("");
  const [brands, setBrands] = useState([
    { value: "urban", label: "Urban" },
    { value: "basics", label: "Basics Co" },
    { value: "stwd", label: "STWD" },
    { value: "elegance", label: "Elegance" },
    { value: "chic", label: "Chic" },
  ]);

  // Category state
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([
    { value: "bakery", label: "Bakery" },
    { value: "beverages", label: "Beverages" },
    { value: "men", label: "Men" },
    { value: "women", label: "Women" },
    { value: "accessories", label: "Accessories" },
  ]);

  // Variant state
  const [variants, setVariants] = useState([
    {
      id: 1,
      name: "circle",
      skuCode: "10030",
      supplierCode: "",
      supplierPrice: "100.00",
      retailPrice: "120.00",
      enabled: true,
    },
  ]);

  const handleAddTag = (tag: string) => {
    if (tag && !selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setSelectedTags(selectedTags.filter((t) => t !== tag));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages([...images, ...Array.from(e.target.files)]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newImages = [...images];
    const draggedImage = newImages[draggedIndex];
    newImages.splice(draggedIndex, 1);
    newImages.splice(index, 0, draggedImage);

    setImages(newImages);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleAddBrand = (brandName: string) => {
    const newBrandValue = brandName.toLowerCase().replace(/\s+/g, "-");
    const newBrand = { value: newBrandValue, label: brandName };
    setBrands([...brands, newBrand]);
    setBrand(newBrandValue);
  };

  const handleAddCategory = (categoryName: string) => {
    const newCategoryValue = categoryName.toLowerCase().replace(/\s+/g, "-");
    const newCategory = { value: newCategoryValue, label: categoryName };
    setCategories([...categories, newCategory]);
    setCategory(newCategoryValue);
  };

  return (
    <div className="flex flex-col h-full overflow-auto bg-white">
      {/* Header */}
      <div className="flex-none border-b border-gray-200 bg-gray-50">
        <div className="px-8 py-6">
          <h1 className="text-2xl font-semibold text-slate-900 mb-2">
            New product
          </h1>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Add, view and edit your products all in one place.{" "}
              <a href="#" className="text-violet-600 hover:underline">
                Need help?
              </a>
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => router.back()}
                className="h-9 px-6"
              >
                Cancel
              </Button>
              <Button className="h-9 px-6 bg-violet-600 hover:bg-violet-700 text-white">
                Save
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="flex-1 px-8 py-6 overflow-auto">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* General Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-6">
              General
            </h2>

            <div className="space-y-5">
              {/* Product Name */}
              <div>
                <Label htmlFor="productName">Product name</Label>
                <Input
                  id="productName"
                  placeholder="Enter product name"
                  className="mt-1.5"
                />
              </div>

              {/* Brand */}
              <div>
                <Label htmlFor="brand">Brand</Label>
                <SearchableSelect
                  options={brands}
                  value={brand}
                  onValueChange={setBrand}
                  placeholder="Choose a brand"
                  searchPlaceholder="Search all brands"
                  emptyMessage='No results matching "{query}"'
                  addNewLabel="brand"
                  onAddNew={handleAddBrand}
                  className="mt-1.5"
                />
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter product description"
                  className="mt-1.5 min-h-[100px]"
                />
              </div>

              {/* Tags */}
              <div>
                <Label htmlFor="tags">Tags</Label>
                <div className="mt-1.5">
                  <div className="flex flex-wrap gap-2 mb-2">
                    {selectedTags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-gray-100 text-sm text-gray-700"
                      >
                        {tag}
                        <button
                          onClick={() => handleRemoveTag(tag)}
                          className="hover:text-gray-900"
                        >
                          <Icon name="X" size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      id="tags"
                      placeholder="Type a tag and press Enter"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddTag(tagInput);
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleAddTag(tagInput)}
                      className="shrink-0"
                    >
                      Add
                    </Button>
                  </div>
                </div>
              </div>

              {/* Product Category */}
              <div>
                <Label htmlFor="category">Product category</Label>
                <SearchableSelect
                  options={categories}
                  value={category}
                  onValueChange={setCategory}
                  placeholder="Select a category"
                  searchPlaceholder="Search all categories"
                  emptyMessage='No results matching "{query}"'
                  addNewLabel="category"
                  onAddNew={handleAddCategory}
                  className="mt-1.5"
                />
              </div>

              {/* Upload Images */}
              <div>
                <Label>Images</Label>
                <div className="mt-1.5">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-violet-400 transition-colors">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="cursor-pointer flex flex-col items-center gap-2"
                    >
                      <Icon name="Upload" size={24} className="text-gray-400" />
                      <p className="text-sm text-gray-600">
                        Drop images here or click to upload
                      </p>
                      <p className="text-xs text-gray-500">
                        Drag to rearrange. Drop outside to delete.
                      </p>
                    </label>
                  </div>

                  {images.length > 0 && (
                    <div className="grid grid-cols-4 gap-4 mt-4">
                      {images.map((image, index) => (
                        <div
                          key={index}
                          draggable
                          onDragStart={() => handleDragStart(index)}
                          onDragOver={(e) => handleDragOver(e, index)}
                          onDragEnd={handleDragEnd}
                          className={`relative group aspect-square rounded-lg overflow-hidden border border-gray-200 cursor-move transition-opacity ${
                            draggedIndex === index ? "opacity-50" : "opacity-100"
                          }`}
                        >
                          <img
                            src={URL.createObjectURL(image)}
                            alt={`Upload ${index + 1}`}
                            className="w-full h-full object-cover pointer-events-none"
                          />
                          <button
                            onClick={() => handleRemoveImage(index)}
                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                          >
                            <Icon name="X" size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Supplier Information Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-6">
              Supplier information
            </h2>

            <div className="space-y-5">
              {/* Supplier */}
              <div>
                <Label htmlFor="supplier">Supplier (optional)</Label>
                <Select>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Select a supplier" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nannas">Nanna's Kitchen</SelectItem>
                    <SelectItem value="jimmys">Jimmys Roasting Beans</SelectItem>
                    <SelectItem value="summer">Summer Sun</SelectItem>
                    <SelectItem value="fashion">Fashion Hub</SelectItem>
                    <SelectItem value="outdoor">Outdoor Gear</SelectItem>
                    <SelectItem value="textile">Textile World</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Supplier Price */}
              <div>
                <Label htmlFor="supplierPrice">
                  Supplier price <span className="text-red-500">*</span>
                </Label>
                <div className="relative mt-1.5">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    GH₵
                  </span>
                  <Input
                    id="supplierPrice"
                    type="number"
                    placeholder="0.00"
                    className="pl-12"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Inventory Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-2">
              Inventory
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              The type of product we choose determines how we manage inventory
              and reporting.
            </p>

            {/* Product Type Selection */}
            <RadioGroup
              value={productType}
              onValueChange={setProductType}
              className="space-y-4 mb-6"
            >
              <div className="flex items-start space-x-3">
                <RadioGroupItem value="standard" id="standard" />
                <div className="flex-1">
                  <Label htmlFor="standard" className="font-medium cursor-pointer">
                    Standard product
                  </Label>
                  <p className="text-sm text-gray-600 mt-1">
                    This product is a single SKU with its own inventory.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <RadioGroupItem value="variant" id="variant" />
                <div className="flex-1">
                  <Label htmlFor="variant" className="font-medium cursor-pointer">
                    Variant product
                  </Label>
                  <p className="text-sm text-gray-600 mt-1">
                    This is a group of similar products with different attributes
                    like size or color. Each variant is a unique SKU with its own
                    inventory.
                  </p>
                </div>
              </div>
            </RadioGroup>

            {/* Standard Product - SKU Codes */}
            {productType === "standard" && (
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-base font-semibold text-slate-900 mb-4">
                  SKU CODES
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="skuCodeType">SKU code type</Label>
                    <Select value={skuCodeType} onValueChange={setSkuCodeType}>
                      <SelectTrigger className="mt-1.5">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="auto-generated">
                          Auto-generated
                        </SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="skuCode">SKU code</Label>
                    <Input
                      id="skuCode"
                      value={skuCode}
                      onChange={(e) => setSkuCode(e.target.value)}
                      className="mt-1.5"
                    />
                  </div>
                </div>

                <button className="mt-3 text-violet-600 hover:text-violet-700 text-sm font-medium flex items-center gap-1">
                  <Icon name="Plus" size={16} />
                  Add another code
                </button>

                {/* Preview */}
                <div className="mt-6 bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-slate-900 mb-3">
                    Preview
                  </h4>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-md bg-gray-200"></div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        Product name
                      </p>
                      <p className="text-xs text-gray-500">{skuCode}</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mt-4">
                    The first SKU code will be shown to staff and customers to
                    help identify this product. When you have multiple codes all
                    the barcodes will be scannable.
                  </p>
                </div>
              </div>
            )}

            {/* Variant Product */}
            {productType === "variant" && (
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-base font-semibold text-slate-900 mb-2">
                  Variants
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Choose up to three variable attributes for this product to
                  create and manage SKUs and their inventory levels.
                </p>

                {/* Attribute/Value Section */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label htmlFor="attribute">Attribute (e.g. color)</Label>
                    <Select>
                      <SelectTrigger className="mt-1.5">
                        <SelectValue placeholder="shape" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="shape">shape</SelectItem>
                        <SelectItem value="size">size</SelectItem>
                        <SelectItem value="color">color</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="value">Value (e.g. Green)</Label>
                    <div className="flex gap-2 mt-1.5">
                      <div className="flex-1 flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-md bg-white">
                        <Icon name="Circle" size={16} className="text-gray-400" />
                        <span className="text-sm">circle</span>
                        <button className="ml-auto text-gray-400 hover:text-gray-600">
                          <Icon name="Trash2" size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mb-4">
                  <button className="text-violet-600 hover:text-violet-700 text-sm font-medium flex items-center gap-1">
                    <Icon name="Plus" size={16} />
                    Add another attribute
                  </button>
                  <button className="text-violet-600 hover:text-violet-700 text-sm font-medium flex items-center gap-1">
                    <Icon name="Edit" size={16} />
                    Edit value names
                  </button>
                </div>

                <div className="bg-gray-50 rounded-lg p-3 mb-6 flex items-start gap-2">
                  <Icon name="Lock" size={14} className="text-gray-600 mt-0.5" />
                  <p className="text-xs text-gray-600">
                    Attributes and values can't be edited on variant products
                    imported from the B2B catalog.
                  </p>
                </div>

                {/* Variants Table */}
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 mb-3">
                    This product has {variants.length} variant
                  </h4>

                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-slate-900">
                            <button className="flex items-center gap-1">
                              Variant name
                            </button>
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-slate-900">
                            SKU code
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-slate-900">
                            Supplier code
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-slate-900">
                            Supplier price
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-slate-900">
                            Retail price
                            <div className="text-xs font-normal text-gray-500">
                              Excluding tax
                            </div>
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-slate-900">
                            Enabled
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-100">
                        {variants.map((variant) => (
                          <tr key={variant.id}>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <button className="text-gray-400 hover:text-gray-600">
                                  <Icon name="ChevronRight" size={16} />
                                </button>
                                <div className="w-8 h-8 rounded-md bg-gray-200"></div>
                                <span className="text-sm text-slate-900">
                                  {variant.name}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <Input
                                value={variant.skuCode}
                                onChange={(e) => {
                                  setVariants(
                                    variants.map((v) =>
                                      v.id === variant.id
                                        ? { ...v, skuCode: e.target.value }
                                        : v
                                    )
                                  );
                                }}
                                className="h-8 text-sm"
                              />
                            </td>
                            <td className="px-4 py-3">
                              <Input
                                placeholder="Enter code"
                                value={variant.supplierCode}
                                onChange={(e) => {
                                  setVariants(
                                    variants.map((v) =>
                                      v.id === variant.id
                                        ? { ...v, supplierCode: e.target.value }
                                        : v
                                    )
                                  );
                                }}
                                className="h-8 text-sm"
                              />
                            </td>
                            <td className="px-4 py-3">
                              <div className="relative">
                                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                                  GH₵
                                </span>
                                <Input
                                  type="number"
                                  value={variant.supplierPrice}
                                  onChange={(e) => {
                                    setVariants(
                                      variants.map((v) =>
                                        v.id === variant.id
                                          ? {
                                              ...v,
                                              supplierPrice: e.target.value,
                                            }
                                          : v
                                      )
                                    );
                                  }}
                                  className="h-8 text-sm pl-10"
                                />
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="relative">
                                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                                  GH₵
                                </span>
                                <Input
                                  type="number"
                                  value={variant.retailPrice}
                                  onChange={(e) => {
                                    setVariants(
                                      variants.map((v) =>
                                        v.id === variant.id
                                          ? { ...v, retailPrice: e.target.value }
                                          : v
                                      )
                                    );
                                  }}
                                  className="h-8 text-sm pl-10"
                                />
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <Switch
                                checked={variant.enabled}
                                onCheckedChange={(checked) => {
                                  setVariants(
                                    variants.map((v) =>
                                      v.id === variant.id
                                        ? { ...v, enabled: checked }
                                        : v
                                    )
                                  );
                                }}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Price Section - Only for Standard Products */}
          {productType === "standard" && (
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
              <h2 className="text-lg font-semibold text-slate-900 mb-6">
                Price
              </h2>

              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-900">
                        Price point
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-900">
                        Supplier price
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-900">
                        Markup
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-900">
                        Margin
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-900">
                        Retail price
                        <div className="text-xs font-normal text-gray-500">
                          Excluding tax
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    <tr>
                      <td className="px-4 py-3 text-sm text-slate-900">
                        General Price
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        GH₵100.00
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            defaultValue="20.00"
                            className="h-8 text-sm w-24"
                          />
                          <span className="text-sm text-gray-500">%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            defaultValue="16.67"
                            className="h-8 text-sm w-24"
                          />
                          <span className="text-sm text-gray-500">%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="relative">
                          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                            GH₵
                          </span>
                          <Input
                            type="number"
                            defaultValue="120.00"
                            className="h-8 text-sm pl-10 border-2 border-violet-500 focus:ring-violet-500"
                          />
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
