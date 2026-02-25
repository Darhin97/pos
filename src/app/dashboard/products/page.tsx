"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/shared/Icon";
import { PageHeader } from "@/components/shared/PageHeader";
import { ContentContainer } from "@/components/shared/ContentContainer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { PRODUCTS } from "@/lib/data";
import Image from "next/image";

export default function ProductsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [supplier, setSupplier] = useState("");
  const [brand, setBrand] = useState("");
  const [status, setStatus] = useState("Active");
  const [orderNumber, setOrderNumber] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [products, setProducts] = useState(PRODUCTS);

  const toggleProductSelection = (id: number) => {
    setSelectedProducts((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const toggleAllProducts = () => {
    if (selectedProducts.length === products.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(products.map((p) => p.id));
    }
  };

  const toggleProductActive = (id: number) => {
    console.log("Toggling product active:", id);
    setProducts((prev) => {
      const updated = prev.map((p) => {
        if (p.id === id) {
          console.log("Product before toggle:", p.name, "active:", p.active);
          return { ...p, active: !p.active };
        }
        return p;
      });
      console.log("Updated products:", updated);
      return updated;
    });
  };

  return (
    <div className="flex flex-col h-full overflow-auto bg-white">
      <PageHeader
        breadcrumbs={[
          { label: "Products" }
        ]}
        title="Products"
      />

      {/* Action buttons and filters */}
      <div className="flex-none px-8 pb-4">
        <ContentContainer>
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-gray-600">
              Add, view and edit your products in one place.
            </p>
            <div className="flex gap-3">
              <Button variant="outline" className="h-9 px-4">
                Import
              </Button>
              <Button
                onClick={() => router.push('/dashboard/products/add')}
                className="h-9 px-4 bg-violet-600 hover:bg-violet-700 text-white"
              >
                Add product
              </Button>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-gray-50 rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
            {/* Search */}
            <div className="relative">
              <label className="block text-xs font-medium text-slate-900 mb-1.5">
                Search for products
              </label>
              <div className="relative">
                <Icon
                  name="Search"
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={16}
                />
                <Input
                  type="text"
                  placeholder="Enter name, SKU, handle or supplier code"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 h-9 text-sm"
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-medium text-slate-900 mb-1.5">
                Product category
              </label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="bakery">Bakery</SelectItem>
                  <SelectItem value="beverages">Beverages</SelectItem>
                  <SelectItem value="men">Men</SelectItem>
                  <SelectItem value="women">Women</SelectItem>
                  <SelectItem value="accessories">Accessories</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-xs font-medium text-slate-900 mb-1.5">
                Tags
              </label>
              <Input
                type="text"
                placeholder="Enter tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="h-9 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {/* Supplier */}
            <div>
              <label className="block text-xs font-medium text-slate-900 mb-1.5">
                Supplier
              </label>
              <Select value={supplier} onValueChange={setSupplier}>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue placeholder="Select a supplier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Suppliers</SelectItem>
                  <SelectItem value="nannas">Nanna's Kitchen</SelectItem>
                  <SelectItem value="jimmys">Jimmys Roasting Beans</SelectItem>
                  <SelectItem value="summer">Summer Sun</SelectItem>
                  <SelectItem value="fashion">Fashion Hub</SelectItem>
                  <SelectItem value="outdoor">Outdoor Gear</SelectItem>
                  <SelectItem value="textile">Textile World</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Brand */}
            <div>
              <label className="block text-xs font-medium text-slate-900 mb-1.5">
                Brand
              </label>
              <Select value={brand} onValueChange={setBrand}>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue placeholder="Select a brand" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Brands</SelectItem>
                  <SelectItem value="urban">Urban</SelectItem>
                  <SelectItem value="basics">Basics Co</SelectItem>
                  <SelectItem value="stwd">STWD</SelectItem>
                  <SelectItem value="elegance">Elegance</SelectItem>
                  <SelectItem value="chic">Chic</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-xs font-medium text-slate-900 mb-1.5">
                Status
              </label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue placeholder="Active" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                  <SelectItem value="All">All</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Purchase order number */}
            <div>
              <label className="block text-xs font-medium text-slate-900 mb-1.5">
                Purchase order number
              </label>
              <Input
                type="text"
                placeholder="Enter order numbers"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                className="h-9 text-sm"
              />
            </div>
          </div>

          {/* Search button */}
          <div className="flex justify-end mt-3">
            <Button className="h-9 px-6 bg-violet-600 hover:bg-violet-700 text-white">
              Search
            </Button>
          </div>
          </div>
        </ContentContainer>
      </div>

      {/* Products count and export */}
      <div className="flex-none px-8 pb-4">
        <ContentContainer>
        <div className="flex items-center justify-between py-3 border-b border-gray-200">
        <p className="text-sm text-gray-600">Displaying 8 active products</p>
        <button className="text-sm text-violet-600 hover:text-violet-700 font-medium flex items-center gap-1.5">
          <Icon name="Download" size={16} />
          Export list...
        </button>
        </div>
        </ContentContainer>
      </div>

      {/* Table */}
      <div className="flex-1 px-8 pb-8 overflow-auto">
        <ContentContainer>
        <table className="w-full">
          <thead className="bg-white sticky top-0 border-b border-gray-200">
            <tr>
              <th className="w-12 px-4 py-3">
                <input
                  type="checkbox"
                  checked={selectedProducts.length === products.length}
                  onChange={toggleAllProducts}
                  className="w-4 h-4 rounded border-gray-300 text-violet-600 focus:ring-violet-500"
                />
              </th>
              <th className="px-4 py-3 text-left">
                <button className="flex items-center gap-1 text-xs font-semibold text-slate-900 hover:text-slate-700">
                  Product
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-900">
                Brand
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-900">
                Supplier
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-900">
                Available to sell
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-900">
                Retail price
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-900">
                Active
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-900">
                Created
              </th>
              <th className="w-12 px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {products.map((product) => (
              <tr
                key={product.id}
                className="hover:bg-gray-50 transition-colors group"
              >
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedProducts.includes(product.id)}
                    onChange={() => toggleProductSelection(product.id)}
                    className="w-4 h-4 rounded border-gray-300 text-violet-600 focus:ring-violet-500"
                  />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <button className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-gray-600">
                      <Icon name="ChevronRight" size={16} />
                    </button>
                    <div className="w-10 h-10 rounded-md bg-gray-100 overflow-hidden shrink-0">
                      <Image
                        src={product.image}
                        alt={product.name}
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">
                        {product.name}
                      </p>
                      <p className="text-xs text-gray-500">{product.sku}</p>
                      {product.variants && (
                        <p className="text-xs text-gray-500">
                          {product.variants} variants
                        </p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {product.brand || "-"}
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-blue-600 hover:underline cursor-pointer">
                    {product.supplier}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-700 text-center">
                  {product.stock}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  GH₵{product.price.toFixed(2)}
                </td>
                <td className="px-4 py-3">
                  <Switch
                    checked={product.active}
                    onCheckedChange={() => toggleProductActive(product.id)}
                  />
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {product.createdAt}
                </td>
                <td className="px-4 py-3">
                  <button className="text-violet-600 hover:text-violet-700">
                    <Icon name="Pencil" size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </ContentContainer>
      </div>
    </div>
  );
}
