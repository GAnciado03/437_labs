import"./pages-rLHsPmH1.js";import"./user-button-ifhGABLi.js";import{i as $,n as v,r as p,a as P,x as n,t as _}from"./state-BhiRui7X.js";import"./top-nav-ITcaZWeV.js";var C=Object.defineProperty,A=Object.getOwnPropertyDescriptor,x=t=>{throw TypeError(t)},f=(t,r,e,o)=>{for(var a=o>1?void 0:o?A(r,e):r,s=t.length-1,i;s>=0;s--)(i=t[s])&&(a=(o?i(r,e,a):i(a))||a);return o&&a&&C(r,e,a),a},S=(t,r,e)=>r.has(t)||x("Cannot "+e),w=(t,r,e)=>(S(t,r,"read from private field"),r.get(t)),O=(t,r,e)=>r.has(t)?x("Cannot add the same private member more than once"):r instanceof WeakSet?r.add(t):r.set(t,e),D=(t,r,e,o)=>(S(t,r,"write to private field"),r.set(t,e),e),h;let c=class extends P{constructor(){super(...arguments),this.src="",this.players=[],this.loading=!1,this.error=null,O(this,h)}willUpdate(t){t.has("src")&&this.src&&this.fetchData()}async fetchData(){w(this,h)?.abort(),D(this,h,new AbortController),this.loading=!0,this.error=null;try{const t=await fetch(this.src,{signal:w(this,h).signal});if(!t.ok)throw new Error(`HTTP ${t.status}`);const r=await t.json();this.players=Array.isArray(r)?r:[]}catch(t){t?.name!=="AbortError"&&(this.error=String(t))}finally{this.loading=!1}}render(){return this.loading?n`<p class="muted">Loading…</p>`:this.error?n`<p class="muted">Error: ${this.error}</p>`:this.players.length?n`
      <ul>
        ${this.players.map(t=>n`
          <li>
            <a href="player.html?id=${t.id}"><strong>${t.name}</strong></a> · ${t.team} · ${t.role}
            <div class="muted">KDA: ${t.kda}</div>
          </li>
        `)}
      </ul>
    `:n`<p class="muted">No players found.</p>`}};h=new WeakMap;c.styles=$`
    :host { display: block; }
    .muted { color: var(--color-muted,#666); }
    ul {
      list-style: none;
      margin: 0 auto; /* center the list */
      padding: 0;
      display: grid;
      gap: var(--space-2,.75rem);
      max-width: 720px; /* cap width for nicer reading */
      width: 100%;
    }
    li { padding: var(--space-2,.75rem); border: 1px solid var(--color-border,#e5e7eb); border-radius: var(--radius-md,10px); background: var(--color-surface,#fff); }
    strong { color: var(--color-heading,#111); }
  `;f([v({type:String})],c.prototype,"src",2);f([p()],c.prototype,"players",2);f([p()],c.prototype,"loading",2);f([p()],c.prototype,"error",2);c=f([_("player-list")],c);var j=Object.defineProperty,T=Object.getOwnPropertyDescriptor,d=(t,r,e,o)=>{for(var a=o>1?void 0:o?T(r,e):r,s=t.length-1,i;s>=0;s--)(i=t[s])&&(a=(o?i(r,e,a):i(a))||a);return o&&a&&j(r,e,a),a};let l=class extends P{constructor(){super(...arguments),this.src="/data/player-details.json",this.id="",this.loading=!1,this.error=null}connectedCallback(){super.connectedCallback();const t=new URL(location.href).searchParams.get("id")||"";!this.id&&t&&(this.id=t)}willUpdate(t){(t.has("src")||t.has("id"))&&this.fetchData()}async fetchData(){if(this.src){this.loading=!0,this.error=null,this.player=void 0;try{const t=await fetch(this.src);if(!t.ok)throw new Error(`HTTP ${t.status}`);const r=await t.json(),e=(this.id||"").toLowerCase();this.player=r.find(o=>o.id.toLowerCase()===e)||r[0]}catch(t){this.error=String(t)}finally{this.loading=!1}}}render(){if(this.loading)return n`<p class="muted">Loading…</p>`;if(this.error)return n`<p class="muted">Error: ${this.error}</p>`;if(!this.player)return n`<p class="muted">No player found.</p>`;const t=this.player,r=t.id,e=t.achievements?.join(", ")||"—",o=!!localStorage.getItem("token"),a="favPlayers",s=JSON.parse(localStorage.getItem(a)||"[]"),i=s.includes(r);return n`
      <main>
        <h1>Player Profile</h1>
        <div class="actions">
<button class="fav ${i?"active":""}" @click=${async()=>{if(!o){location.href="login.html";return}try{const u=localStorage.getItem("token")||"",y=await fetch("/api/me",{headers:{Authorization:`Bearer ${u}`}}),g=y.ok?await y.json():{favPlayers:s},m=Array.isArray(g.favPlayers)?g.favPlayers:s,b=i?m.filter(k=>k!==r):[...new Set([...m,r])];await fetch("/api/me",{method:"PUT",headers:{"Content-Type":"application/json",Authorization:`Bearer ${u}`},body:JSON.stringify({favPlayers:b})}),localStorage.setItem(a,JSON.stringify(b))}catch{}this.requestUpdate()}}>${i?"Favorited":"Favorite"}</button>
        </div>
        <p>Player Name: <a href="stats.html?id=${r}">${t.name}</a></p>
        <p>Role: ${t.role}</p>
        <p>Team: <a href="team.html?id=${encodeURIComponent(t.team)}">${t.team}</a></p>
        <p>Achievements: ${e}</p>

        <h2 style="margin-top: var(--space-3)">Players</h2>
        <player-list src="/data/players.json"></player-list>
      </main>
    `}};l.styles=$`
    :host { display: block; }
    .muted { color: var(--color-muted,#666); }
    h1 { text-align: center; margin-bottom: var(--space-3, 1rem); }
    .actions { display: flex; gap: .75rem; align-items: center; margin-bottom: var(--space-2); justify-content: center; }
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
  `;d([v({type:String})],l.prototype,"src",2);d([v({type:String,reflect:!0})],l.prototype,"id",2);d([p()],l.prototype,"player",2);d([p()],l.prototype,"loading",2);d([p()],l.prototype,"error",2);l=d([_("player-view")],l);
