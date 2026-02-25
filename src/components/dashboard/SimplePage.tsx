import { Icon } from "../shared/Icon";
import { PageHeader } from "../shared/PageHeader";
import { ContentContainer } from "../shared/ContentContainer";

interface SimplePageProps {
  title: string;
  breadcrumbs?: Array<{ label: string; href?: string }>;
  description?: string;
}

export const SimplePage = ({ title, breadcrumbs, description }: SimplePageProps) => {
  return (
    <div className="flex flex-col h-full overflow-auto">
      <PageHeader
        breadcrumbs={breadcrumbs}
        title={title}
        description={description || "This page is under construction"}
      />

      <div className="flex-1 px-8 pb-8 min-h-0">
        <ContentContainer>
          <div className="flex flex-col items-center justify-center text-gray-400 py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Icon name="Construction" size={32} />
            </div>
            <h2 className="text-xl font-medium text-gray-900 mb-2">{title}</h2>
            <p className="text-sm">This page is under construction</p>
          </div>
        </ContentContainer>
      </div>
    </div>
  );
};
