export default function Button({ children, className = "", variant = "secondary", size = "md", disabled = false, ...props }) {
  const base = "inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 focus:outline-none focus:ring-4 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100";
  
  const sizes = {
    sm: "px-3 py-2 text-xs rounded-lg",
    md: "px-4 py-2.5 text-sm rounded-xl",
    lg: "px-6 py-3 text-base rounded-xl",
  };
  
  const variants = {
    primary: "bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white shadow-md hover:shadow-lg hover:scale-105 focus:ring-amber-200",
    secondary: "bg-gray-100 text-gray-800 hover:bg-gray-200 border-2 border-gray-200 hover:border-gray-300 focus:ring-gray-200",
    outline: "border-2 border-gray-300 bg-white text-gray-800 hover:bg-gray-50 hover:border-gray-400 shadow-sm hover:shadow-md focus:ring-gray-200",
    ghost: "bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-200",
    danger: "bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white shadow-md hover:shadow-lg hover:scale-105 focus:ring-red-200",
    success: "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-md hover:shadow-lg hover:scale-105 focus:ring-green-200",
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
