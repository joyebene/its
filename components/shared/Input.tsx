import clsx from "clsx";

interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export default function Input({
  label,
  error,
  className,
  ...props
}: InputProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">
        {label}
      </label>

      <input
        {...props}
        className={clsx(
          "h-12 w-full rounded-xl",
          "border border-gray-200",
          "bg-gray-50",
          "px-4",
          "outline-none",
          "transition",
          "focus:border-[#3658D4]",
          "focus:bg-white",
          className
        )}
      />

      {error && (
        <p className="text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}