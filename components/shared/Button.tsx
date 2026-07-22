import clsx from "clsx";

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  variant?: "primary" | "secondary";
}

export default function Button({
  loading,
  children,
  className,
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className={clsx(
        // Base styles
        "h-12 w-full rounded-xl font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",

        // Variant styles
        variant === "primary" && [
          "bg-linear-to-r from-[#3658D4] to-[#6E5EF7] text-white",
          "hover:scale-[1.02] hover:shadow-xl",
          "disabled:opacity-50",
        ],

        variant === "secondary" && [
          "border border-gray-300 bg-white text-gray-700",
          "hover:bg-gray-50 hover:border-gray-400 hover:text-gray-900",
          "disabled:opacity-50 disabled:hover:bg-white",
        ],

        className
      )}
    >
      {loading ? "Please wait..." : children}
    </button>
  );
}