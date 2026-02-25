"use client";

import * as React from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Icon } from "@/components/shared/Icon";

interface SearchableSelectProps {
  options: { value: string; label: string }[];
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  addNewLabel?: string; // e.g., "brand", "category"
  onAddNew?: (value: string) => void;
  className?: string;
}

export function SearchableSelect({
  options,
  value,
  onValueChange,
  placeholder = "Select an option",
  searchPlaceholder = "Search...",
  emptyMessage = "No results found.",
  addNewLabel = "item",
  onAddNew,
  className,
}: SearchableSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  const selectedOption = options.find((option) => option.value === value);

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const hasNoResults = searchQuery && filteredOptions.length === 0;

  const handleSelect = (optionValue: string) => {
    console.log("Clicked:", optionValue);
    onValueChange?.(optionValue);
    setOpen(false);
    setSearchQuery("");
  };

  const handleAddNew = () => {
    if (onAddNew && searchQuery) {
      onAddNew(searchQuery);
      setSearchQuery("");
      setOpen(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between font-normal text-gray-900 bg-white",
            !value && "text-gray-500",
            className
          )}
        >
          {selectedOption ? selectedOption.label : placeholder}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 bg-white border-gray-200" align="start">
        <div className="flex flex-col bg-white">
          {/* Search Input Section */}
          <div className="p-4 pb-3">
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              {searchPlaceholder}
            </label>
            <Input
              placeholder=""
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 rounded-md border-gray-300 focus-visible:ring-1 focus-visible:ring-violet-600 focus-visible:border-violet-600 focus-visible:ring-offset-0"
              autoFocus
            />
          </div>

          {/* Options List */}
          <div className="max-h-[300px] overflow-y-auto overflow-x-hidden">
            {hasNoResults ? (
              <div className="py-6 px-4 border-t border-gray-100">
                <p className="text-center text-sm text-gray-900 mb-6">
                  {emptyMessage.replace("{query}", `"${searchQuery}"`)}
                </p>
                {onAddNew && (
                  <div className="pt-4 border-t border-gray-100">
                    <button
                      onClick={handleAddNew}
                      className="w-full text-center text-violet-600 hover:text-violet-700 text-sm font-medium flex items-center justify-center gap-1.5"
                    >
                      <Icon name="Plus" size={16} />
                      Add &quot;{searchQuery}&quot; as a new {addNewLabel}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-1">
                {filteredOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleSelect(option.value)}
                    className="relative flex w-full cursor-pointer select-none items-center px-4 py-2.5 text-sm outline-none hover:bg-gray-50 focus:bg-gray-50 text-left"
                  >
                    <Check
                      className={cn(
                        "mr-3 h-4 w-4 text-violet-600",
                        value === option.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <span className="text-slate-900">{option.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
