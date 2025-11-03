export default function Card({ children, className = "" }) {
  return <div className={`border rounded p-4 ${className}`}>{children}</div>;
}
