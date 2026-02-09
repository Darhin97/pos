import { Icon } from "../shared/Icon";
import * as LucideIcons from "lucide-react";

interface SidebarItemProps {
  icon: keyof typeof LucideIcons;
  label: string;
  active: boolean;
  onClick: () => void;
}

export const SidebarItem = ({
  icon,
  label,
  active,
  onClick,
}: SidebarItemProps) => {
  return (
    <li onClick={onClick} className="cursor-pointer">
      <div
        className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors group ${
          active
            ? "bg-blue-600 text-white shadow-sm"
            : "text-gray-500 hover:bg-gray-50"
        }`}
      >
        <Icon
          name={icon}
          size={18}
          className={`${active ? "" : "group-hover:text-gray-700"}`}
        />
        <span className="font-medium text-sm">{label}</span>
      </div>
    </li>
  );
};
