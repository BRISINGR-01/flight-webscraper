import { createContext, useCallback, useContext, useState } from "react";
import type { ReactNode } from "react";
import { Toast, ToastContainer } from "react-bootstrap";

type ToastVariant = "danger" | "success" | "info";

type ToastContextValue = {
  showToast: (message: string, variant?: ToastVariant) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

type ToastItem = { id: number; message: string; variant: ToastVariant };

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, variant: ToastVariant = "danger") => {
      const id = Date.now() + Math.random();
      setToasts((prev) => [...prev, { id, message, variant }]);
    },
    [],
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastContainer position="top-end" className="p-3">
        {toasts.map((t) => (
          <Toast
            key={t.id}
            bg={t.variant}
            className="text-white"
            onClose={() => dismiss(t.id)}
            delay={5000}
            autohide
          >
            <Toast.Body>{t.message}</Toast.Body>
          </Toast>
        ))}
      </ToastContainer>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a ToastProvider");
  return ctx;
}
