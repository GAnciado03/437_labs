const STORAGE_KEY = "theme"; // 'dark' | 'light'

function updateButtonState() {
  const isDark = document.body.classList.contains("dark");
  document.querySelectorAll("[data-theme-button]").forEach((btn) => {
    btn.setAttribute("aria-pressed", String(isDark));
    const on = btn.getAttribute("data-label-on") || "Dark: On";
    const off = btn.getAttribute("data-label-off") || "Dark: Off";
    btn.textContent = isDark ? on : off;
  });
}

function applyTheme(theme) {
  document.body.classList.toggle("dark", theme === "dark");
  updateButtonState();
}

function getInitialTheme() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "dark" || stored === "light") return stored;
  const prefersDark =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;
  return prefersDark ? "dark" : "light";
}

function setTheme(theme) {
  localStorage.setItem(STORAGE_KEY, theme);
  applyTheme(theme);
}

document.body.addEventListener("theme-toggle", () => {
  const next = document.body.classList.contains("dark") ? "light" : "dark";
  setTheme(next);
});

function bindButtons() {
  document.querySelectorAll("[data-theme-button]").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.body.dispatchEvent(
        new CustomEvent("theme-toggle", { bubbles: true })
      );
    });
  });
}

applyTheme(getInitialTheme());

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    bindButtons();
    updateButtonState();
  });
} else {
  bindButtons();
  updateButtonState();
}
