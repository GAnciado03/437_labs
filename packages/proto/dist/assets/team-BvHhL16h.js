import"./pages-rLHsPmH1.js";/* empty css                   */import"./user-button-DaLNPRlq.js";import{a as p,i as v,x as a}from"./lit-element-Cw0ZWwdS.js";import"./player-list-rOwm4yPC.js";class y extends p{static styles=v`
    :host { display: block; }
    .muted { color: var(--color-muted,#666); }
    h1 { text-align: center; margin-bottom: var(--space-3, 1rem); }
    .meta, h2 { text-align: center; }
    .actions { display: flex; gap: .75rem; align-items: center; justify-content: center; margin-bottom: var(--space-2); }
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
  `;static properties={src:{type:String},id:{type:String,reflect:!0},allPlayers:{state:!0},teamPlayers:{state:!0},loading:{state:!0},error:{state:!0}};constructor(){super(),this.src="/data/players.json",this.id="",this.allPlayers=[],this.teamPlayers=[],this.loading=!1,this.error=null}getPrevHref(){try{const t=document.referrer;if(!t)return null;const e=new URL(t);return e.origin!==location.origin?null:e.pathname+e.search+e.hash||e.pathname}catch{return null}}isHomePath(t){return t?t==="/"||t.endsWith("/index.html")||t==="index.html"||t==="/index.html":!1}connectedCallback(){super.connectedCallback();const t=new URL(location.href).searchParams.get("id")||"";!this.id&&t&&(this.id=t)}willUpdate(t){(t.has("src")||t.has("id"))&&this.fetchData()}async fetchData(){this.loading=!0,this.error=null;try{const t=await fetch(this.src);if(!t.ok)throw new Error(`HTTP ${t.status}`);const e=await t.json();this.allPlayers=Array.isArray(e)?e:[],this.filterRoster()}catch(t){this.error=String(t)}finally{this.loading=!1}}filterRoster(){const t=(this.id||"").toLowerCase();if(!t){this.teamPlayers=[];return}this.teamPlayers=this.allPlayers.filter(e=>(e.team||"").toLowerCase()===t)}render(){if(this.loading)return a`<main class="container"><p class="muted">Loading…</p></main>`;if(this.error)return a`<main class="container"><p class="muted">Error: ${this.error}</p></main>`;const t=this.id||(this.teamPlayers[0]?.team??"Team"),e=this.getPrevHref(),s=this.isHomePath(e),d=!!localStorage.getItem("token"),i="favTeams",r=JSON.parse(localStorage.getItem(i)||"[]"),o=r.includes(t),f=async()=>{if(!d){location.href="login.html";return}try{const n=localStorage.getItem("token")||"",c=await fetch("/api/me",{headers:{Authorization:`Bearer ${n}`}}),l=c.ok?await c.json():{favTeams:r},m=Array.isArray(l.favTeams)?l.favTeams:r,h=o?m.filter(u=>u!==t):[...new Set([...m,t])];await fetch("/api/me",{method:"PUT",headers:{"Content-Type":"application/json",Authorization:`Bearer ${n}`},body:JSON.stringify({favTeams:h})}),localStorage.setItem(i,JSON.stringify(h))}catch{}this.requestUpdate()};return a`
      <main class="container">
        <p style="margin: 0 0 var(--space-2);">
          ${e&&!s?a`<a href="${e}">Back</a> &middot; `:null}
          <a href="index.html">Back to Home</a>
        </p>
        <h1>Team Profile</h1>
        <div class="actions">
          <button class="fav ${o?"active":""}" @click=${f}>
            ${o?"Favorited":"Favorite"}
          </button>
        </div>
        <p class="meta">Team Name: ${t}</p>
        <h2 style="margin-top: var(--space-3)">Players</h2>
        ${this.teamPlayers.length===0?a`<p class="muted">No members found.</p>`:a`<player-list src="${this.src}" .team=${t}></player-list>`}
      </main>
    `}}customElements.define("team-view",y);
