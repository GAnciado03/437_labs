import{a as l,i as s,x as a}from"./lit-element-Cw0ZWwdS.js";class c extends l{static styles=s`
    :host { display: block; }
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
      grid-template-columns: var(--_grid, 1fr);
      gap: var(--space-3, 1rem);
      align-items: center;
    }
    .card.clickable { cursor: pointer; }
    :host([selected]) .card {
      border-color: var(--_accent);
      box-shadow: 0 0 0 2px color-mix(in srgb, var(--_accent) 35%, transparent);
    }
    :host([selected]) .value { color: var(--_accent); }

    .icon {
      width: 40px; height: 40px; border-radius: 10px;
      background: color-mix(in srgb, var(--_accent) 10%, transparent);
      color: var(--_accent);
      display: grid; place-items: center;
    }
    .material-symbols-rounded {
      font-family: 'Material Symbols Rounded';
      font-variation-settings: 'FILL' 0, 'wght' 600, 'GRAD' 0, 'opsz' 24;
      line-height: 1; font-size: 24px;
    }
    .meta { display: grid; gap: 2px; }
    .label { color: var(--color-muted, #666); font-size: 0.9rem; }
    .value { color: var(--color-heading, #111); font-weight: 800;
      font-size: clamp(1.25rem, 1rem + 1vw, 1.75rem); letter-spacing: .2px; }
    .unit { color: var(--color-muted, #666); font-weight: 600; font-size: .95rem; }
    .extra { color: var(--color-muted, #666); font-size: .9rem; }
  `;static properties={label:{type:String,reflect:!0},value:{type:String,reflect:!0},unit:{type:String,reflect:!0},icon:{type:String,reflect:!0},accent:{type:String,reflect:!0},clickable:{type:Boolean,reflect:!0},selected:{type:Boolean,reflect:!0},variant:{type:String,reflect:!0}};constructor(){super(),this.label="",this.value="",this.unit=null,this.icon=null,this.accent=null,this.clickable=!1,this.selected=!1,this.variant="default"}onActivate(){this.dispatchEvent(new CustomEvent("stat-card:activate",{bubbles:!0,composed:!0,detail:{label:this.label,value:this.value}}))}onKeyDown(e){const t=e.key||e.code;(t==="Enter"||t===" "||t==="Spacebar")&&(e.preventDefault(),this.onActivate())}render(){const e=!!this.icon,t=e?"40px 1fr":"1fr",i=this.accent||"var(--color-accent)",r=["card"];return this.clickable&&r.push("clickable"),a`
      <style>
        :host{ --_accent: ${i}; --_grid: ${t}; }
      </style>
      <article class=${r.join(" ")} role=${this.clickable?"button":"group"}
               aria-label=${this.label} ?tabindex=${this.clickable}
               aria-pressed=${this.clickable?String(this.selected):null}
               @click=${this.clickable?this.onActivate:void 0}
               @keydown=${this.clickable?this.onKeyDown:void 0}>
        ${e?a`<div class="icon" aria-hidden="true"><span class="material-symbols-rounded">${this.icon}</span></div>`:null}
        <div class="meta">
          <div class="label">${this.label}</div>
          <div class="value">${this.value}${this.unit?a` <span class="unit">${this.unit}</span>`:null}</div>
          <slot></slot>
          <slot name="footer" class="extra"></slot>
        </div>
      </article>
    `}}customElements.define("stat-card",c);export{c as StatCard};
