class StatCard extends HTMLElement {
  static get observedAttributes() {
    return ["label", "value", "unit", "icon", "accent", "clickable", "variant"];
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

  get clickable() {
    return this.hasAttribute("clickable");
  }
  set clickable(val) {
    if (val) this.setAttribute("clickable", "");
    else this.removeAttribute("clickable");
  }

  get variant() {
    return this.getAttribute("variant") || "default";
  }
  set variant(val) {
    if (!val || val === "default") this.removeAttribute("variant");
    else this.setAttribute("variant", val);
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.onClick = this.onClick.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
  }

  connectedCallback() { this.render(); }

  attributeChangedCallback() { this.render(); }

  render() {
    const label = this.label;
    const value = this.value;
    const unit = this.unit;
    const icon = this.icon;
    const accent = this.accent || "var(--color-accent)";
    const clickable = this.clickable;

    const hasIcon = Boolean(icon);

    const style = `
      :host {
        display: block;
      }
      :host([variant="compact"]) .card { padding: var(--space-2, .75rem); }
      :host([variant="compact"]) .value { font-size: clamp(1.1rem, .9rem + .6vw, 1.35rem); }
      :host([variant="compact"]) .icon { width: 34px; height: 34px; }
      .card {
        background: var(--color-surface, #fff);
        border: 1px solid var(--color-border, #e5e7eb);
        border-radius: var(--radius-lg, 14px);
        padding: var(--space-3, 1rem);
        min-height: 120px;
        box-shadow: var(--shadow-sm, 0 1px 2px rgba(0,0,0,.08));
        display: grid;
        grid-template-columns: ${hasIcon ? "40px 1fr" : "1fr"};
        gap: var(--space-3, 1rem);
        align-items: center;
      }
      .card.clickable { cursor: pointer; }
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
      .extra { color: var(--color-muted, #666); font-size: .9rem; }
    `;

    const iconEl = hasIcon
      ? `<div class="icon" aria-hidden="true"><span class="material-symbols-rounded">${icon}</span></div>`
      : "";

    const unitEl = unit ? ` <span class="unit">${unit}</span>` : "";

    this.shadowRoot.innerHTML = `
      <style>${style}</style>
      <article class="card${clickable ? " clickable" : ""}" role="${clickable ? "button" : "group"}" aria-label="${label}" ${clickable ? "tabindex=\"0\"" : ""}>
        ${iconEl}
        <div class="meta">
          <div class="label">${label}</div>
          <div class="value">${value}${unitEl}</div>
          <slot></slot>
          <slot name="footer" class="extra"></slot>
        </div>
      </article>
    `;

    this.bindInteractions();
  }

  bindInteractions() {
    if (!this.shadowRoot) return;
    if (this._cleanup) this._cleanup();
    const root = this.shadowRoot.querySelector('.card');
    if (!root) return;
    if (this.clickable) {
      root.addEventListener('click', this.onClick);
      root.addEventListener('keydown', this.onKeyDown);
      this._cleanup = () => {
        root.removeEventListener('click', this.onClick);
        root.removeEventListener('keydown', this.onKeyDown);
        this._cleanup = null;
      };
    } else {
      this._cleanup = null;
    }
  }

  disconnectedCallback() {
    if (this._cleanup) this._cleanup();
  }

  onClick() {
    this.dispatchEvent(new CustomEvent('stat-card:activate', {
      bubbles: true,
      composed: true,
      detail: { label: this.label, value: this.value }
    }));
  }

  onKeyDown(e) {
    const code = e.key || e.code;
    if (code === 'Enter' || code === ' ' || code === 'Spacebar') {
      e.preventDefault();
      this.onClick();
    }
  }
}

customElements.define("stat-card", StatCard);
