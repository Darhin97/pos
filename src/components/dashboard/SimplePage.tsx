import { Icon } from "../shared/Icon";

interface SimplePageProps {
  title: string;
}

export const SimplePage = ({ title }: SimplePageProps) => {
  return (
    <div className="flex-1 p-8 flex flex-col items-center justify-center text-gray-400">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <Icon name="Construction" size={32} />
      </div>
      <h2 className="text-xl font-medium text-gray-900">{title}</h2>
      <p className="text-sm">This page is under construction</p>
    </div>
  );
};
