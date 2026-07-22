"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

type ToastItem = { id: number; text: string };

const ToastCtx = createContext<(text: string) => void>(() => undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const push = useCallback((text: string) => {
    const id = Date.now();
    setItems((prev) => [...prev, { id, text }]);
    window.setTimeout(() => {
      setItems((prev) => prev.filter((t) => t.id !== id));
    }, 2800);
  }, []);

  const value = useMemo(() => push, [push]);

  return (
    <ToastCtx.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed bottom-20 right-4 z-[120] flex flex-col gap-2 lg:bottom-6">
        {items.map((t) => (
          <div
            key={t.id}
            className="pointer-events-auto rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-sm shadow-xl"
          >
            {t.text}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

export function useToast() {
  return useContext(ToastCtx);
}
