import { Icon } from "./Icon";

interface Breadcrumb {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  breadcrumbs?: Breadcrumb[];
  title: string;
  description?: string;
}

export function PageHeader({ breadcrumbs, title, description }: PageHeaderProps) {
  return (
    <div className="flex-none px-8 pt-8 pb-0">
      {breadcrumbs && breadcrumbs.length > 0 && (
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
          {breadcrumbs.map((crumb, index) => (
            <div key={index} className="flex items-center gap-2">
              {index > 0 && <Icon name="ChevronRight" size={12} />}
              <span
                className={
                  index === breadcrumbs.length - 1
                    ? "text-gray-700 font-medium"
                    : ""
                }
              >
                {crumb.label}
              </span>
            </div>
          ))}
        </div>
      )}
      <h1 className="text-2xl font-semibold text-slate-900 mb-1">{title}</h1>
      {description && (
        <p className="text-sm text-gray-500 mb-6">{description}</p>
      )}
    </div>
  );
}
