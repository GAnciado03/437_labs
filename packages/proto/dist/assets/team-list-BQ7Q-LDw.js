import{i as c,n as m,r as h,a as d,x as a,t as u}from"./state-mzX8VpgM.js";var g=Object.defineProperty,f=Object.getOwnPropertyDescriptor,i=(t,s,n,o)=>{for(var r=o>1?void 0:o?f(s,n):s,l=t.length-1,p;l>=0;l--)(p=t[l])&&(r=(o?p(s,n,r):p(r))||r);return o&&r&&g(s,n,r),r};let e=class extends d{constructor(){super(...arguments),this.src="/data/teams.json",this.teams=[],this.loading=!1,this.error=null}willUpdate(t){t.has("src")&&this.src&&this.fetchData()}async fetchData(){this.loading=!0,this.error=null,this.teams=[];try{const t=await fetch(this.src);if(!t.ok)throw new Error(`HTTP ${t.status}`);const s=await t.json();this.teams=Array.isArray(s)?s:[]}catch(t){this.error=String(t)}finally{this.loading=!1}}render(){return this.loading?a`<p class="muted">Loading…</p>`:this.error?a`<p class="muted">Error: ${this.error}</p>`:this.teams.length?a`
      <ul>
        ${this.teams.map(t=>a`
          <li>
            <svg class="icon" aria-hidden="true" style="width: 20px; height: 20px"><use href="icons/icons.svg#icon-team"></use></svg>
            <a href="team.html?id=${encodeURIComponent(t.id)}">${t.name}</a>
            ${t.region?a`<span class="muted">· ${t.region}</span>`:null}
          </li>
        `)}
      </ul>
    `:a`<p class="muted">No teams found.</p>`}};e.styles=c`
    :host { display: block; }
    ul { list-style: none; margin: 0; padding: 0; display: grid; gap: var(--space-2,.75rem); }
    li { display: flex; align-items: center; gap: .5rem; }
    .muted { color: var(--color-muted,#666); }
  `;i([m({type:String})],e.prototype,"src",2);i([h()],e.prototype,"teams",2);i([h()],e.prototype,"loading",2);i([h()],e.prototype,"error",2);e=i([u("team-list")],e);
