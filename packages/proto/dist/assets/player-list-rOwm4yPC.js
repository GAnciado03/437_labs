import{a as n,i as m,x as s}from"./lit-element-Cw0ZWwdS.js";class c extends n{static styles=m`
    :host { display: block; }
    .muted { color: var(--color-muted,#666); }
    ul {
      list-style: none;
      margin: 0 auto;
      padding: 0;
      display: grid;
      gap: var(--space-2,.75rem);
      max-width: 720px;
      width: 100%;
    }
    li {
      padding: var(--space-2,.75rem);
      border: 1px solid var(--component-card-border, var(--color-border,#e5e7eb));
      border-radius: var(--component-card-radius, var(--radius-md,10px));
      background: var(--component-card-bg, var(--color-surface,#fff));
      box-shadow: var(--component-card-shadow, var(--shadow-sm, 0 1px 2px rgba(0,0,0,.08)));
    }
    strong { color: var(--color-heading,#111); }
  `;static properties={src:{type:String},team:{type:String},filterName:{type:String,attribute:"filter-name"},filterTeam:{type:String,attribute:"filter-team"},filterGame:{type:String,attribute:"filter-game"},gameTeams:{attribute:!1},players:{state:!0},loading:{state:!0},error:{state:!0}};#t;constructor(){super(),this.src="",this.team="",this.filterName="",this.filterTeam="",this.filterGame="",this.gameTeams={},this.players=[],this.loading=!1,this.error=null}willUpdate(t){t.has("src")&&this.src&&this.fetchData()}async fetchData(){this.#t?.abort(),this.#t=new AbortController,this.loading=!0,this.error=null;try{const t=await fetch(this.src,{signal:this.#t.signal});if(!t.ok)throw new Error(`HTTP ${t.status}`);const r=await t.json();this.players=Array.isArray(r)?r:[]}catch(t){t?.name!=="AbortError"&&(this.error=String(t))}finally{this.loading=!1}}applyFilters(){const t=(this.filterName||"").trim().toLowerCase(),r=(this.filterTeam||this.team||"").trim().toLowerCase(),i=(this.filterGame||"").trim().toLowerCase(),o=this.gameTeams||{};let e=this.players;return t&&(e=e.filter(a=>(a.name||"").toLowerCase().includes(t))),r&&(e=e.filter(a=>(a.team||"").toLowerCase()===r)),i&&(e=e.filter(a=>{const l=(a.team||"").toLowerCase();return(o[l]||"").toLowerCase()===i})),e}render(){if(this.loading)return s`<p class="muted">Loading…</p>`;if(this.error)return s`<p class="muted">Error: ${this.error}</p>`;const t=this.applyFilters();return t.length?s`
      <ul>
        ${t.map(r=>s`
          <li>
            <a href="player.html?id=${r.id}"><strong>${r.name}</strong></a> · ${r.team} · ${r.role}
          </li>
        `)}
      </ul>
    `:s`<p class="muted">No players found.</p>`}}customElements.define("player-list",c);
