"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PRODUCTS } from "@/lib/data";
import type { Product } from "@/lib/types";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = parseInt(params.id as string);

  const [isLoading, setIsLoading] = useState(true);
  const [productNotFound, setProductNotFound] = useState(false);
  const [productType, setProductType] = useState("standard");
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [existingImageUrl, setExistingImageUrl] = useState<string>("");
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [skuCodeType, setSkuCodeType] = useState("auto-generated");
  const [skuCode, setSkuCode] = useState("");
  const [availableToSell, setAvailableToSell] = useState("");

  // Price calculation state
  const [supplierPrice, setSupplierPrice] = useState("0.00");
  const [markup, setMarkup] = useState("0.00");
  const [margin, setMargin] = useState("0.00");
  const [retailPrice, setRetailPrice] = useState("0.00");

  // Brand state
  const [brand, setBrand] = useState("");
  const [brands, setBrands] = useState([
    { value: "urban", label: "Urban" },
    { value: "basics", label: "Basics Co" },
    { value: "stwd", label: "STWD" },
    { value: "elegance", label: "Elegance" },
    { value: "chic", label: "Chic" },
  ]);
  const [isAddBrandModalOpen, setIsAddBrandModalOpen] = useState(false);
  const [pendingBrandName, setPendingBrandName] = useState("");

  // Category state
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([
    { value: "bakery", label: "Bakery" },
    { value: "beverages", label: "Beverages" },
    { value: "men", label: "Men" },
    { value: "women", label: "Women" },
    { value: "accessories", label: "Accessories" },
  ]);
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [pendingCategoryName, setPendingCategoryName] = useState("");

  // Variant state
  const [attributes, setAttributes] = useState<
    { id: number; name: string; values: string[] }[]
  >([]);
  const [attributeInput, setAttributeInput] = useState<{
    [key: number]: string;
  }>({});
  const [variants, setVariants] = useState<
    {
      id: number;
      name: string;
      skuCode: string;
      quantity: string;
      supplierPrice: string;
      retailPrice: string;
      enabled: boolean;
    }[]
  >([]);

  // Attribute options state
  const [attributeOptions, setAttributeOptions] = useState([
    { value: "size", label: "Size" },
    { value: "color", label: "Color" },
    { value: "shape", label: "Shape" },
    { value: "texture", label: "Texture" },
    { value: "material", label: "Material" },
    { value: "style", label: "Style" },
    { value: "pattern", label: "Pattern" },
  ]);
  const [isAddAttributeModalOpen, setIsAddAttributeModalOpen] = useState(false);
  const [pendingAttributeName, setPendingAttributeName] = useState("");
  const [pendingAttributeId, setPendingAttributeId] = useState<number | null>(null);

  // Load product data on mount
  useEffect(() => {
    const loadProduct = () => {
      // Get custom products from localStorage
      const customProducts = JSON.parse(localStorage.getItem('customProducts') || '[]');
      const allProducts = [...PRODUCTS, ...customProducts];

      // Find the product by ID
      const product = allProducts.find(p => p.id === productId);

      if (!product) {
        setProductNotFound(true);
        setIsLoading(false);
        return;
      }

      // Populate form fields with product data
      setProductName(product.name);
      setDescription(product._metadata?.description || "");
      setSelectedTags(product._metadata?.tags || []);
      setExistingImageUrl(product.image);

      // Set brand
      const productBrand = product.brand;
      if (productBrand) {
        const brandValue = productBrand.toLowerCase().replace(/\s+/g, "-");
        // Check if brand exists in options, if not add it
        if (!brands.find(b => b.value === brandValue)) {
          setBrands(prev => [...prev, { value: brandValue, label: productBrand }]);
        }
        setBrand(brandValue);
      }

      // Set category
      const productCategory = product.category;
      if (productCategory) {
        const categoryValue = productCategory.toLowerCase().replace(/\s+/g, "-");
        if (!categories.find(c => c.value === categoryValue)) {
          setCategories(prev => [...prev, { value: categoryValue, label: productCategory }]);
        }
        setCategory(categoryValue);
      }

      // Set product type and related fields
      const metadata = product._metadata;
      if (metadata?.productType) {
        setProductType(metadata.productType);

        if (metadata.productType === "standard") {
          setSkuCode(product.sku || "");
          setAvailableToSell(product.stock?.toString() || "0");
          setSupplierPrice(metadata.supplierPrice?.toFixed(2) || "0.00");
          setMarkup(metadata.markup?.toFixed(2) || "0.00");
          setMargin(metadata.margin?.toFixed(2) || "0.00");
          setRetailPrice(product.price.toFixed(2));
        } else if (metadata.productType === "variant") {
          setSkuCode(product.sku?.replace("-BASE", "") || "");
          // Restore attributes
          if (metadata.attributes) {
            setAttributes(metadata.attributes);
          }
          // Restore variants
          if (metadata.variantData) {
            setVariants(metadata.variantData);
          }
        }
      } else {
        // Product doesn't have metadata (likely from mock data)
        setProductType("standard");
        setSkuCode(product.sku || "");
        setAvailableToSell(product.stock?.toString() || "0");
        setRetailPrice(product.price.toFixed(2));
      }

      setIsLoading(false);
    };

    loadProduct();
  }, [productId]);

  // Redirect if product not found
  useEffect(() => {
    if (productNotFound) {
      alert("Product not found. Redirecting to products list.");
      router.push('/dashboard/products');
    }
  }, [productNotFound, router]);

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
      // Clear existing image when new one is uploaded
      if (images.length === 0 && e.target.files.length > 0) {
        setExistingImageUrl("");
      }
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleRemoveExistingImage = () => {
    setExistingImageUrl("");
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
    setPendingBrandName(brandName);
    setIsAddBrandModalOpen(true);
  };

  const handleConfirmAddBrand = () => {
    if (pendingBrandName.trim()) {
      const newBrandValue = pendingBrandName.toLowerCase().replace(/\s+/g, "-");
      const newBrand = { value: newBrandValue, label: pendingBrandName.trim() };
      setBrands([...brands, newBrand]);
      setBrand(newBrandValue);
      setPendingBrandName("");
      setIsAddBrandModalOpen(false);
    }
  };

  const handleCloseBrandModal = () => {
    setPendingBrandName("");
    setIsAddBrandModalOpen(false);
  };

  const handleAddCategory = (categoryName: string) => {
    setPendingCategoryName(categoryName);
    setIsAddCategoryModalOpen(true);
  };

  const handleConfirmAddCategory = () => {
    if (pendingCategoryName.trim()) {
      const newCategoryValue = pendingCategoryName.toLowerCase().replace(/\s+/g, "-");
      const newCategory = { value: newCategoryValue, label: pendingCategoryName.trim() };
      setCategories([...categories, newCategory]);
      setCategory(newCategoryValue);
      setPendingCategoryName("");
      setIsAddCategoryModalOpen(false);
    }
  };

  const handleCloseCategoryModal = () => {
    setPendingCategoryName("");
    setIsAddCategoryModalOpen(false);
  };

  // Variant attribute functions
  const handleAddAttribute = () => {
    if (attributes.length < 3) {
      const newId = Date.now();
      setAttributes([...attributes, { id: newId, name: "", values: [] }]);
    }
  };

  const handleRemoveAttribute = (id: number) => {
    setAttributes(attributes.filter((attr) => attr.id !== id));
    const newAttributeInput = { ...attributeInput };
    delete newAttributeInput[id];
    setAttributeInput(newAttributeInput);
  };

  const handleAttributeNameChange = (id: number, name: string) => {
    setAttributes(
      attributes.map((attr) => (attr.id === id ? { ...attr, name } : attr))
    );
  };

  const handleAddNewAttributeType = (id: number, attributeName: string) => {
    setPendingAttributeId(id);
    setPendingAttributeName(attributeName);
    setIsAddAttributeModalOpen(true);
  };

  const handleConfirmAddAttributeType = () => {
    if (pendingAttributeName.trim() && pendingAttributeId !== null) {
      const newAttributeValue = pendingAttributeName.toLowerCase().replace(/\s+/g, "-");
      const newAttributeOption = {
        value: newAttributeValue,
        label: pendingAttributeName.trim()
      };
      setAttributeOptions([...attributeOptions, newAttributeOption]);
      handleAttributeNameChange(pendingAttributeId, newAttributeValue);
      setPendingAttributeName("");
      setPendingAttributeId(null);
      setIsAddAttributeModalOpen(false);
    }
  };

  const handleCloseAttributeModal = () => {
    setPendingAttributeName("");
    setPendingAttributeId(null);
    setIsAddAttributeModalOpen(false);
  };

  const handleAddAttributeValue = (id: number, value: string) => {
    if (value.trim()) {
      setAttributes(
        attributes.map((attr) =>
          attr.id === id
            ? { ...attr, values: [...attr.values, value.trim()] }
            : attr
        )
      );
      setAttributeInput({ ...attributeInput, [id]: "" });
    }
  };

  const handleRemoveAttributeValue = (attrId: number, value: string) => {
    setAttributes(
      attributes.map((attr) =>
        attr.id === attrId
          ? { ...attr, values: attr.values.filter((v) => v !== value) }
          : attr
      )
    );
  };

  // Generate variants from attribute combinations
  const generateVariants = () => {
    const validAttributes = attributes.filter(
      (attr) => attr.name && attr.values.length > 0
    );

    if (validAttributes.length === 0) {
      setVariants([]);
      return;
    }

    // Generate Cartesian product
    const cartesian = (...arrays: string[][]): string[][] => {
      return arrays.reduce(
        (acc, array) =>
          acc.flatMap((x) => array.map((y) => [...x, y])),
        [[]] as string[][]
      );
    };

    const valueArrays = validAttributes.map((attr) => attr.values);
    const combinations = cartesian(...valueArrays);

    // Generate variants from combinations
    const baseSkuCode = parseInt(skuCode) || 10007;
    const newVariants = combinations.map((combo, index) => {
      const existingVariant = variants.find((v) => v.name === combo.join(" / "));
      return (
        existingVariant || {
          id: Date.now() + index,
          name: combo.join(" / "),
          skuCode: String(baseSkuCode + index),
          quantity: "0",
          supplierPrice: "0.00",
          retailPrice: "0.00",
          enabled: true,
        }
      );
    });

    setVariants(newVariants);
  };

  const handleDeleteVariant = (id: number) => {
    setVariants(variants.filter((v) => v.id !== id));
  };

  // Price calculation functions
  const calculateFromMarkup = (supplier: number, markupValue: number) => {
    const retail = supplier * (1 + markupValue / 100);
    const marginValue = supplier > 0 ? ((retail - supplier) / retail) * 100 : 0;
    setRetailPrice(retail.toFixed(2));
    setMargin(marginValue.toFixed(2));
  };

  const calculateFromMargin = (supplier: number, marginValue: number) => {
    if (marginValue >= 100) {
      setMargin("99.99");
      return;
    }
    const retail = supplier / (1 - marginValue / 100);
    const markupValue = supplier > 0 ? ((retail - supplier) / supplier) * 100 : 0;
    setRetailPrice(retail.toFixed(2));
    setMarkup(markupValue.toFixed(2));
  };

  const calculateFromRetailPrice = (supplier: number, retail: number) => {
    const markupValue = supplier > 0 ? ((retail - supplier) / supplier) * 100 : 0;
    const marginValue = retail > 0 ? ((retail - supplier) / retail) * 100 : 0;
    setMarkup(markupValue.toFixed(2));
    setMargin(marginValue.toFixed(2));
  };

  const handleSupplierPriceChange = (value: string) => {
    setSupplierPrice(value);
    const supplier = parseFloat(value) || 0;
    const retail = parseFloat(retailPrice) || 0;
    if (retail > 0) {
      calculateFromRetailPrice(supplier, retail);
    }
  };

  const handleMarkupChange = (value: string) => {
    setMarkup(value);
    const supplier = parseFloat(supplierPrice) || 0;
    const markupValue = parseFloat(value) || 0;
    if (supplier > 0) {
      calculateFromMarkup(supplier, markupValue);
    }
  };

  const handleMarginChange = (value: string) => {
    setMargin(value);
    const supplier = parseFloat(supplierPrice) || 0;
    const marginValue = parseFloat(value) || 0;
    if (supplier > 0) {
      calculateFromMargin(supplier, marginValue);
    }
  };

  const handleRetailPriceChange = (value: string) => {
    setRetailPrice(value);
    const supplier = parseFloat(supplierPrice) || 0;
    const retail = parseFloat(value) || 0;
    if (supplier > 0) {
      calculateFromRetailPrice(supplier, retail);
    }
  };

  // Update product handler
  const handleUpdateProduct = async () => {
    // 1. Validate required fields
    if (!productName.trim()) {
      alert("Please enter a product name");
      return;
    }

    // Supplier price only required for standard products
    if (productType === "standard" && (!supplierPrice || parseFloat(supplierPrice) <= 0)) {
      alert("Please enter a valid supplier price");
      return;
    }

    if (productType === "standard" && (!retailPrice || parseFloat(retailPrice) <= 0)) {
      alert("Please enter a valid retail price");
      return;
    }

    if (productType === "variant" && variants.length === 0) {
      alert("Please add at least one variant");
      return;
    }

    // Validate variant prices
    if (productType === "variant") {
      const invalidVariants = variants.filter(
        v => !v.supplierPrice || parseFloat(v.supplierPrice) <= 0 ||
             !v.retailPrice || parseFloat(v.retailPrice) <= 0
      );
      if (invalidVariants.length > 0) {
        alert("Please ensure all variants have valid supplier and retail prices");
        return;
      }
    }

    // 2. Handle image - use new image if uploaded, otherwise keep existing
    let imageData = existingImageUrl;
    if (images.length > 0) {
      try {
        imageData = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(images[0]);
        });
      } catch (error) {
        console.error("Error converting image:", error);
      }
    }

    // If no image at all, use placeholder
    if (!imageData) {
      imageData = "https://cdn.pixabay.com/photo/2016/12/06/09/31/blank-1886008_1280.png";
    }

    // 3. Build updated product object
    const updatedProduct: Product = {
      id: productId, // Keep the same ID
      name: productName,
      brand: brands.find(b => b.value === brand)?.label || "",
      category: categories.find(c => c.value === category)?.label || "",
      sku: productType === "standard" ? skuCode : `${skuCode}-BASE`,
      supplier: "N/A",
      image: imageData,
      price: productType === "standard"
        ? parseFloat(retailPrice)
        : (variants.length > 0 ? parseFloat(variants[0].retailPrice) : 0),
      stock: productType === "standard"
        ? (availableToSell ? parseInt(availableToSell) : 0)
        : variants.reduce((sum, v) => sum + (parseInt(v.quantity) || 0), 0),
      active: true,
      createdAt: new Date().toLocaleDateString(), // Keep original or use existing
      variants: productType === "variant" ? variants.length : undefined,
      sizes: [],
      colors: [],
      _metadata: {
        productType: productType as "standard" | "variant",
        tags: selectedTags,
        description: description,
        supplierPrice: parseFloat(supplierPrice),
        markup: parseFloat(markup),
        margin: parseFloat(margin),
        variantData: productType === "variant" ? variants : undefined,
        attributes: productType === "variant" ? attributes : undefined,
      }
    };

    // 4. Get existing products from localStorage
    const savedProducts = JSON.parse(localStorage.getItem('customProducts') || '[]');

    // 5. Find and update the product
    const productIndex = savedProducts.findIndex((p: Product) => p.id === productId);

    if (productIndex !== -1) {
      // Update existing product
      savedProducts[productIndex] = updatedProduct;
      localStorage.setItem('customProducts', JSON.stringify(savedProducts));
    } else {
      // Product might be from mock data - add as new custom product
      savedProducts.push(updatedProduct);
      localStorage.setItem('customProducts', JSON.stringify(savedProducts));
    }

    // 6. Navigate back to products list
    router.push('/dashboard/products');
  };

  // Auto-generate variants when attributes change
  useEffect(() => {
    if (productType === "variant" && attributes.length > 0) {
      generateVariants();
    }
  }, [attributes]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-600">Loading product...</p>
      </div>
    );
  }

  return (
    <TooltipProvider>
    <div className="flex flex-col h-full overflow-auto bg-white">
      {/* Header */}
      <div className="flex-none border-b border-gray-200 bg-gray-50">
        <div className="px-8 py-6">
          <h1 className="text-2xl font-semibold text-slate-900 mb-2">
            Edit product
          </h1>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Edit product details and save your changes.{" "}
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
              <Button
                onClick={handleUpdateProduct}
                className="h-9 px-6 bg-violet-600 hover:bg-violet-700 text-white"
              >
                Update
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
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
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
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
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

                  {/* Show existing image */}
                  {existingImageUrl && images.length === 0 && (
                    <div className="grid grid-cols-4 gap-4 mt-4">
                      <div className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200">
                        <img
                          src={existingImageUrl}
                          alt="Current product"
                          className="w-full h-full object-cover"
                        />
                        <button
                          onClick={handleRemoveExistingImage}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                        >
                          <Icon name="X" size={14} />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Show new images */}
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

          {/* Inventory Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
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
                        {productName || "Product name"}
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

                {/* Inventory Level */}
                <div className="border-t border-gray-200 pt-6 mt-6">
                  <h3 className="text-base font-semibold text-slate-900 mb-4">
                    INVENTORY LEVEL
                  </h3>

                  <div>
                    <Label htmlFor="availableToSell">Available to sell</Label>
                    <Input
                      id="availableToSell"
                      type="number"
                      value={availableToSell}
                      onChange={(e) => setAvailableToSell(e.target.value)}
                      placeholder="0"
                      className="mt-1.5"
                      min="0"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Variant Product */}
            {productType === "variant" && (
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-base font-semibold text-slate-900 mb-2">
                  Variants
                </h3>
                <p className="text-sm text-gray-600 mb-6">
                  Choose up to three variable attributes for this product to
                  create and manage SKUs and their inventory levels.
                </p>

                {/* Attributes Section */}
                <div className="space-y-4 mb-4">
                  {attributes.map((attr, index) => (
                    <div key={attr.id} className="grid grid-cols-2 gap-4">
                      {/* Attribute Dropdown */}
                      <div>
                        <Label htmlFor={`attribute-${attr.id}`}>
                          Attribute (e.g. color)
                        </Label>
                        <SearchableSelect
                          options={attributeOptions.filter(
                            (option) =>
                              !attributes.some(
                                (a) => a.name === option.value && a.id !== attr.id
                              )
                          )}
                          value={attr.name}
                          onValueChange={(value) =>
                            handleAttributeNameChange(attr.id, value)
                          }
                          placeholder="Select attribute"
                          searchPlaceholder="Search attributes"
                          emptyMessage='No results matching "{query}"'
                          addNewLabel="attribute"
                          onAddNew={(attributeName) =>
                            handleAddNewAttributeType(attr.id, attributeName)
                          }
                          className="mt-1.5"
                        />
                      </div>

                      {/* Value Input with Tags */}
                      <div>
                        <Label htmlFor={`value-${attr.id}`}>
                          Value (e.g. Green)
                        </Label>
                        <div className="mt-1.5">
                          {/* Display added values as chips */}
                          {attr.values.length > 0 && (
                            <div className="flex flex-wrap gap-2 p-2 border border-gray-200 rounded-md bg-white mb-2">
                              {attr.values.map((value) => (
                                <span
                                  key={value}
                                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-gray-100 text-sm text-gray-700"
                                >
                                  <Icon
                                    name="Grid2x2"
                                    size={14}
                                    className="text-gray-400"
                                  />
                                  {value}
                                  <button
                                    onClick={() =>
                                      handleRemoveAttributeValue(attr.id, value)
                                    }
                                    className="hover:text-gray-900"
                                  >
                                    <Icon name="Trash2" size={14} />
                                  </button>
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Input for new value */}
                          <div className="flex gap-2">
                            <Input
                              id={`value-${attr.id}`}
                              placeholder="Type and press Enter"
                              value={attributeInput[attr.id] || ""}
                              onChange={(e) =>
                                setAttributeInput({
                                  ...attributeInput,
                                  [attr.id]: e.target.value,
                                })
                              }
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  handleAddAttributeValue(
                                    attr.id,
                                    attributeInput[attr.id] || ""
                                  );
                                }
                              }}
                            />
                            {index === attributes.length - 1 && attributes.length > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => handleRemoveAttribute(attr.id)}
                                className="shrink-0 text-gray-400 hover:text-red-600"
                              >
                                <Icon name="X" size={16} />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                {attributes.length < 3 && (
                  <div className="mb-4">
                    <button
                      onClick={handleAddAttribute}
                      className="text-violet-600 hover:text-violet-700 text-sm font-medium flex items-center gap-1"
                    >
                      <Icon name="Plus" size={16} />
                      Add another attribute
                    </button>
                  </div>
                )}

                <div className="bg-gray-50 rounded-lg p-3 mb-6 flex items-start gap-2">
                  <Icon name="Lock" size={14} className="text-gray-600 mt-0.5" />
                  <p className="text-xs text-gray-600">
                    Attributes and values can't be edited on variant products
                    imported from the B2B catalog.
                  </p>
                </div>

                {/* Variants Table */}
                {variants.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 mb-3">
                      This product has {variants.length} variant
                      {variants.length !== 1 ? "s" : ""}
                    </h4>

                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-900 w-12">
                              <input
                                type="checkbox"
                                className="rounded border-gray-300"
                              />
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-900">
                              Variant name
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-900">
                              SKU code
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-900">
                              Quantity
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
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-900 w-12"></th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                          {variants.map((variant) => (
                            <tr key={variant.id} className="hover:bg-gray-50">
                              <td className="px-4 py-3">
                                <input
                                  type="checkbox"
                                  className="rounded border-gray-300"
                                />
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-3">
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
                                  type="number"
                                  placeholder="0"
                                  value={variant.quantity}
                                  onChange={(e) => {
                                    setVariants(
                                      variants.map((v) =>
                                        v.id === variant.id
                                          ? { ...v, quantity: e.target.value }
                                          : v
                                      )
                                    );
                                  }}
                                  className="h-8 text-sm"
                                  min="0"
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
                              <td className="px-4 py-3">
                                <button
                                  onClick={() => handleDeleteVariant(variant.id)}
                                  className="text-gray-400 hover:text-red-600"
                                >
                                  <Icon name="Trash2" size={16} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}
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

              {/* Supplier Price - Only for Standard Products */}
              {productType === "standard" && (
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
                      value={supplierPrice}
                      onChange={(e) => handleSupplierPriceChange(e.target.value)}
                      className="pl-12"
                    />
                  </div>
                </div>
              )}
            </div>
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
                        <div className="flex items-center gap-1">
                          Markup
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button className="inline-flex items-center justify-center">
                                <Icon name="Info" size={14} className="text-gray-400" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">
                                Markup is the percentage added to the supplier price to determine the retail price.
                                Formula: Retail Price = Supplier Price × (1 + Markup %)
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-900">
                        <div className="flex items-center gap-1">
                          Margin
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button className="inline-flex items-center justify-center">
                                <Icon name="Info" size={14} className="text-gray-400" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">
                                Margin is the percentage of profit relative to the retail price.
                                Formula: Margin % = ((Retail Price - Supplier Price) / Retail Price) × 100
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
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
                        GH₵{parseFloat(supplierPrice || "0").toFixed(2)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            value={markup}
                            onChange={(e) => handleMarkupChange(e.target.value)}
                            className="h-8 text-sm w-24"
                            step="0.01"
                          />
                          <span className="text-sm text-gray-500">%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            value={margin}
                            onChange={(e) => handleMarginChange(e.target.value)}
                            className="h-8 text-sm w-24"
                            step="0.01"
                            max="99.99"
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
                            value={retailPrice}
                            onChange={(e) => handleRetailPriceChange(e.target.value)}
                            className="h-8 text-sm pl-10 border-2 border-violet-500 focus:ring-violet-500"
                            step="0.01"
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

      {/* Add Brand Modal */}
      <Dialog open={isAddBrandModalOpen} onOpenChange={(open) => !open && handleCloseBrandModal()}>
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
                value={pendingBrandName}
                onChange={(e) => setPendingBrandName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleConfirmAddBrand();
                  }
                }}
                className="w-full"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={handleCloseBrandModal}
              className="px-6"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmAddBrand}
              className="bg-violet-600 hover:bg-violet-700 text-white px-6"
            >
              Add brand
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Category Modal */}
      <Dialog open={isAddCategoryModalOpen} onOpenChange={(open) => !open && handleCloseCategoryModal()}>
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
                value={pendingCategoryName}
                onChange={(e) => setPendingCategoryName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleConfirmAddCategory();
                  }
                }}
                className="w-full"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={handleCloseCategoryModal}
              className="px-6"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmAddCategory}
              className="bg-violet-600 hover:bg-violet-700 text-white px-6"
            >
              Add category
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Attribute Modal */}
      <Dialog open={isAddAttributeModalOpen} onOpenChange={(open) => !open && handleCloseAttributeModal()}>
        <DialogContent className="sm:max-w-[600px] bg-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Add attribute</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Attribute name
              </label>
              <Input
                placeholder="Enter an attribute name (e.g. Weight, Flavor)"
                value={pendingAttributeName}
                onChange={(e) => setPendingAttributeName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleConfirmAddAttributeType();
                  }
                }}
                className="w-full"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={handleCloseAttributeModal}
              className="px-6"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmAddAttributeType}
              className="bg-violet-600 hover:bg-violet-700 text-white px-6"
            >
              Add attribute
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
    </TooltipProvider>
  );
}
