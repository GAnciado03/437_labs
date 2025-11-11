import{i as c,n as f,a as m,x as h,t as u}from"./state-BhiRui7X.js";var v=Object.defineProperty,p=Object.getOwnPropertyDescriptor,l=(e,r,o,n)=>{for(var t=n>1?void 0:n?p(r,o):r,i=e.length-1,a;i>=0;i--)(a=e[i])&&(t=(n?a(r,o,t):a(t))||t);return n&&t&&v(r,o,t),t};let s=class extends m{constructor(){super(...arguments),this.home="index.html"}getPrevHref(){try{const e=document.referrer;if(!e)return null;const r=new URL(e);return r.origin!==location.origin?null:r.pathname+r.search+r.hash||r.pathname}catch{return null}}isHomePath(e){return e?e==="/"||e.endsWith("/index.html")?!0:e===`/${this.home}`||e===this.home:!1}render(){const e=this.getPrevHref(),r=this.isHomePath(e);return h`
      <div class="row">
        ${e&&!r?h`<a href="${e}">Back</a> · `:null}
        <a href="${this.home}">Back to Home</a>
      </div>
    `}};s.styles=c`
    :host { display: block; }
    .row { margin: 0 0 var(--space-2, .75rem); }
    a { font-weight: 600; }
  `;l([f({type:String})],s.prototype,"home",2);s=l([u("top-nav")],s);
