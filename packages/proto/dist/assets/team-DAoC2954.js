import"./user-button-sjTj3YiV.js";import{i as m,n as h,r as o,a as p,x as s,t as y}from"./state-mzX8VpgM.js";var f=Object.defineProperty,u=Object.getOwnPropertyDescriptor,i=(r,e,n,l)=>{for(var a=l>1?void 0:l?u(e,n):e,c=r.length-1,d;c>=0;c--)(d=r[c])&&(a=(l?d(e,n,a):d(a))||a);return l&&a&&f(e,n,a),a};let t=class extends p{constructor(){super(...arguments),this.src="/data/players.json",this.id="",this.allPlayers=[],this.teamPlayers=[],this.loading=!1,this.error=null}connectedCallback(){super.connectedCallback();const r=new URL(location.href).searchParams.get("id")||"";!this.id&&r&&(this.id=r)}willUpdate(r){(r.has("src")||r.has("id"))&&this.fetchData()}async fetchData(){this.loading=!0,this.error=null;try{const r=await fetch(this.src);if(!r.ok)throw new Error(`HTTP ${r.status}`);const e=await r.json();this.allPlayers=Array.isArray(e)?e:[],this.filterRoster()}catch(r){this.error=String(r)}finally{this.loading=!1}}filterRoster(){const r=(this.id||"").toLowerCase();if(!r){this.teamPlayers=[];return}this.teamPlayers=this.allPlayers.filter(e=>(e.team||"").toLowerCase()===r)}render(){if(this.loading)return s`<main class="container"><p class="muted">Loading…</p></main>`;if(this.error)return s`<main class="container"><p class="muted">Error: ${this.error}</p></main>`;const r=this.id||(this.teamPlayers[0]?.team??"Team");return s`
      <main class="container">
        <p style="margin: 0 0 var(--space-2);">
          <a href="events.html">Events</a>
          ·
          <a href="index.html">Back to Home</a>
        </p>
        <h1>Team Profile</h1>
        <p>Team Name: ${r}</p>
        <h2 style="margin-top: var(--space-3)">Members</h2>
        ${this.teamPlayers.length===0?s`<p class="muted">No members found.</p>`:s`
          <ul>
          ${this.teamPlayers.map(e=>s`
            <li>
              <a href="player.html?id=${e.id}"><strong>${e.name}</strong></a> · ${e.role}
              ${e.kda?s`<div class="muted">KDA: ${e.kda}</div>`:null}
            </li>
          `)}
          </ul>
        `}
      </main>
    `}};t.styles=m`
    :host { display: block; }
    .muted { color: var(--color-muted,#666); }
    ul { list-style: none; margin: 0; padding: 0; display: grid; gap: var(--space-2,.75rem); }
    li { padding: var(--space-2,.75rem); border: 1px solid var(--color-border,#e5e7eb); border-radius: var(--radius-md,10px); background: var(--color-surface,#fff); }
  `;i([h({type:String})],t.prototype,"src",2);i([h({type:String,reflect:!0})],t.prototype,"id",2);i([o()],t.prototype,"allPlayers",2);i([o()],t.prototype,"teamPlayers",2);i([o()],t.prototype,"loading",2);i([o()],t.prototype,"error",2);t=i([y("team-view")],t);
