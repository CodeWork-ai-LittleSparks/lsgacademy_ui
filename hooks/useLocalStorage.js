import { useEffect, useState } from "react";
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(initialValue);
  useEffect(() => { const v = localStorage.getItem(key); if (v != null) setValue(JSON.parse(v)); }, [key]);
  useEffect(() => { localStorage.setItem(key, JSON.stringify(value)); }, [key, value]);
  return [value, setValue];
}
