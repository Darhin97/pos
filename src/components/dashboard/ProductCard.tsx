import { Icon } from "../shared/Icon";
import { Product } from "@/lib/types";

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow group flex flex-col">
      <div className="relative bg-gray-100 rounded-lg h-44 mb-3 overflow-hidden flex items-center justify-center shrink-0">
        <span className="absolute top-2 left-2 px-1.5 py-0.5 bg-white/90 backdrop-blur text-[10px] font-semibold uppercase tracking-wide text-gray-600 rounded">
          {product.category}
        </span>
        <img
          src={product.image}
          className={`h-full object-contain mix-blend-multiply ${
            product.isGrayscale ? "opacity-80 grayscale" : ""
          }`}
          alt={product.name}
        />
      </div>
      <h3 className="font-medium text-slate-900 mb-1 truncate text-sm">
        {product.name}
      </h3>

      <div className="mb-2">
        <p className="text-[10px] text-gray-400 mb-1.5 uppercase font-medium">
          Size
        </p>
        <div className="flex flex-wrap gap-1.5">
          {product.sizes.map((size, i) => (
            <button
              key={i}
              className={`h-6 min-w-[24px] px-1 flex items-center justify-center border rounded text-[10px] font-medium transition-colors ${
                i === 1
                  ? "border-blue-500 text-blue-600 bg-blue-50"
                  : "border-gray-200 hover:border-blue-500 hover:text-blue-600"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-2">
        <p className="text-[10px] text-gray-400 mb-1.5 uppercase font-medium">
          Color
        </p>
        <div className="flex gap-1.5">
          {product.colors.map((colorClass, i) => (
            <button
              key={i}
              className={`w-4 h-4 rounded-full ${colorClass} ring-1 ring-inset ring-black/10`}
            ></button>
          ))}
        </div>
      </div>

      <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between">
        <div>
          <span className="block text-base font-semibold text-slate-900">
            ${product.price}
          </span>
          <span className="text-[10px] text-gray-400">Select type</span>
        </div>
        <button className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all">
          <Icon name="ShoppingCart" size={18} />
        </button>
      </div>
    </div>
  );
};
