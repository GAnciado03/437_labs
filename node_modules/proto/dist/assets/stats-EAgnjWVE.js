const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/stat-card-CX-kKSr9.js","assets/lit-element-Cw0ZWwdS.js"])))=>i.map(i=>d[i]);
import"./pages-rLHsPmH1.js";/* empty css                   */import"./user-button-DaLNPRlq.js";import{a as g,i as S,x as c}from"./lit-element-Cw0ZWwdS.js";const b="modulepreload",E=function(h){return"/"+h},p={},m=function(t,e,u){let o=Promise.resolve();if(e&&e.length>0){let f=function(a){return Promise.all(a.map(n=>Promise.resolve(n).then(l=>({status:"fulfilled",value:l}),l=>({status:"rejected",reason:l}))))};document.getElementsByTagName("link");const i=document.querySelector("meta[property=csp-nonce]"),r=i?.nonce||i?.getAttribute("nonce");o=f(e.map(a=>{if(a=E(a),a in p)return;p[a]=!0;const n=a.endsWith(".css"),l=n?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${a}"]${l}`))return;const s=document.createElement("link");if(s.rel=n?"stylesheet":b,n||(s.as="script"),s.crossOrigin="",s.href=a,r&&s.setAttribute("nonce",r),document.head.appendChild(s),n)return new Promise((v,y)=>{s.addEventListener("load",v),s.addEventListener("error",()=>y(new Error(`Unable to preload CSS for ${a}`)))})}))}function d(i){const r=new Event("vite:preloadError",{cancelable:!0});if(r.payload=i,window.dispatchEvent(r),!r.defaultPrevented)throw i}return o.then(i=>{for(const r of i||[])r.status==="rejected"&&d(r.reason);return t().catch(d)})};(async()=>{if(!customElements.get("stat-card"))try{await m(()=>import("./stat-card-CX-kKSr9.js"),__vite__mapDeps([0,1]))}catch{await m(()=>import("./stat-card-CYdzm-Hx.js"),[])}})();class w extends g{static styles=S`:host{display:block}`;static properties={src:{type:String},id:{type:String,reflect:!0},player:{state:!0},loading:{state:!0},error:{state:!0},activeStat:{state:!0}};handleStatActivate=t=>{const e=t.detail;e&&(this.activeStat=e)};constructor(){super(),this.src="/data/player-details.json",this.id="",this.player=void 0,this.loading=!1,this.error=null,this.activeStat=null}connectedCallback(){super.connectedCallback();const t=new URL(location.href).searchParams.get("id")||"";!this.id&&t&&(this.id=t),this.addEventListener("stat-card:activate",this.handleStatActivate)}disconnectedCallback(){this.removeEventListener("stat-card:activate",this.handleStatActivate),super.disconnectedCallback()}willUpdate(t){(t.has("src")||t.has("id"))&&this.fetchData()}async fetchData(){this.loading=!0,this.error=null,this.player=void 0;try{const t=await fetch(this.src);if(!t.ok)throw new Error(`HTTP ${t.status}`);const e=await t.json(),u=(this.id||"").toLowerCase(),o=Array.isArray(e)?e.find(d=>(d.id||"").toLowerCase()===u):void 0;this.player=o||(Array.isArray(e)?e[0]:void 0)}catch(t){this.error=String(t)}finally{this.loading=!1}}render(){if(this.loading)return c`<main class="container"><p>Loading…</p></main>`;if(this.error)return c`<main class="container"><p>Error: ${this.error}</p></main>`;if(!this.player)return c`<main class="container"><p>No data.</p></main>`;const t=this.player,e=t.stats||{};return c`
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
            <stat-card label="K/D/A" .value=${e.kda??"—"} icon="insights" accent="#2563eb" clickable
              .selected=${this.activeStat?.label==="K/D/A"}>
              <span slot="footer">Last 10 games</span>
            </stat-card>
          </div>
          <div class="span-4">
            <stat-card label="Win Rate" .value=${String(e.winRate??"—")} unit="%" icon="trending_up" accent="#10b981"
              clickable .selected=${this.activeStat?.label==="Win Rate"}></stat-card>
          </div>
          <div class="span-4">
            <stat-card label="Matches Played" .value=${String(e.matches??"—")} icon="confirmation_number" accent="#f59e0b"
              clickable .selected=${this.activeStat?.label==="Matches Played"}></stat-card>
          </div>
        </section>
        <p class="muted" style="margin-top: var(--space-2)">
          ${this.activeStat?c`Pinned stat: <strong>${this.activeStat.label}</strong> (${this.activeStat.value})`:c`Click any stat card to pin it here.`}
        </p>
      </main>
    `}}customElements.define("player-stats",w);
