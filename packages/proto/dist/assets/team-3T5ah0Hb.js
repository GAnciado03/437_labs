import"./user-button-sjTj3YiV.js";import{i as d,n as m,r as n,a as p,x as s,t as u}from"./state-BhiRui7X.js";var f=Object.defineProperty,y=Object.getOwnPropertyDescriptor,l=(e,r,o,t)=>{for(var i=t>1?void 0:t?y(r,o):r,c=e.length-1,h;c>=0;c--)(h=e[c])&&(i=(t?h(r,o,i):h(i))||i);return t&&i&&f(r,o,i),i};let a=class extends p{constructor(){super(...arguments),this.src="/data/players.json",this.id="",this.allPlayers=[],this.teamPlayers=[],this.loading=!1,this.error=null}getPrevHref(){try{const e=document.referrer;if(!e)return null;const r=new URL(e);return r.origin!==location.origin?null:r.pathname+r.search+r.hash||r.pathname}catch{return null}}isHomePath(e){return e?e==="/"||e.endsWith("/index.html")||e==="index.html"||e==="/index.html":!1}connectedCallback(){super.connectedCallback();const e=new URL(location.href).searchParams.get("id")||"";!this.id&&e&&(this.id=e)}willUpdate(e){(e.has("src")||e.has("id"))&&this.fetchData()}async fetchData(){this.loading=!0,this.error=null;try{const e=await fetch(this.src);if(!e.ok)throw new Error(`HTTP ${e.status}`);const r=await e.json();this.allPlayers=Array.isArray(r)?r:[],this.filterRoster()}catch(e){this.error=String(e)}finally{this.loading=!1}}filterRoster(){const e=(this.id||"").toLowerCase();if(!e){this.teamPlayers=[];return}this.teamPlayers=this.allPlayers.filter(r=>(r.team||"").toLowerCase()===e)}render(){if(this.loading)return s`<main class="container"><p class="muted">Loading…</p></main>`;if(this.error)return s`<main class="container"><p class="muted">Error: ${this.error}</p></main>`;const e=this.id||(this.teamPlayers[0]?.team??"Team"),r=this.getPrevHref(),o=this.isHomePath(r);return s`
      <main class="container">
        <p style="margin: 0 0 var(--space-2);">
          ${r&&!o?s`<a href="${r}">Back</a> · `:null}
          <a href="index.html">Back to Home</a>
        </p>
        <h1>Team Profile</h1>
        <p>Team Name: ${e}</p>
        <h2 style="margin-top: var(--space-3)">Members</h2>
        ${this.teamPlayers.length===0?s`<p class="muted">No members found.</p>`:s`
          <ul>
          ${this.teamPlayers.map(t=>s`
            <li>
              <a href="player.html?id=${t.id}"><strong>${t.name}</strong></a> · ${t.role}
              ${t.kda?s`<div class="muted">KDA: ${t.kda}</div>`:null}
            </li>
          `)}
          </ul>
        `}
      </main>
    `}};a.styles=d`
    :host { display: block; }
    .muted { color: var(--color-muted,#666); }
    ul {
      list-style: none;
      margin: 0 auto; /* center the list */
      padding: 0;
      display: grid;
      gap: var(--space-2,.75rem);
      max-width: 720px;
      width: 100%;
    }
    li { padding: var(--space-2,.75rem); border: 1px solid var(--color-border,#e5e7eb); border-radius: var(--radius-md,10px); background: var(--color-surface,#fff); }
  `;l([m({type:String})],a.prototype,"src",2);l([m({type:String,reflect:!0})],a.prototype,"id",2);l([n()],a.prototype,"allPlayers",2);l([n()],a.prototype,"teamPlayers",2);l([n()],a.prototype,"loading",2);l([n()],a.prototype,"error",2);a=l([u("team-view")],a);
