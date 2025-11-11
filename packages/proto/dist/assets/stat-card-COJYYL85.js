import{a as d,x as p,i as u,n as o,t as v}from"./state-BhiRui7X.js";var h=Object.defineProperty,m=Object.getOwnPropertyDescriptor,r=(a,t,s,i)=>{for(var l=i>1?void 0:i?m(t,s):t,c=a.length-1,n;c>=0;c--)(n=a[c])&&(l=(i?n(t,s,l):n(l))||l);return i&&l&&h(t,s,l),l};let e=class extends d{constructor(){super(...arguments),this.label="",this.value="",this.unit=null,this.icon=null,this.accent=null,this.clickable=!1,this.variant="default"}onActivate(){this.dispatchEvent(new CustomEvent("stat-card:activate",{bubbles:!0,composed:!0,detail:{label:this.label,value:this.value}}))}onKeyDown(a){const t=a.key||a.code;(t==="Enter"||t===" "||t==="Spacebar")&&(a.preventDefault(),this.onActivate())}render(){const a=!!this.icon,t=a?"40px 1fr":"1fr",s=this.accent||"var(--color-accent)",i=["card"];return this.clickable&&i.push("clickable"),p`
      <style>
        :host{ --_accent: ${s}; --_grid: ${t}; }
      </style>
      <article class=${i.join(" ")} role=${this.clickable?"button":"group"}
               aria-label=${this.label} ?tabindex=${this.clickable}
               @click=${this.clickable?this.onActivate:void 0}
               @keydown=${this.clickable?this.onKeyDown:void 0}>
        ${a?p`<div class="icon" aria-hidden="true"><span class="material-symbols-rounded">${this.icon}</span></div>`:null}
        <div class="meta">
          <div class="label">${this.label}</div>
          <div class="value">${this.value}${this.unit?p` <span class="unit">${this.unit}</span>`:null}</div>
          <slot></slot>
          <slot name="footer" class="extra"></slot>
        </div>
      </article>
    `}};e.styles=u`
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
  `;r([o({type:String,reflect:!0})],e.prototype,"label",2);r([o({type:String,reflect:!0})],e.prototype,"value",2);r([o({type:String,reflect:!0})],e.prototype,"unit",2);r([o({type:String,reflect:!0})],e.prototype,"icon",2);r([o({type:String,reflect:!0})],e.prototype,"accent",2);r([o({type:Boolean,reflect:!0})],e.prototype,"clickable",2);r([o({type:String,reflect:!0})],e.prototype,"variant",2);e=r([v("stat-card")],e);export{e as StatCard};
