import"./user-button-sjTj3YiV.js";import{i as m,n as y,r as h,a as v,x as n,t as g}from"./state-BhiRui7X.js";var b=Object.defineProperty,C=Object.getOwnPropertyDescriptor,_=r=>{throw TypeError(r)},f=(r,e,t,s)=>{for(var a=s>1?void 0:s?C(e,t):e,i=r.length-1,o;i>=0;i--)(o=r[i])&&(a=(s?o(e,t,a):o(a))||a);return s&&a&&b(e,t,a),a},$=(r,e,t)=>e.has(r)||_("Cannot "+t),w=(r,e,t)=>($(r,e,"read from private field"),e.get(r)),O=(r,e,t)=>e.has(r)?_("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(r):e.set(r,t),x=(r,e,t,s)=>($(r,e,"write to private field"),e.set(r,t),t),d;let p=class extends v{constructor(){super(...arguments),this.src="",this.players=[],this.loading=!1,this.error=null,O(this,d)}willUpdate(r){r.has("src")&&this.src&&this.fetchData()}async fetchData(){w(this,d)?.abort(),x(this,d,new AbortController),this.loading=!0,this.error=null;try{const r=await fetch(this.src,{signal:w(this,d).signal});if(!r.ok)throw new Error(`HTTP ${r.status}`);const e=await r.json();this.players=Array.isArray(e)?e:[]}catch(r){r?.name!=="AbortError"&&(this.error=String(r))}finally{this.loading=!1}}render(){return this.loading?n`<p class="muted">Loading…</p>`:this.error?n`<p class="muted">Error: ${this.error}</p>`:this.players.length?n`
      <ul>
        ${this.players.map(r=>n`
          <li>
            <a href="player.html?id=${r.id}"><strong>${r.name}</strong></a> · ${r.team} · ${r.role}
            <div class="muted">KDA: ${r.kda}</div>
          </li>
        `)}
      </ul>
    `:n`<p class="muted">No players found.</p>`}};d=new WeakMap;p.styles=m`
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
  `;f([y({type:String})],p.prototype,"src",2);f([h()],p.prototype,"players",2);f([h()],p.prototype,"loading",2);f([h()],p.prototype,"error",2);p=f([g("player-list")],p);var D=Object.defineProperty,H=Object.getOwnPropertyDescriptor,c=(r,e,t,s)=>{for(var a=s>1?void 0:s?H(e,t):e,i=r.length-1,o;i>=0;i--)(o=r[i])&&(a=(s?o(e,t,a):o(a))||a);return s&&a&&D(e,t,a),a};let l=class extends v{constructor(){super(...arguments),this.src="/data/player-details.json",this.id="",this.loading=!1,this.error=null}connectedCallback(){super.connectedCallback();const r=new URL(location.href).searchParams.get("id")||"";!this.id&&r&&(this.id=r)}willUpdate(r){(r.has("src")||r.has("id"))&&this.fetchData()}async fetchData(){if(this.src){this.loading=!0,this.error=null,this.player=void 0;try{const r=await fetch(this.src);if(!r.ok)throw new Error(`HTTP ${r.status}`);const e=await r.json(),t=(this.id||"").toLowerCase();this.player=e.find(s=>s.id.toLowerCase()===t)||e[0]}catch(r){this.error=String(r)}finally{this.loading=!1}}}render(){if(this.loading)return n`<p class="muted">Loading…</p>`;if(this.error)return n`<p class="muted">Error: ${this.error}</p>`;if(!this.player)return n`<p class="muted">No player found.</p>`;const r=this.player,e=r.id,t=r.achievements?.join(", ")||"—";return n`
      <main>
        <h1>Player Profile</h1>
        <p>Player Name: <a href="stats.html?id=${e}">${r.name}</a></p>
        <p>Role: ${r.role}</p>
        <p>Team: <a href="team.html?id=${encodeURIComponent(r.team)}">${r.team}</a></p>
        <p>Achievements: ${t}</p>

        <h2 style="margin-top: var(--space-3)">Players</h2>
        <player-list src="/data/players.json"></player-list>
      </main>
    `}};l.styles=m`
    :host { display: block; }
    .muted { color: var(--color-muted,#666); }
    h1 { text-align: center; margin-bottom: var(--space-3, 1rem); }
  `;c([y({type:String})],l.prototype,"src",2);c([y({type:String,reflect:!0})],l.prototype,"id",2);c([h()],l.prototype,"player",2);c([h()],l.prototype,"loading",2);c([h()],l.prototype,"error",2);l=c([g("player-view")],l);var S=Object.defineProperty,j=Object.getOwnPropertyDescriptor,P=(r,e,t,s)=>{for(var a=s>1?void 0:s?j(e,t):e,i=r.length-1,o;i>=0;i--)(o=r[i])&&(a=(s?o(e,t,a):o(a))||a);return s&&a&&S(e,t,a),a};let u=class extends v{constructor(){super(...arguments),this.home="index.html"}getPrevHref(){try{const r=document.referrer;if(!r)return null;const e=new URL(r);return e.origin!==location.origin?null:e.pathname+e.search+e.hash||e.pathname}catch{return null}}isHomePath(r){return r?r==="/"||r.endsWith("/index.html")?!0:r===`/${this.home}`||r===this.home:!1}render(){const r=this.getPrevHref(),e=this.isHomePath(r);return n`
      <div class="row">
        ${r&&!e?n`<a href="${r}">Back</a> · `:null}
        <a href="${this.home}">Back to Home</a>
      </div>
    `}};u.styles=m`
    :host { display: block; }
    .row { margin: 0 0 var(--space-2, .75rem); }
    a { font-weight: 600; }
  `;P([y({type:String})],u.prototype,"home",2);u=P([g("top-nav")],u);
