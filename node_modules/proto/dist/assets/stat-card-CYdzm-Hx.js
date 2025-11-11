class u extends HTMLElement{static get observedAttributes(){return["label","value","unit","icon","accent","clickable","variant"]}get label(){return this.getAttribute("label")||""}set label(t){this.setAttribute("label",t??"")}get value(){return this.getAttribute("value")||""}set value(t){this.setAttribute("value",t??"")}get unit(){return this.getAttribute("unit")||""}set unit(t){t==null||t===""?this.removeAttribute("unit"):this.setAttribute("unit",t)}get icon(){return this.getAttribute("icon")||""}set icon(t){t==null||t===""?this.removeAttribute("icon"):this.setAttribute("icon",t)}get accent(){return this.getAttribute("accent")||""}set accent(t){t==null||t===""?this.removeAttribute("accent"):this.setAttribute("accent",t)}get clickable(){return this.hasAttribute("clickable")}set clickable(t){t?this.setAttribute("clickable",""):this.removeAttribute("clickable")}get variant(){return this.getAttribute("variant")||"default"}set variant(t){!t||t==="default"?this.removeAttribute("variant"):this.setAttribute("variant",t)}constructor(){super(),this.attachShadow({mode:"open"}),this.onClick=this.onClick.bind(this),this.onKeyDown=this.onKeyDown.bind(this)}connectedCallback(){this.render()}attributeChangedCallback(){this.render()}render(){const t=this.label,e=this.value,a=this.unit,s=this.icon,r=this.accent||"var(--color-accent)",i=this.clickable,n=!!s,c=`
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
        grid-template-columns: ${n?"40px 1fr":"1fr"};
        gap: var(--space-3, 1rem);
        align-items: center;
      }
      .card.clickable { cursor: pointer; }
      .icon {
        width: 40px;
        height: 40px;
        border-radius: 10px;
        background: ${r}10;
        color: ${r};
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
    `,o=n?`<div class="icon" aria-hidden="true"><span class="material-symbols-rounded">${s}</span></div>`:"",l=a?` <span class="unit">${a}</span>`:"";this.shadowRoot.innerHTML=`
      <style>${c}</style>
      <article class="card${i?" clickable":""}" role="${i?"button":"group"}" aria-label="${t}" ${i?'tabindex="0"':""}>
        ${o}
        <div class="meta">
          <div class="label">${t}</div>
          <div class="value">${e}${l}</div>
          <slot></slot>
          <slot name="footer" class="extra"></slot>
        </div>
      </article>
    `,this.bindInteractions()}bindInteractions(){if(!this.shadowRoot)return;this._cleanup&&this._cleanup();const t=this.shadowRoot.querySelector(".card");t&&(this.clickable?(t.addEventListener("click",this.onClick),t.addEventListener("keydown",this.onKeyDown),this._cleanup=()=>{t.removeEventListener("click",this.onClick),t.removeEventListener("keydown",this.onKeyDown),this._cleanup=null}):this._cleanup=null)}disconnectedCallback(){this._cleanup&&this._cleanup()}onClick(){this.dispatchEvent(new CustomEvent("stat-card:activate",{bubbles:!0,composed:!0,detail:{label:this.label,value:this.value}}))}onKeyDown(t){const e=t.key||t.code;(e==="Enter"||e===" "||e==="Spacebar")&&(t.preventDefault(),this.onClick())}}customElements.define("stat-card",u);
