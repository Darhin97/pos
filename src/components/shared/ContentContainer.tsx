import { ReactNode } from "react";

interface ContentContainerProps {
  children: ReactNode;
  className?: string;
}

export function ContentContainer({ children, className = "" }: ContentContainerProps) {
  return (
    <div className={`w-4/5 mx-auto ${className}`}>
      {children}
    </div>
  );
}
