import"./pages-rLHsPmH1.js";/* empty css                   */import"./user-button-DaLNPRlq.js";import"./player-list-rOwm4yPC.js";import{a as v,i as b,x as o}from"./lit-element-Cw0ZWwdS.js";import"./top-nav-C23LLDNd.js";class w extends v{static styles=b`
    :host { display: block; }
    .muted { color: var(--color-muted,#666); }
    h1 { text-align: center; margin-bottom: var(--space-3, 1rem); }
    .actions { display: flex; gap: .75rem; align-items: center; margin-bottom: var(--space-2); justify-content: center; }
    .filter-panel {
      display: flex;
      flex-wrap: wrap;
      gap: .75rem;
      align-items: flex-end;
      margin: var(--space-3) 0 var(--space-2);
    }
    .filter-panel label { display: grid; gap: 4px; font-weight: 600; }
    .filter-panel select,
    .filter-panel input {
      min-width: 180px;
      padding: .4rem .6rem;
      border-radius: var(--radius-sm, 6px);
      border: 1px solid var(--color-border,#e5e7eb);
      background: var(--color-surface,#fff);
      color: var(--color-text,#111);
    }
    .filter-panel button {
      padding: .35rem .7rem;
      border-radius: var(--radius-sm, 6px);
      border: 1px solid var(--color-border,#e5e7eb);
      background: var(--color-surface,#fff);
      cursor: pointer;
    }
    :host-context(body.dark) .filter-panel select,
    :host-context(body.dark) .filter-panel input,
    :host-context(body.dark) .filter-panel button {
      background: var(--color-surface,#111827);
      color: var(--color-text,#e5e7eb);
      border-color: var(--color-border,#1f2937);
    }
    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0,0,0,0);
      white-space: nowrap;
      border: 0;
    }
    button.fav {
      padding: .45rem .85rem;
      border-radius: var(--radius-sm, 6px);
      border: 1px solid var(--color-border, #e5e7eb);
      background: var(--color-surface, #fff);
      color: var(--color-text, #111);
      font-weight: 600;
      letter-spacing: .3px;
      cursor: pointer;
      transition: background .15s ease, color .15s ease, border-color .15s ease, filter .15s ease;
    }
    button.fav:hover { filter: brightness(0.98); }
    :host-context(body.dark) button.fav { color: #e5e7eb; }
    :host-context(body:not(.dark)) button.fav { color: #111; }
    button.fav.active { background: var(--color-accent); border-color: var(--color-accent); color: var(--color-accent-contrast); }
    :host-context(body.dark) button.fav.active { color: #fff; }
    :host-context(body:not(.dark)) button.fav.active { color: #111; }
    button.fav[disabled] { opacity: .6; cursor: not-allowed; }
  `;static properties={src:{type:String},id:{type:String,reflect:!0},player:{state:!0},loading:{state:!0},error:{state:!0},filterType:{state:!0},filterValue:{state:!0},gameOptions:{state:!0},teamOptions:{state:!0},gameTeams:{state:!0}};constructor(){super(),this.src="/data/player-details.json",this.id="",this.player=void 0,this.loading=!1,this.error=null,this.filterType="all",this.filterValue="",this.gameOptions=[],this.teamOptions=[],this.gameTeams={}}connectedCallback(){super.connectedCallback();const e=new URL(location.href),t=e.searchParams.get("id")||"",a=e.searchParams.get("team")||"";!this.id&&t&&(this.id=t),a&&(this.filterType="team",this.filterValue=a),this.loadGameDirectory()}willUpdate(e){(e.has("src")||e.has("id"))&&this.fetchData()}async fetchData(){if(this.src){this.loading=!0,this.error=null,this.player=void 0;try{const e=await fetch(this.src);if(!e.ok)throw new Error(`HTTP ${e.status}`);const t=await e.json(),a=(this.id||"").toLowerCase(),n=Array.isArray(t)?t.find(c=>(c.id||"").toLowerCase()===a):void 0;this.player=n||(Array.isArray(t)?t[0]:void 0)}catch(e){this.error=String(e)}finally{this.loading=!1}}}async loadGameDirectory(){try{const e=await fetch("/data/games.json");if(!e.ok)throw new Error(`HTTP ${e.status}`);const t=await e.json();this.gameOptions=Array.isArray(t)?t.map(r=>({id:r.id,title:r.title,teamsSrc:r.teamsSrc})):[];const a={},n=new Set,c=[],p=(r,i)=>{const s=(r||i||"").trim();if(!s)return;const l=s.toLowerCase();n.has(l)||(n.add(l),c.push({id:s,label:i||s}))},d=(r,i)=>{const s=(r||"").trim().toLowerCase();!s||!i||(a[s]=i)};await Promise.all((this.gameOptions||[]).map(async r=>{try{const i=await fetch(r.teamsSrc);if(!i.ok)return;(await i.json()||[]).forEach(l=>{d(l.id,r.id),d(l.name,r.id),p(l.id,l.name||l.id),l.name&&p(l.name,l.name)})}catch{}})),this.teamOptions=c.sort((r,i)=>r.label.localeCompare(i.label,void 0,{sensitivity:"base"})),this.gameTeams=a}catch{}}handleFilterTypeChange(e){const t=e.target.value;this.filterType=t,t==="all"&&(this.filterValue="")}handleFilterValueChange(e){this.filterValue=e.target.value}clearFilter(){this.filterType="all",this.filterValue="";const e=new URL(location.href);e.searchParams.delete("team"),history.replaceState(null,"",e.toString())}renderFilterControl(){return this.filterType==="name"?o`
        <label class="filter-field">
          <span class="sr-only">Player name</span>
          <input
            type="text"
            placeholder="Search player name"
            .value=${this.filterValue}
            @input=${this.handleFilterValueChange}
          />
        </label>
      `:this.filterType==="team"?o`
        <label class="filter-field">
          <span class="sr-only">Team</span>
          <select .value=${this.filterValue} @change=${this.handleFilterValueChange}>
            <option value="">Select team</option>
            ${this.teamOptions.map(e=>o`
              <option value=${e.id}>${e.label}</option>
            `)}
          </select>
        </label>
      `:this.filterType==="game"?o`
        <label class="filter-field">
          <span class="sr-only">Game</span>
          <select .value=${this.filterValue} @change=${this.handleFilterValueChange}>
            <option value="">Select game</option>
            ${this.gameOptions.map(e=>o`
              <option value=${e.id}>${e.title}</option>
            `)}
          </select>
        </label>
      `:null}render(){if(this.loading)return o`<p class="muted">Loading…</p>`;if(this.error)return o`<p class="muted">Error: ${this.error}</p>`;if(!this.player)return o`<p class="muted">No player found.</p>`;const e=this.player,t=e.id,a=this.filterValue.trim();let n="",c="",p="";this.filterType==="name"&&(n=a),this.filterType==="team"&&(c=a),this.filterType==="game"&&(p=a);const d=!!localStorage.getItem("token"),r="favPlayers",i=JSON.parse(localStorage.getItem(r)||"[]"),s=i.includes(t);return o`
      <main>
        <h1>Players</h1>
        <div class="actions">
          <button class="fav ${s?"active":""}" @click=${async()=>{if(!d){location.href="login.html";return}try{const f=localStorage.getItem("token")||"",h=await fetch("/api/me",{headers:{Authorization:`Bearer ${f}`}}),m=h.ok?await h.json():{favPlayers:i},u=Array.isArray(m.favPlayers)?m.favPlayers:i,y=s?u.filter(g=>g!==t):[...new Set([...u,t])];await fetch("/api/me",{method:"PUT",headers:{"Content-Type":"application/json",Authorization:`Bearer ${f}`},body:JSON.stringify({favPlayers:y})}),localStorage.setItem(r,JSON.stringify(y))}catch{}this.requestUpdate()}}>
            ${s?"Favorited":"Favorite"}
          </button>
        </div>
        <p>Player: <a href="stats.html?id=${t}">${e.name}</a></p>
        <p>Team: <a href="team.html?id=${encodeURIComponent(e.team)}">${e.team}</a></p>
        <section class="filter-panel">
          <label>
            Filter
            <select .value=${this.filterType} @change=${this.handleFilterTypeChange}>
              <option value="all">All Players</option>
              <option value="name">By Player Name</option>
              <option value="team">By Team</option>
              <option value="game">By Game</option>
            </select>
          </label>
          ${this.renderFilterControl()}
          ${this.filterType!=="all"?o`
            <button type="button" class="mono" @click=${this.clearFilter}>Clear</button>
          `:null}
        </section>
        <p class="muted">
          ${this.filterType==="name"&&a?o`Showing players matching "<strong>${a}</strong>".`:this.filterType==="team"&&a?o`Showing roster for ${a}.`:this.filterType==="game"&&a?o`Showing players competing in ${a}.`:o`Showing all players.`}
        </p>

        <player-list
          src="/data/players.json"
          .gameTeams=${this.gameTeams}
          .filterName=${n}
          .filterTeam=${c}
          .filterGame=${p}
        ></player-list>
      </main>
    `}}customElements.define("player-view",w);
