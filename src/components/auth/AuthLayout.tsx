import { ReactNode } from "react";
import { Logo } from "../shared/Logo";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
  footer?: ReactNode;
}

export const AuthLayout = ({
  children,
  title,
  subtitle,
  footer,
}: AuthLayoutProps) => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-[400px] bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
        <div className="flex justify-center mb-8">
          <Logo />
        </div>
        <div className="text-center mb-8">
          <h1 className="text-xl font-semibold tracking-tight text-slate-900 mb-2">
            {title}
          </h1>
          <p className="text-sm text-gray-500">{subtitle}</p>
        </div>
        {children}
        {footer}
      </div>
    </div>
  );
};
