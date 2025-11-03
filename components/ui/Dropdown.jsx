export default function Dropdown({ options = [], className = "", ...props }) {
  return (
    <select className={`border rounded px-3 py-2 ${className}`} {...props}>
      {options.map((o) => <option key={String(o?.value ?? o)} value={o?.value ?? o}>{o?.label ?? o}</option>)}
    </select>
  );
}
