const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/stat-card-BV3ORu62.js","assets/state-mzX8VpgM.js"])))=>i.map(i=>d[i]);
import"./user-button-sjTj3YiV.js";import{i as b,n as g,r as m,a as E,x as f,t as S}from"./state-mzX8VpgM.js";const $="modulepreload",L=function(t){return"/"+t},y={},v=function(e,n,l){let a=Promise.resolve();if(n&&n.length>0){let w=function(s){return Promise.all(s.map(p=>Promise.resolve(p).then(h=>({status:"fulfilled",value:h}),h=>({status:"rejected",reason:h}))))};document.getElementsByTagName("link");const r=document.querySelector("meta[property=csp-nonce]"),i=r?.nonce||r?.getAttribute("nonce");a=w(n.map(s=>{if(s=L(s),s in y)return;y[s]=!0;const p=s.endsWith(".css"),h=p?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${s}"]${h}`))return;const o=document.createElement("link");if(o.rel=p?"stylesheet":$,p||(o.as="script"),o.crossOrigin="",o.href=s,i&&o.setAttribute("nonce",i),document.head.appendChild(o),p)return new Promise((P,_)=>{o.addEventListener("load",P),o.addEventListener("error",()=>_(new Error(`Unable to preload CSS for ${s}`)))})}))}function d(r){const i=new Event("vite:preloadError",{cancelable:!0});if(i.payload=r,window.dispatchEvent(i),!i.defaultPrevented)throw r}return a.then(r=>{for(const i of r||[])i.status==="rejected"&&d(i.reason);return e().catch(d)})};(async()=>{if(!customElements.get("stat-card"))try{await v(()=>import("./stat-card-BV3ORu62.js"),__vite__mapDeps([0,1]))}catch{await v(()=>import("./stat-card-CYdzm-Hx.js"),[])}})();var C=Object.defineProperty,k=Object.getOwnPropertyDescriptor,u=(t,e,n,l)=>{for(var a=l>1?void 0:l?k(e,n):e,d=t.length-1,r;d>=0;d--)(r=t[d])&&(a=(l?r(e,n,a):r(a))||a);return l&&a&&C(e,n,a),a};let c=class extends E{constructor(){super(...arguments),this.src="/data/player-details.json",this.id="",this.loading=!1,this.error=null}connectedCallback(){super.connectedCallback();const t=new URL(location.href).searchParams.get("id")||"";!this.id&&t&&(this.id=t)}willUpdate(t){(t.has("src")||t.has("id"))&&this.fetchData()}async fetchData(){this.loading=!0,this.error=null,this.player=void 0;try{const t=await fetch(this.src);if(!t.ok)throw new Error(`HTTP ${t.status}`);const e=await t.json(),n=(this.id||"").toLowerCase();this.player=e.find(l=>l.id.toLowerCase()===n)||e[0]}catch(t){this.error=String(t)}finally{this.loading=!1}}render(){if(this.loading)return f`<main class="container"><p>Loading…</p></main>`;if(this.error)return f`<main class="container"><p>Error: ${this.error}</p></main>`;if(!this.player)return f`<main class="container"><p>No data.</p></main>`;const t=this.player,e=t.stats||{};return f`
      <main class="container">
        <p style="margin: 0 0 var(--space-2);">
          <a href="player.html?id=${t.id}">View Player</a>
          ·
          <a href="index.html">Back to Home</a>
        </p>
        <h1>Player Stats</h1>
        <p>Player: <a href="player.html?id=${t.id}">${t.name}</a></p>
        <section class="grid" style="margin-top: var(--space-3)">
          <div class="span-4">
            <stat-card label="K/D/A" .value=${e.kda??"—"} icon="insights" accent="#2563eb" clickable>
              <span slot="footer">Last 10 games</span>
            </stat-card>
          </div>
          <div class="span-4">
            <stat-card label="Win Rate" .value=${String(e.winRate??"—")} unit="%" icon="trending_up" accent="#10b981"></stat-card>
          </div>
          <div class="span-4">
            <stat-card label="Matches Played" .value=${String(e.matches??"—")} icon="confirmation_number" accent="#f59e0b"></stat-card>
          </div>
        </section>
      </main>
    `}};c.styles=b`:host{display:block}`;u([g({type:String})],c.prototype,"src",2);u([g({type:String,reflect:!0})],c.prototype,"id",2);u([m()],c.prototype,"player",2);u([m()],c.prototype,"loading",2);u([m()],c.prototype,"error",2);c=u([S("player-stats")],c);
