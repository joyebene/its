import clsx from "clsx";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "success";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}

export default function Button({
  loading,
  children,
  className,
  variant = "primary",
  size = "md",
  fullWidth = true,
  ...props
}: ButtonProps) {
  // Base styles
  const baseStyles =
    "inline-flex items-center justify-center font-semibold transition-all duration-200 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed";

  // Size variants
  const sizeStyles = {
    sm: "h-9 px-4 text-sm gap-1.5",
    md: "h-12 px-6 text-base gap-2",
    lg: "h-14 px-8 text-lg gap-2.5",
  };

  // Color variants
  const variantStyles = {
    primary:
      "bg-gradient-to-r from-[#3658D4] to-[#6E5EF7] text-white hover:scale-[1.02] hover:shadow-xl disabled:opacity-50",
    secondary:
      "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400 hover:text-gray-900 disabled:opacity-50 disabled:hover:bg-white",
    outline:
      "border-2 border-[#3658D4] text-[#3658D4] hover:bg-blue-50 active:bg-blue-100 disabled:opacity-50",
    ghost:
      "text-gray-600 hover:bg-gray-100 active:bg-gray-200 disabled:opacity-50",
    danger:
      "bg-red-500 text-white hover:bg-red-600 active:bg-red-700 disabled:opacity-50",
    success:
      "bg-green-500 text-white hover:bg-green-600 active:bg-green-700 disabled:opacity-50",
  };

  // Width styles
  const widthStyles = fullWidth ? "w-full" : "w-auto";

  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className={clsx(
        baseStyles,
        sizeStyles[size],
        variantStyles[variant],
        widthStyles,
        className
      )}
    >
      {loading ? (
        <>
          <svg
            className="animate-spin h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>Please wait...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}