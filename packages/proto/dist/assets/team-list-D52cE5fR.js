import{a as t,i as s,x as r}from"./lit-element-Cw0ZWwdS.js";class i extends t{static styles=s`
    :host { display: block; }
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
      display: flex;
      align-items: center;
      gap: .5rem;
      padding: var(--space-2,.75rem);
      border: 1px solid var(--component-card-border, var(--color-border,#e5e7eb));
      border-radius: var(--component-card-radius, var(--radius-md,10px));
      background: var(--component-card-bg, var(--color-surface,#fff));
      box-shadow: var(--component-card-shadow, var(--shadow-sm, 0 1px 2px rgba(0,0,0,.08)));
    }
    .muted { color: var(--color-muted,#666); }
    .player-link { color: inherit; text-decoration: underline; font-weight: 600; }
  `;static properties={src:{type:String},hideRegion:{type:Boolean,attribute:"hide-region"},showPlayerLink:{type:Boolean,attribute:"show-player-link"},teams:{state:!0},loading:{state:!0},error:{state:!0}};constructor(){super(),this.src="/data/teams.json",this.hideRegion=!1,this.showPlayerLink=!1,this.teams=[],this.loading=!1,this.error=null}willUpdate(e){e.has("src")&&this.src&&this.fetchData()}async fetchData(){this.loading=!0,this.error=null,this.teams=[];try{const e=await fetch(this.src);if(!e.ok)throw new Error(`HTTP ${e.status}`);const a=await e.json();this.teams=Array.isArray(a)?a:[]}catch(e){this.error=String(e)}finally{this.loading=!1}}render(){return this.loading?r`<p class="muted">Loading…</p>`:this.error?r`<p class="muted">Error: ${this.error}</p>`:this.teams.length?r`
      <ul>
        ${this.teams.map(e=>r`
          <li>
            <svg class="icon" aria-hidden="true" style="width: 20px; height: 20px">
              <use href="icons/icons.svg#icon-team"></use>
            </svg>
            <a href="team.html?id=${encodeURIComponent(e.id)}">${e.name}</a>
            ${!this.hideRegion&&e.region?r`<span class="muted">· ${e.region}</span>`:null}
            ${this.showPlayerLink?r`
              <span class="muted">
                · <a class="player-link" href="player.html?team=${encodeURIComponent(e.id)}">Players</a>
              </span>
            `:null}
          </li>
        `)}
      </ul>
    `:r`<p class="muted">No teams found.</p>`}}customElements.define("team-list",i);
