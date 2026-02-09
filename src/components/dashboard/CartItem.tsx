"use client";

import { Icon } from "../shared/Icon";
import { CartItem as CartItemType } from "@/lib/types";
import { useState } from "react";

interface CartItemProps {
  item: CartItemType;
}

export const CartItem = ({ item }: CartItemProps) => {
  const [quantity, setQuantity] = useState(item.qty);

  const handleIncrement = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const total = item.price * quantity;

  return (
    <div className="bg-gray-50 rounded-2xl p-4 flex items-center gap-4 relative">
      {/* Product Image */}
      <div className="w-24 h-24 bg-white rounded-xl flex items-center justify-center shrink-0">
        <img
          src={item.image}
          alt={item.name}
          className="w-20 h-20 object-contain"
        />
      </div>

      {/* Product Details */}
      <div className="flex-1 flex flex-col gap-3">
        {/* Product Name */}
        <h3 className="text-gray-900 font-semibold text-base leading-tight">
          {item.name}
        </h3>

        {/* Size and Color */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>Size {item.size}</span>
          {item.color && (
            <>
              <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
              <span>{item.color}</span>
            </>
          )}
        </div>

        {/* Quantity Controls and Total */}
        <div className="flex items-center justify-between">
          {/* Quantity Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleDecrement}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-300 bg-white hover:bg-gray-50 transition-colors"
            >
              <Icon name="Minus" size={14} />
            </button>
            <span className="text-gray-900 font-medium text-base w-8 text-center">
              {quantity.toString().padStart(2, "0")}
            </span>
            <button
              onClick={handleIncrement}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-green-500 hover:bg-green-600 text-white transition-colors"
            >
              <Icon name="Plus" size={14} />
            </button>
          </div>

          {/* Total Price */}
          <div className="flex items-center gap-2">
            <span className="text-gray-600 text-sm">Total</span>
            <span className="text-gray-900 font-semibold text-lg">
              ${total.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Delete Button */}
      <button className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-red-500 hover:bg-red-600 text-white transition-colors">
        <Icon name="Trash2" size={18} />
      </button>
    </div>
  );
};
