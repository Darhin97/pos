import { Icon } from "../shared/Icon";

interface PageHeaderProps {
  title: string;
  subtitle: string;
  breadcrumb: string;
}

export const PageHeader = ({ title, subtitle, breadcrumb }: PageHeaderProps) => {
  return (
    <div className="flex-none p-6 pb-0">
      <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
        <span>Main Menu</span>
        <Icon name="ChevronRight" size={12} />
        <span className="text-slate-900 font-medium">{breadcrumb}</span>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 mb-1">
          {title}
        </h1>
        <p className="text-gray-500 text-sm">{subtitle}</p>
      </div>

      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 mb-5">
        <h2 className="text-base font-medium text-slate-900">List Product</h2>
        <div className="flex gap-2 flex-1 xl:flex-none">
          <div className="relative flex-1 xl:w-[640px]">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center text-gray-400">
              <Icon name="Search" size={20} />
            </div>
            <input
              type="text"
              placeholder="Search or scan barcode..."
              className="pl-12 pr-12 py-2.5 bg-white border border-gray-200 rounded-lg text-slate-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-full text-base"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300">
              <Icon name="ScanLine" size={20} />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-gray-200">
        <div className="flex flex-wrap gap-2">
          <button className="px-3 py-1.5 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg text-xs font-medium flex items-center gap-1.5">
            <Icon name="Shirt" size={14} /> All
          </button>
          {["Men", "Women", "Kids", "Accessories"].map((cat) => (
            <button
              key={cat}
              className="px-3 py-1.5 bg-white border border-gray-200 text-gray-600 rounded-lg text-xs font-medium hover:bg-gray-50 flex items-center gap-1.5 transition-colors"
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
