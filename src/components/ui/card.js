export function Card({ children, className = "" }) {
  return <div className={`bg-white rounded-2xl border ${className}`}>{children}</div>;
}

export function CardHeader({ children }) {
  return <div className="p-4 border-b font-semibold text-lg">{children}</div>;
}

export function CardTitle({ children }) {
  return <h3 className="text-xl font-bold">{children}</h3>;
}

export function CardContent({ children }) {
  return <div className="p-4 text-sm text-gray-700">{children}</div>;
}
