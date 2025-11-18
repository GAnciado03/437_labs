function isAuthenticated() {
  try {
    return Boolean(localStorage.getItem("token"));
  } catch (_) {
    return false;
  }
}

function insertUserButton() {
  const path = (location.pathname || "").toLowerCase();
  if (
    path === "/" ||
    path.endsWith("/index.html") ||
    path.endsWith("index.html") ||
    path.endsWith("/user.html") ||
    path.endsWith("user.html") ||
    path.endsWith("/login.html") ||
    path.endsWith("login.html")
  ) return;
  if (document.querySelector("#floating-user-button")) return;

  const btn = document.createElement("a");
  btn.id = "floating-user-button";
  const authed = isAuthenticated();
  btn.href = authed ? "user.html" : "login.html";
  btn.setAttribute("aria-label", authed ? "User" : "Login");
  btn.className = "mono";
  btn.textContent = authed ? "User" : "Login";

  Object.assign(btn.style, {
    position: "fixed",
    top: "var(--space-3, 1rem)",
    right: "var(--space-3, 1rem)",
    padding: ".35rem .6rem",
    background: "var(--color-surface)",
    color: "var(--color-text)",
    border: "1px solid var(--color-border)",
    borderRadius: "var(--radius-sm, 6px)",
    textDecoration: "none",
    fontWeight: "600",
    boxShadow: "var(--shadow-sm, 0 1px 2px rgba(0,0,0,.08))",
    zIndex: "1000",
  });

  document.body.appendChild(btn);

  // Bypass capture handlers so clicks work even when scripts intercept
  btn.addEventListener("click", (event) => {
    event.stopPropagation();
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", insertUserButton);
} else {
  insertUserButton();
}
