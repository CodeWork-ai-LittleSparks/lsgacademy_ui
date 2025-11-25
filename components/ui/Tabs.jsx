"use client";
import { useState, createContext, useContext } from "react";

const TabsContext = createContext(null);

export function Tabs({ value, onValueChange, children, className = "" }) {
  const [internal, setInternal] = useState(value || "");
  const current = value ?? internal;
  const setValue = (v) => {
    if (onValueChange) onValueChange(v);
    else setInternal(v);
  };
  return (
    <TabsContext.Provider value={{ current, setValue }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({ children, className = "" }) {
  return <div className={className}>{children}</div>;
}

export function TabsTrigger({ value, children }) {
  const ctx = useContext(TabsContext);
  const active = ctx?.current === value;
  return (
    <button
      type="button"
      onClick={() => ctx?.setValue?.(value)}
      className={`px-3 py-2 text-sm ${active ? "border-b-2 border-orange-600" : "text-gray-600"}`}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, children }) {
  const ctx = useContext(TabsContext);
  if (ctx?.current !== value) return null;
  return <div>{children}</div>;
}