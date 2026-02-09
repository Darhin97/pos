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
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-slate-700 hover:bg-gray-50 transition-colors text-xs font-medium">
            <Icon name="ScanLine" size={16} />
            <span>Scan Barcode</span>
          </button>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center text-gray-400">
              <Icon name="Search" size={16} />
            </div>
            <input
              type="text"
              placeholder="Search..."
              className="pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-slate-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-full sm:w-56 text-xs"
            />
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

        <button className="px-3 py-1.5 bg-white border border-gray-200 text-slate-700 rounded-lg text-xs font-medium flex items-center gap-2 hover:bg-gray-50">
          Newest <Icon name="ChevronDown" size={14} />
        </button>
      </div>
    </div>
  );
};
