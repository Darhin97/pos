import { Icon } from "./Icon";

export const Logo = () => {
  return (
    <div className="flex items-center gap-3">
      <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-sm shadow-blue-600/20">
        <Icon name="Command" size={16} />
      </div>
      <span className="text-lg font-semibold tracking-tight text-slate-900">
        Changx
      </span>
    </div>
  );
};
