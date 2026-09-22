import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Pixel Burguer render error:", error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <div
          style={{
            minHeight: "100dvh",
            background: "#080812",
            color: "#e2e8f0",
            padding: "2rem",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          <h1 style={{ fontSize: "1.25rem", marginBottom: "0.75rem" }}>Algo deu errado ao carregar o site</h1>
          <p style={{ color: "#94a3b8", marginBottom: "1rem", fontSize: "0.875rem" }}>
            {this.state.error.message}
          </p>
          <button
            type="button"
            onClick={() => {
              try {
                localStorage.removeItem("pixel_cart");
                localStorage.removeItem("pixel_user");
              } catch {
                /* ignore */
              }
              window.location.reload();
            }}
            style={{
              background: "#ff006e",
              color: "#fff",
              border: "none",
              borderRadius: 4,
              padding: "10px 16px",
              cursor: "pointer",
              marginRight: "0.5rem",
            }}
          >
            Limpar dados e recarregar
          </button>
          <button
            type="button"
            onClick={() => window.location.reload()}
            style={{
              background: "transparent",
              color: "#00f5ff",
              border: "1px solid #00f5ff",
              borderRadius: 4,
              padding: "10px 16px",
              cursor: "pointer",
            }}
          >
            Recarregar
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
