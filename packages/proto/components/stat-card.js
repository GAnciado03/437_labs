class StatCard extends HTMLElement {
  static get observedAttributes() {
    return ["label", "value", "unit", "icon", "accent"];
  }

  get label() {
    return this.getAttribute("label") || "";
  }
  set label(val) {
    this.setAttribute("label", val ?? "");
  }

  get value() {
    return this.getAttribute("value") || "";
  }
  set value(val) {
    this.setAttribute("value", val ?? "");
  }

  get unit() {
    return this.getAttribute("unit") || "";
  }
  set unit(val) {
    if (val == null || val === "") this.removeAttribute("unit");
    else this.setAttribute("unit", val);
  }

  get icon() {
    return this.getAttribute("icon") || "";
  }
  set icon(val) {
    if (val == null || val === "") this.removeAttribute("icon");
    else this.setAttribute("icon", val);
  }

  get accent() {
    return this.getAttribute("accent") || "";
  }
  set accent(val) {
    if (val == null || val === "") this.removeAttribute("accent");
    else this.setAttribute("accent", val);
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.#render();
  }

  attributeChangedCallback() {
    this.#render();
  }

  #render() {
    const label = this.label;
    const value = this.value;
    const unit = this.unit;
    const icon = this.icon;
    const accent = this.accent || "var(--color-accent)";

    const hasIcon = Boolean(icon);

    const style = `
      :host {
        display: block;
      }
      .card {
        background: var(--color-surface, #fff);
        border: 1px solid var(--color-border, #e5e7eb);
        border-radius: var(--radius-lg, 14px);
        padding: var(--space-3, 1rem);
        box-shadow: var(--shadow-sm, 0 1px 2px rgba(0,0,0,.08));
        display: grid;
        grid-template-columns: ${hasIcon ? "40px 1fr" : "1fr"};
        gap: var(--space-3, 1rem);
        align-items: center;
      }
      .icon {
        width: 40px;
        height: 40px;
        border-radius: 10px;
        background: ${accent}10;
        color: ${accent};
        display: grid;
        place-items: center;
      }
      .material-symbols-rounded {
        font-family: 'Material Symbols Rounded';
        font-variation-settings: 'FILL' 0, 'wght' 600, 'GRAD' 0, 'opsz' 24;
        line-height: 1;
        font-size: 24px;
      }
      .meta {
        display: grid;
        gap: 2px;
      }
      .label {
        color: var(--color-muted, #666);
        font-size: 0.9rem;
      }
      .value {
        color: var(--color-heading, #111);
        font-weight: 800;
        font-size: clamp(1.25rem, 1rem + 1vw, 1.75rem);
        letter-spacing: 0.2px;
      }
      .unit { color: var(--color-muted, #666); font-weight: 600; font-size: 0.95rem; }
    `;

    const iconEl = hasIcon
      ? `<div class="icon" aria-hidden="true"><span class="material-symbols-rounded">${icon}</span></div>`
      : "";

    const unitEl = unit ? ` <span class="unit">${unit}</span>` : "";

    this.shadowRoot.innerHTML = `
      <style>${style}</style>
      <article class="card" role="group" aria-label="${label}">
        ${iconEl}
        <div class="meta">
          <div class="label">${label}</div>
          <div class="value">${value}${unitEl}</div>
        </div>
      </article>
    `;
  }
}

customElements.define("stat-card", StatCard);

