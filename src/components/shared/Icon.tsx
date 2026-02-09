import * as LucideIcons from "lucide-react";
import { LucideIcon } from "lucide-react";

interface IconProps {
  name: keyof typeof LucideIcons;
  className?: string;
  size?: number;
}

export const Icon = ({ name, className = "", size = 18 }: IconProps) => {
  const IconComponent = LucideIcons[name] as LucideIcon;

  if (!IconComponent) {
    return null;
  }

  return <IconComponent className={className} size={size} />;
};
