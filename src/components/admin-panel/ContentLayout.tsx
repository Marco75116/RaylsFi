interface ContentLayoutProps {
  children?: React.ReactNode;
}

export function ContentLayout({ children }: ContentLayoutProps) {
  return (
    <div>
      <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
    </div>
  );
}
