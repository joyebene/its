interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
}

export default function Select({
  label,
  error,
  children,
  ...props
}: SelectProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">
        {label}
      </label>

      <select
        {...props}
        className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 focus:border-[#3658D4] outline-none"
      >
        {children}
      </select>

      {error && (
        <p className="text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}