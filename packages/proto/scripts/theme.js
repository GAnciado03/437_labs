const STORAGE_KEY = "theme"; // 'dark' | 'light'
const trackedButtons = new WeakSet();

function syncButton(btn) {
  const isDark = document.body.classList.contains("dark");
  btn.setAttribute("aria-pressed", String(isDark));
  const on = btn.getAttribute("data-label-on") || "Dark: On";
  const off = btn.getAttribute("data-label-off") || "Dark: Off";
  btn.textContent = isDark ? on : off;
}

function updateButtonState(target) {
  if (target) return syncButton(target);
  document.querySelectorAll("[data-theme-button]").forEach(syncButton);
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

function trackButton(btn) {
  if (trackedButtons.has(btn)) {
    updateButtonState(btn);
    return;
  }
  trackedButtons.add(btn);
  updateButtonState(btn);
}

function bindButtons(root = document) {
  root.querySelectorAll("[data-theme-button]").forEach(trackButton);
}

function observeButtons() {
  const observer = new MutationObserver((records) => {
    records.forEach(({ addedNodes }) => {
      addedNodes.forEach((node) => {
        if (!(node instanceof HTMLElement)) return;
        if (node.matches("[data-theme-button]")) trackButton(node);
        if (node.querySelectorAll) bindButtons(node);
      });
    });
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

function handleThemeClick(event) {
  const target = event.target instanceof HTMLElement
    ? event.target.closest("[data-theme-button]")
    : null;
  if (!target) return;
  event.preventDefault();
  document.body.dispatchEvent(new CustomEvent("theme-toggle", { bubbles: true }));
}

applyTheme(getInitialTheme());

const init = () => {
  bindButtons();
  observeButtons();
  document.addEventListener("click", handleThemeClick, { capture: true });
  updateButtonState();
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
