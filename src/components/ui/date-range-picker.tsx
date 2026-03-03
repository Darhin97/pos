"use client";

import { useState } from "react";
import { Icon } from "@/components/shared/Icon";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { type DateRange } from "react-day-picker";

export interface DateRangePickerValue {
  dateRange?: DateRange;
  fromTime: {
    hour: string;
    minute: string;
    period: string;
  };
  toTime: {
    hour: string;
    minute: string;
    period: string;
  };
}

interface DateRangePickerProps {
  value?: DateRangePickerValue;
  onChange?: (value: DateRangePickerValue) => void;
  placeholder?: string;
  className?: string;
}

export function DateRangePicker({
  value,
  onChange,
  placeholder = "Choose date range...",
  className,
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Internal state
  const [dateRange, setDateRange] = useState<DateRange | undefined>(value?.dateRange);
  const [fromHour, setFromHour] = useState(value?.fromTime.hour || "12");
  const [fromMinute, setFromMinute] = useState(value?.fromTime.minute || "00");
  const [fromPeriod, setFromPeriod] = useState(value?.fromTime.period || "AM");
  const [toHour, setToHour] = useState(value?.toTime.hour || "12");
  const [toMinute, setToMinute] = useState(value?.toTime.minute || "00");
  const [toPeriod, setToPeriod] = useState(value?.toTime.period || "AM");

  const handleApply = () => {
    if (onChange) {
      onChange({
        dateRange,
        fromTime: { hour: fromHour, minute: fromMinute, period: fromPeriod },
        toTime: { hour: toHour, minute: toMinute, period: toPeriod },
      });
    }
    setIsOpen(false);
  };

  const handleClear = () => {
    setDateRange(undefined);
    setFromHour("12");
    setFromMinute("00");
    setFromPeriod("AM");
    setToHour("12");
    setToMinute("00");
    setToPeriod("AM");
    if (onChange) {
      onChange({
        dateRange: undefined,
        fromTime: { hour: "12", minute: "00", period: "AM" },
        toTime: { hour: "12", minute: "00", period: "AM" },
      });
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={`h-10 w-full justify-start px-2.5 font-normal bg-white ${className || ""}`}
        >
          <Icon name="Calendar" size={16} className="mr-2" />
          {dateRange?.from ? (
            dateRange.to ? (
              <>
                {format(dateRange.from, "LLL dd, y")} {fromHour}:{fromMinute} {fromPeriod} -{" "}
                {format(dateRange.to, "LLL dd, y")} {toHour}:{toMinute} {toPeriod}
              </>
            ) : (
              <>
                {format(dateRange.from, "LLL dd, y")} {fromHour}:{fromMinute} {fromPeriod}
              </>
            )
          ) : (
            <span className="text-gray-500">{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-white" align="start">
        {/* Time Selectors */}
        <div className="flex gap-8 p-4 border-b border-gray-200">
          {/* From Time */}
          <div>
            <p className="text-sm font-semibold mb-3">From</p>
            <div className="flex gap-2">
              <Select value={fromHour} onValueChange={setFromHour}>
                <SelectTrigger className="w-16 h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
                    <SelectItem key={h} value={h.toString().padStart(2, "0")}>
                      {h.toString().padStart(2, "0")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={fromMinute} onValueChange={setFromMinute}>
                <SelectTrigger className="w-16 h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-[200px]">
                  {Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, "0")).map((m) => (
                    <SelectItem key={m} value={m}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={fromPeriod} onValueChange={setFromPeriod}>
                <SelectTrigger className="w-16 h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AM">AM</SelectItem>
                  <SelectItem value="PM">PM</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* To Time */}
          <div>
            <p className="text-sm font-semibold mb-3">To</p>
            <div className="flex gap-2">
              <Select value={toHour} onValueChange={setToHour}>
                <SelectTrigger className="w-16 h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
                    <SelectItem key={h} value={h.toString().padStart(2, "0")}>
                      {h.toString().padStart(2, "0")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={toMinute} onValueChange={setToMinute}>
                <SelectTrigger className="w-16 h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-[200px]">
                  {Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, "0")).map((m) => (
                    <SelectItem key={m} value={m}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={toPeriod} onValueChange={setToPeriod}>
                <SelectTrigger className="w-16 h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AM">AM</SelectItem>
                  <SelectItem value="PM">PM</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Calendar */}
        <div className="relative px-6 py-4">
          <Calendar
            mode="range"
            defaultMonth={dateRange?.from}
            selected={dateRange}
            onSelect={setDateRange}
            numberOfMonths={2}
            captionLayout="dropdown"
            fromYear={2020}
            toYear={2030}
            classNames={{
              months: "flex gap-4",
              month: "space-y-4",
              caption: "flex justify-center items-center pt-1 mb-2 relative",
              caption_label: "hidden",
              dropdowns: "flex gap-2",
              dropdown_root: "relative min-w-[120px]",
              dropdown: "appearance-none bg-white border border-gray-300 rounded px-3 py-1.5 text-sm w-full cursor-pointer",
              nav: "absolute inset-x-0 flex justify-between w-full",
              nav_button: "h-9 w-9 bg-transparent p-0 hover:bg-gray-100 rounded-md inline-flex items-center justify-center [&>svg]:w-5 [&>svg]:h-5 [&>svg]:stroke-[2.5]",
              head_cell: "w-10",
              cell: "h-10 w-10 text-center p-0",
              day: "h-10 w-10",
            }}
            modifiers={{
              range_start: dateRange?.from,
              range_end: dateRange?.to,
              range_middle: (day) => {
                if (!dateRange?.from || !dateRange?.to) return false;
                return day > dateRange.from && day < dateRange.to;
              },
            }}
            modifiersClassNames={{
              range_start: "bg-violet-600 text-white hover:bg-violet-600 hover:text-white",
              range_end: "bg-violet-600 text-white hover:bg-violet-600 hover:text-white",
              range_middle: "bg-violet-100 text-violet-900",
            }}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between border-t border-gray-200 p-3">
          <Button variant="outline" onClick={handleClear}>
            Clear dates
          </Button>
          <Button
            onClick={handleApply}
            className="bg-violet-600 hover:bg-violet-700 text-white"
          >
            Apply
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
