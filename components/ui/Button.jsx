export default function Button({ children, className = "", variant = "secondary", size = "md", disabled = false, ...props }) {
  const base = "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50";
  const sizes = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-2 text-sm",
    lg: "px-4 py-2 text-sm",
  };
  const variants = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700",
    secondary: "bg-gray-100 text-gray-800 hover:bg-gray-200",
    outline: "border border-gray-300 bg-white text-gray-800 hover:bg-gray-50",
    ghost: "bg-transparent text-gray-700 hover:bg-gray-100",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };
  return (
    <button
      className={`${base} ${sizes[size] || sizes.md} ${variants[variant] || variants.secondary} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
