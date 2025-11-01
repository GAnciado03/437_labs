import"./user-button-sjTj3YiV.js";import{i as m,n as y,r as c,a as v,x as i,t as g}from"./state-mzX8VpgM.js";var $=Object.defineProperty,P=Object.getOwnPropertyDescriptor,w=r=>{throw TypeError(r)},f=(r,t,e,s)=>{for(var a=s>1?void 0:s?P(t,e):t,l=r.length-1,n;l>=0;l--)(n=r[l])&&(a=(s?n(t,e,a):n(a))||a);return s&&a&&$(t,e,a),a},_=(r,t,e)=>t.has(r)||w("Cannot "+e),u=(r,t,e)=>(_(r,t,"read from private field"),t.get(r)),C=(r,t,e)=>t.has(r)?w("Cannot add the same private member more than once"):t instanceof WeakSet?t.add(r):t.set(r,e),b=(r,t,e,s)=>(_(r,t,"write to private field"),t.set(r,e),e),d;let p=class extends v{constructor(){super(...arguments),this.src="",this.players=[],this.loading=!1,this.error=null,C(this,d)}willUpdate(r){r.has("src")&&this.src&&this.fetchData()}async fetchData(){u(this,d)?.abort(),b(this,d,new AbortController),this.loading=!0,this.error=null;try{const r=await fetch(this.src,{signal:u(this,d).signal});if(!r.ok)throw new Error(`HTTP ${r.status}`);const t=await r.json();this.players=Array.isArray(t)?t:[]}catch(r){r?.name!=="AbortError"&&(this.error=String(r))}finally{this.loading=!1}}render(){return this.loading?i`<p class="muted">Loading…</p>`:this.error?i`<p class="muted">Error: ${this.error}</p>`:this.players.length?i`
      <ul>
        ${this.players.map(r=>i`
          <li>
            <a href="player.html?id=${r.id}"><strong>${r.name}</strong></a> · ${r.team} · ${r.role}
            <div class="muted">KDA: ${r.kda}</div>
          </li>
        `)}
      </ul>
    `:i`<p class="muted">No players found.</p>`}};d=new WeakMap;p.styles=m`
    :host { display: block; }
    .muted { color: var(--color-muted,#666); }
    ul { list-style: none; margin: 0; padding: 0; display: grid; gap: var(--space-2,.75rem); }
    li { padding: var(--space-2,.75rem); border: 1px solid var(--color-border,#e5e7eb); border-radius: var(--radius-md,10px); background: var(--color-surface,#fff); }
    strong { color: var(--color-heading,#111); }
  `;f([y({type:String})],p.prototype,"src",2);f([c()],p.prototype,"players",2);f([c()],p.prototype,"loading",2);f([c()],p.prototype,"error",2);p=f([g("player-list")],p);var D=Object.defineProperty,O=Object.getOwnPropertyDescriptor,h=(r,t,e,s)=>{for(var a=s>1?void 0:s?O(t,e):t,l=r.length-1,n;l>=0;l--)(n=r[l])&&(a=(s?n(t,e,a):n(a))||a);return s&&a&&D(t,e,a),a};let o=class extends v{constructor(){super(...arguments),this.src="/data/player-details.json",this.id="",this.loading=!1,this.error=null}connectedCallback(){super.connectedCallback();const r=new URL(location.href).searchParams.get("id")||"";!this.id&&r&&(this.id=r)}willUpdate(r){(r.has("src")||r.has("id"))&&this.fetchData()}async fetchData(){if(this.src){this.loading=!0,this.error=null,this.player=void 0;try{const r=await fetch(this.src);if(!r.ok)throw new Error(`HTTP ${r.status}`);const t=await r.json(),e=(this.id||"").toLowerCase();this.player=t.find(s=>s.id.toLowerCase()===e)||t[0]}catch(r){this.error=String(r)}finally{this.loading=!1}}}render(){if(this.loading)return i`<p class="muted">Loading…</p>`;if(this.error)return i`<p class="muted">Error: ${this.error}</p>`;if(!this.player)return i`<p class="muted">No player found.</p>`;const r=this.player,t=r.id,e=r.achievements?.join(", ")||"—";return i`
      <main class="container">
        <p style="margin: 0 0 var(--space-2);">
          <a href="stats.html?id=${t}">View Stats</a>
          ·
          <a href="index.html">Back to Home</a>
        </p>
        <h1>Player Profile</h1>
        <p>Player Name: ${r.name}</p>
        <p>Role: <a href="stats.html?id=${t}">${r.role}</a></p>
        <p>Team: <a href="team.html?id=${encodeURIComponent(r.team)}">${r.team}</a></p>
        <p>Achievements: ${e}</p>

        <h2 style="margin-top: var(--space-3)">Players</h2>
        <player-list src="/data/players.json"></player-list>
      </main>
    `}};o.styles=m`
    :host { display: block; }
    .muted { color: var(--color-muted,#666); }
  `;h([y({type:String})],o.prototype,"src",2);h([y({type:String,reflect:!0})],o.prototype,"id",2);h([c()],o.prototype,"player",2);h([c()],o.prototype,"loading",2);h([c()],o.prototype,"error",2);o=h([g("player-view")],o);
