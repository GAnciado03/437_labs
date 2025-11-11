import"./pages-rLHsPmH1.js";import"./user-button-ifhGABLi.js";import"./team-list-C6ChVnJ_.js";import{i as h,n as p,r as m,a as d,x as r,t as g}from"./state-BhiRui7X.js";import"./top-nav-ITcaZWeV.js";var u=Object.defineProperty,f=Object.getOwnPropertyDescriptor,i=(e,t,o,n)=>{for(var a=n>1?void 0:n?f(t,o):t,l=e.length-1,c;l>=0;l--)(c=e[l])&&(a=(n?c(t,o,a):c(a))||a);return n&&a&&u(t,o,a),a};let s=class extends d{constructor(){super(...arguments),this.src="/data/games.json",this.id="",this.games=[],this.loading=!1,this.error=null}connectedCallback(){super.connectedCallback();const e=new URL(location.href).searchParams.get("id")||"";!this.id&&e&&(this.id=e)}willUpdate(e){e.has("src")&&this.fetchData()}async fetchData(){if(this.src){this.loading=!0,this.error=null;try{const e=await fetch(this.src);if(!e.ok)throw new Error(`HTTP ${e.status}`);const t=await e.json();this.games=Array.isArray(t)?t:[]}catch(e){this.error=String(e)}finally{this.loading=!1}}}renderGameList(){return this.games.length?r`
      <ul>
        ${this.games.map(e=>r`
          <li>
            <a href="game.html?id=${e.id}"><strong>${e.title}</strong></a>
            <span class="muted">· ${e.genre}</span>
          </li>
        `)}
      </ul>`:r`<p class="muted">No games found.</p>`}renderSelectedGame(e){return r`
      <p class="top-links" style="margin: 0 0 var(--space-2);">
        <a href="game.html">Back to Games</a> ·
        <a href="index.html">Back to Home</a>
      </p>
      <h1>Game: ${e.title}</h1>
      <div class="center-col">
        <p>Genre: ${e.genre}</p>
        <h2 style="margin-top: var(--space-3)">Teams</h2>
      </div>
      <team-list src="${e.teamsSrc}"></team-list>
    `}render(){if(this.loading)return r`<main class="container"><p class="muted">Loading…</p></main>`;if(this.error)return r`<main class="container"><p class="muted">Error: ${this.error}</p></main>`;const e=this.id?this.games.find(t=>t.id.toLowerCase()===this.id.toLowerCase()):void 0;return r`
      <main class="container">
        ${this.id&&e?this.renderSelectedGame(e):r`
              <h1>Games</h1>
              ${this.renderGameList()}
            `}
      </main>
    `}};s.styles=h`
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
      margin: 0 auto; /* center list */
      padding: 0;
      display: grid;
      gap: var(--space-2,.75rem);
      max-width: 720px;
      width: 100%;
    }
    li { display: flex; align-items: center; gap: .5rem; }
  `;i([p({type:String})],s.prototype,"src",2);i([p({type:String,reflect:!0})],s.prototype,"id",2);i([m()],s.prototype,"games",2);i([m()],s.prototype,"loading",2);i([m()],s.prototype,"error",2);s=i([g("game-view")],s);
