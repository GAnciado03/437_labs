(() => {
  const STORAGE_KEY = "theme"; // 'dark' | 'light'
  const trackedButtons = new WeakSet();

  const ready = (fn) => {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn, { once: true });
    } else {
      fn();
    }
  };

  ready(() => {
    const body = document.body || document.documentElement;
    if (!body) return;

    const syncButton = (btn) => {
      const isDark = body.classList.contains("dark");
      btn.setAttribute("aria-pressed", String(isDark));
      const on = btn.getAttribute("data-label-on") || "Dark: On";
      const off = btn.getAttribute("data-label-off") || "Dark: Off";
      btn.textContent = isDark ? on : off;
    };

    const updateButtonState = (target) => {
      if (target) return syncButton(target);
      document.querySelectorAll("[data-theme-button]").forEach(syncButton);
    };

    const applyTheme = (theme) => {
      body.classList.toggle("dark", theme === "dark");
      updateButtonState();
    };

    const getInitialTheme = () => {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "dark" || stored === "light") return stored;
      const prefersDark =
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches;
      return prefersDark ? "dark" : "light";
    };

    const setTheme = (theme) => {
      localStorage.setItem(STORAGE_KEY, theme);
      applyTheme(theme);
    };

    body.addEventListener("theme-toggle", () => {
      const next = body.classList.contains("dark") ? "light" : "dark";
      setTheme(next);
    });

    const trackButton = (btn) => {
      if (trackedButtons.has(btn)) {
        updateButtonState(btn);
        return;
      }
      trackedButtons.add(btn);
      updateButtonState(btn);
    };

    const bindButtons = (root = document) => {
      root.querySelectorAll("[data-theme-button]").forEach(trackButton);
    };

    const observeButtons = () => {
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
    };

    applyTheme(getInitialTheme());
    bindButtons();
    observeButtons();
    updateButtonState();

    const toggleTheme = (event) => {
      event?.preventDefault();
      body.dispatchEvent(new CustomEvent("theme-toggle", { bubbles: true }));
      return false;
    };

    window.toggleTheme = toggleTheme;
  });
})();
