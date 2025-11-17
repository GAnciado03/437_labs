import"./pages-rLHsPmH1.js";/* empty css                   */import"./user-button-DaLNPRlq.js";import"./team-list-D52cE5fR.js";import{a as r,i as s,x as t}from"./lit-element-Cw0ZWwdS.js";import"./top-nav-C23LLDNd.js";class i extends r{static styles=s`
    :host { display: block; }
    .muted { color: var(--color-muted,#666); }
    h1 { text-align: center; margin-bottom: var(--space-3, 1rem); }
    p.top-links { display: none; }
    .center-col {
      max-width: 720px;
      width: 100%;
      margin: 0 auto;
    }
    ul {
      list-style: none;
      margin: 0 auto;
      padding: 0;
      display: grid;
      gap: var(--space-2,.75rem);
      max-width: 720px;
      width: 100%;
    }
    li { display: flex; align-items: center; gap: .5rem; }
  `;static properties={src:{type:String},id:{type:String,reflect:!0},games:{state:!0},loading:{state:!0},error:{state:!0}};constructor(){super(),this.src="/data/games.json",this.id="",this.games=[],this.loading=!1,this.error=null}connectedCallback(){super.connectedCallback();const e=new URL(location.href).searchParams.get("id")||"";!this.id&&e&&(this.id=e)}willUpdate(e){e.has("src")&&this.fetchData()}async fetchData(){if(this.src){this.loading=!0,this.error=null;try{const e=await fetch(this.src);if(!e.ok)throw new Error(`HTTP ${e.status}`);const a=await e.json();this.games=Array.isArray(a)?a:[]}catch(e){this.error=String(e)}finally{this.loading=!1}}}renderGameList(){return this.games.length?t`
      <ul>
        ${this.games.map(e=>t`
          <li>
            <a href="game.html?id=${e.id}"><strong>${e.title}</strong></a>
            <span class="muted">· ${e.genre}</span>
          </li>
        `)}
      </ul>
    `:t`<p class="muted">No games found.</p>`}renderSelectedGame(e){return t`
      <p class="top-links" style="margin: 0 0 var(--space-2);">
        <a href="game.html">Back to Games</a> ·
        <a href="index.html">Back to Home</a>
      </p>
      <h1>Game: ${e.title}</h1>
      <div class="center-col">
        <p>Genre: ${e.genre}</p>
        <h2 style="margin-top: var(--space-3)">Teams</h2>
      </div>
      <team-list src="${e.teamsSrc}" show-player-link></team-list>
    `}render(){if(this.loading)return t`<main class="container"><p class="muted">Loading…</p></main>`;if(this.error)return t`<main class="container"><p class="muted">Error: ${this.error}</p></main>`;const e=this.id?this.games.find(a=>(a.id||"").toLowerCase()===this.id.toLowerCase()):void 0;return t`
      <main class="container">
        ${this.id&&e?this.renderSelectedGame(e):t`
              <h1>Games</h1>
              ${this.renderGameList()}
            `}
      </main>
    `}}customElements.define("game-view",i);
