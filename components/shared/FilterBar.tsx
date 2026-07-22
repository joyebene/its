interface FilterBarProps {
  children: React.ReactNode;
}

export default function FilterBar({
  children,
}: FilterBarProps) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 md:flex-row md:items-center md:justify-between">
      {children}
    </div>
  );
}