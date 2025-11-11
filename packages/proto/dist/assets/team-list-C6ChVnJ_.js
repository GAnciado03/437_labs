import{i as d,n as c,r as p,a as m,x as i,t as u}from"./state-BhiRui7X.js";var g=Object.defineProperty,f=Object.getOwnPropertyDescriptor,a=(t,s,n,o)=>{for(var r=o>1?void 0:o?f(s,n):s,l=t.length-1,h;l>=0;l--)(h=t[l])&&(r=(o?h(s,n,r):h(r))||r);return o&&r&&g(s,n,r),r};let e=class extends m{constructor(){super(...arguments),this.src="/data/teams.json",this.hideRegion=!1,this.teams=[],this.loading=!1,this.error=null}willUpdate(t){t.has("src")&&this.src&&this.fetchData()}async fetchData(){this.loading=!0,this.error=null,this.teams=[];try{const t=await fetch(this.src);if(!t.ok)throw new Error(`HTTP ${t.status}`);const s=await t.json();this.teams=Array.isArray(s)?s:[]}catch(t){this.error=String(t)}finally{this.loading=!1}}render(){return this.loading?i`<p class="muted">Loading…</p>`:this.error?i`<p class="muted">Error: ${this.error}</p>`:this.teams.length?i`
      <ul>
        ${this.teams.map(t=>i`
          <li>
            <svg class="icon" aria-hidden="true" style="width: 20px; height: 20px"><use href="icons/icons.svg#icon-team"></use></svg>
            <a href="team.html?id=${encodeURIComponent(t.id)}">${t.name}</a>
            ${!this.hideRegion&&t.region?i`<span class="muted">· ${t.region}</span>`:null}
          </li>
        `)}
      </ul>
    `:i`<p class="muted">No teams found.</p>`}};e.styles=d`
    :host { display: block; }
    ul {
      list-style: none;
      margin: 0 auto; /* center the list */
      padding: 0;
      display: grid;
      gap: var(--space-2,.75rem);
      max-width: 720px;
      width: 100%;
    }
    li { display: flex; align-items: center; gap: .5rem; }
    .muted { color: var(--color-muted,#666); }
  `;a([c({type:String})],e.prototype,"src",2);a([c({type:Boolean,attribute:"hide-region"})],e.prototype,"hideRegion",2);a([p()],e.prototype,"teams",2);a([p()],e.prototype,"loading",2);a([p()],e.prototype,"error",2);e=a([u("team-list")],e);
