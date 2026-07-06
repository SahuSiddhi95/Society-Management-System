// Zero-dependency toast — works in any React app without extra packages.
// Usage: toast.success("Done!") | toast.error("Oops") | toast.info("Note")

const DURATION = 3500;

function show(message, type) {
  let container = document.getElementById("_toast_root");
  if (!container) {
    container = document.createElement("div");
    container.id = "_toast_root";
    Object.assign(container.style, {
      position: "fixed",
      top: "1.25rem",
      right: "1.25rem",
      zIndex: "9999",
      display: "flex",
      flexDirection: "column",
      gap: "0.5rem",
      pointerEvents: "none",
    });
    document.body.appendChild(container);
  }

  if (!document.getElementById("_toast_styles")) {
    const style = document.createElement("style");
    style.id = "_toast_styles";
    style.textContent = `
      @keyframes _tIn  { from { opacity:0; transform:translateX(64px); } to { opacity:1; transform:translateX(0); } }
      @keyframes _tOut { from { opacity:1; transform:translateX(0); }    to { opacity:0; transform:translateX(64px); } }
    `;
    document.head.appendChild(style);
  }

  const bg = { success: "#16a34a", error: "#dc2626", info: "#2563eb", warning: "#d97706" }[type] || "#16a34a";
  const icons = { success: "✓", error: "✕", info: "ℹ", warning: "⚠" };

  const el = document.createElement("div");
  Object.assign(el.style, {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.7rem 1rem",
    background: bg,
    color: "#fff",
    borderRadius: "0.5rem",
    fontSize: "0.875rem",
    fontFamily: "inherit",
    minWidth: "220px",
    maxWidth: "360px",
    pointerEvents: "all",
    cursor: "pointer",
    animation: "_tIn 0.2s ease",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
  });
  el.innerHTML = `<span style="font-weight:700;flex-shrink:0">${icons[type] || "✓"}</span><span>${message}</span>`;

  const dismiss = () => {
    clearTimeout(timer);
    el.style.animation = "_tOut 0.2s ease forwards";
    el.addEventListener("animationend", () => el.remove(), { once: true });
  };

  el.addEventListener("click", dismiss);
  container.appendChild(el);
  const timer = setTimeout(dismiss, DURATION);
}

const toast = {
  success: (msg) => show(msg, "success"),
  error:   (msg) => show(msg, "error"),
  info:    (msg) => show(msg, "info"),
  warning: (msg) => show(msg, "warning"),
};

export default toast;