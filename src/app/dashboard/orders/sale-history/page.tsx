import { Icon } from "@/components/shared/Icon";

export default function SaleHistoryPage() {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-none p-6 pb-0">
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
          <span>Orders</span>
          <Icon name="ChevronRight" size={12} />
          <span className="text-slate-900 font-medium">Sale History</span>
        </div>
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 mb-1">
            Sale History
          </h1>
          <p className="text-gray-500 text-sm">
            View and search past transactions
          </p>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
        Sale history coming soon.
      </div>
    </div>
  );
}
