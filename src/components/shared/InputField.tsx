import { Icon } from "./Icon";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import * as LucideIcons from "lucide-react";

interface InputFieldProps {
  label: string;
  type?: string;
  placeholder: string;
  icon: keyof typeof LucideIcons;
}

export const InputField = ({
  label,
  type = "text",
  placeholder,
  icon,
}: InputFieldProps) => {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-slate-700">
        {label}
      </Label>
      <div className="relative group">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-blue-600 z-10">
          <Icon name={icon} size={16} />
        </div>
        <Input
          type={type}
          placeholder={placeholder}
          className="pl-9 h-10"
        />
      </div>
    </div>
  );
};
