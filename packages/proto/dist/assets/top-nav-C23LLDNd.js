import{a as s,i as n,x as t}from"./lit-element-Cw0ZWwdS.js";class i extends s{static styles=n`
    :host { display: block; }
    .row { margin: 0 0 var(--space-2, .75rem); }
    a { font-weight: 600; }
  `;static properties={home:{type:String}};constructor(){super(),this.home="index.html"}getPrevHref(){try{const e=document.referrer;if(!e)return null;const r=new URL(e);return r.origin!==location.origin?null:r.pathname+r.search+r.hash||r.pathname}catch{return null}}isHomePath(e){return e?e==="/"||e.endsWith("/index.html")?!0:e===`/${this.home}`||e===this.home:!1}render(){const e=this.getPrevHref(),r=this.isHomePath(e);return t`
      <div class="row">
        ${e&&!r?t`<a href="${e}">Back</a> · `:null}
        <a href="${this.home}">Back to Home</a>
      </div>
    `}}customElements.define("top-nav",i);
