import { useApp } from "../contexts/AppContext";

export default function ToastContainer() {
  const { toasts, removeToast } = useApp();

  return (
    <div className="fixed bottom-6 right-4 z-50 flex flex-col gap-2 items-end pointer-events-none">
      {toasts.map(toast => (
        <div
          key={toast.id}
          onClick={() => removeToast(toast.id)}
          className="animate-slide-in-right pointer-events-auto cursor-pointer max-w-xs"
          style={{
            background: "#0f0f1e",
            border: `1px solid ${toast.type === "error" ? "rgba(255,0,110,0.4)" : toast.type === "info" ? "rgba(168,85,247,0.4)" : "rgba(0,245,255,0.4)"}`,
            boxShadow: `0 0 20px ${toast.type === "error" ? "rgba(255,0,110,0.15)" : toast.type === "info" ? "rgba(168,85,247,0.15)" : "rgba(0,245,255,0.15)"}`,
            borderRadius: "6px",
            padding: "10px 14px",
          }}>
          <p className="text-white text-xs leading-relaxed">{toast.message}</p>
        </div>
      ))}
    </div>
  );
}
