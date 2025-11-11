import"./pages-rLHsPmH1.js";import"./user-button-ifhGABLi.js";import{i as b,n as v,r as m,a as P,x as s,t as x}from"./state-BhiRui7X.js";var w=Object.defineProperty,$=Object.getOwnPropertyDescriptor,l=(t,e,c,d)=>{for(var r=d>1?void 0:d?$(e,c):e,i=t.length-1,n;i>=0;i--)(n=t[i])&&(r=(d?n(e,c,r):n(r))||r);return d&&r&&w(e,c,r),r};let a=class extends P{constructor(){super(...arguments),this.src="/data/players.json",this.id="",this.allPlayers=[],this.teamPlayers=[],this.loading=!1,this.error=null}getPrevHref(){try{const t=document.referrer;if(!t)return null;const e=new URL(t);return e.origin!==location.origin?null:e.pathname+e.search+e.hash||e.pathname}catch{return null}}isHomePath(t){return t?t==="/"||t.endsWith("/index.html")||t==="index.html"||t==="/index.html":!1}connectedCallback(){super.connectedCallback();const t=new URL(location.href).searchParams.get("id")||"";!this.id&&t&&(this.id=t)}willUpdate(t){(t.has("src")||t.has("id"))&&this.fetchData()}async fetchData(){this.loading=!0,this.error=null;try{const t=await fetch(this.src);if(!t.ok)throw new Error(`HTTP ${t.status}`);const e=await t.json();this.allPlayers=Array.isArray(e)?e:[],this.filterRoster()}catch(t){this.error=String(t)}finally{this.loading=!1}}filterRoster(){const t=(this.id||"").toLowerCase();if(!t){this.teamPlayers=[];return}this.teamPlayers=this.allPlayers.filter(e=>(e.team||"").toLowerCase()===t)}render(){if(this.loading)return s`<main class="container"><p class="muted">Loading…</p></main>`;if(this.error)return s`<main class="container"><p class="muted">Error: ${this.error}</p></main>`;const t=this.id||(this.teamPlayers[0]?.team??"Team"),e=this.getPrevHref(),c=this.isHomePath(e),d=!!localStorage.getItem("token"),r="favTeams",i=JSON.parse(localStorage.getItem(r)||"[]"),n=i.includes(t),g=async()=>{if(!d){location.href="login.html";return}try{const o=localStorage.getItem("token")||"",h=await fetch("/api/me",{headers:{Authorization:`Bearer ${o}`}}),f=h.ok?await h.json():{favTeams:i},u=Array.isArray(f.favTeams)?f.favTeams:i,p=n?u.filter(y=>y!==t):[...new Set([...u,t])];await fetch("/api/me",{method:"PUT",headers:{"Content-Type":"application/json",Authorization:`Bearer ${o}`},body:JSON.stringify({favTeams:p})}),localStorage.setItem(r,JSON.stringify(p))}catch{}this.requestUpdate()};return s`
      <main class="container">
        <p style="margin: 0 0 var(--space-2);">
          ${e&&!c?s`<a href="${e}">Back</a> &middot; `:null}
          <a href="index.html">Back to Home</a>
        </p>
        <h1>Team Profile</h1>
        <div class="actions">
          <button class="fav ${n?"active":""}" @click=${g}>${n?"Favorited":"Favorite"}</button>
        </div>
        <p class="meta">Team Name: ${t}</p>
        <h2 style="margin-top: var(--space-3)">Members</h2>
        ${this.teamPlayers.length===0?s`<p class="muted">No members found.</p>`:s`
          <ul>
            ${this.teamPlayers.map(o=>s`
              <li>
                <a href="player.html?id=${o.id}"><strong>${o.name}</strong></a> &middot; ${o.role}
                ${o.kda?s`<div class="muted">KDA: ${o.kda}</div>`:null}
              </li>
            `)}
          </ul>
        `}
      </main>
    `}};a.styles=b`
    :host { display: block; }
    .muted { color: var(--color-muted,#666); }
    h1 { text-align: center; margin-bottom: var(--space-3, 1rem); }
    .meta, h2 { text-align: center; }
    .actions { display: flex; gap: .75rem; align-items: center; justify-content: center; margin-bottom: var(--space-2); }
    ul {
      list-style: none;
      margin: 0 auto;
      padding: 0;
      display: grid;
      gap: var(--space-2,.75rem);
      max-width: 720px;
      width: 100%;
    }
    li { padding: var(--space-2,.75rem); border: 1px solid var(--color-border,#e5e7eb); border-radius: var(--radius-md,10px); background: var(--color-surface,#fff); }
    button.fav {
  padding: .45rem .85rem;
  border-radius: var(--radius-sm, 6px);
  border: 1px solid var(--color-border, #e5e7eb);
  background: var(--color-surface, #fff);
  color: var(--color-text, #111);
  font-weight: 600;
  letter-spacing: .3px;
  cursor: pointer;
  transition: background .15s ease, color .15s ease, border-color .15s ease, filter .15s ease;
}
button.fav:hover { filter: brightness(0.98); }
:host-context(body.dark) button.fav { color: #e5e7eb; }
:host-context(body:not(.dark)) button.fav { color: #111; }
button.fav.active { background: var(--color-accent); border-color: var(--color-accent); color: var(--color-accent-contrast); }
:host-context(body.dark) button.fav.active { color: #fff; }
:host-context(body:not(.dark)) button.fav.active { color: #111; }
button.fav[disabled] { opacity: .6; cursor: not-allowed; }
  `;l([v({type:String})],a.prototype,"src",2);l([v({type:String,reflect:!0})],a.prototype,"id",2);l([m()],a.prototype,"allPlayers",2);l([m()],a.prototype,"teamPlayers",2);l([m()],a.prototype,"loading",2);l([m()],a.prototype,"error",2);a=l([x("team-view")],a);
