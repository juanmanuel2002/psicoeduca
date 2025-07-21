export function Button({ children, className = "", variant = "default", ...props }) {
  const base = "px-4 py-2 rounded-lg font-medium transition-all";
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-blue-600 text-blue-600 hover:bg-blue-50",
    ghost: "text-blue-600 hover:underline",
  };

  return (
    <button className={`${base} ${variants[variant] || ""} ${className}`} {...props}>
      {children}
    </button>
  );
}
