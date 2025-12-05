import { LitElement, html, css } from "lit";

class BaseStaticPage extends LitElement {
  static styles = css`
    :host {
      display: block;
    }
    main {
      max-width: 720px;
      margin: 0 auto;
      padding: var(--space-3);
    }
  `;
}

const FEATURED_EVENT = {
  name: "Worlds Championship",
  type: "Global Major",
  season: "2025 Circuit Finale",
  location: "Seoul, South Korea",
  dates: "Oct 1 – Nov 9, 2025",
  game: "League of Legends",
  qualifier: "Top 24 teams worldwide compete for the Summoner's Cup.",
  description:
    "The Worlds Championship gathers the best regional champions for one month of high-stakes international play, culminating in a stadium final."
};

const SEASON_EVENTS = [
  { name: "Pacific Showdown", city: "Los Angeles, USA", date: "Aug 12", game: "Valorant" },
  { name: "Masters Berlin", city: "Berlin, Germany", date: "Jul 22", game: "Valorant" },
  { name: "LCK Finals", city: "Seoul, Korea", date: "Sep 01", game: "League of Legends" },
  { name: "Mid-Season Invitational", city: "Tokyo, Japan", date: "May 18", game: "League of Legends" },
  { name: "Americas Championship", city: "Dallas, USA", date: "Jun 30", game: "Rocket League" }
];

const TOURNAMENTS = [
  { name: "League of Legends Champions Korea", stage: "Regional Qualifier", status: "Completed" },
  { name: "Mid-Season Invitational", stage: "Wildcard Entry", status: "Invites sent" },
  { name: "Play-In Stage", stage: "Group Placement", status: "Scheduled for Oct 1" },
  { name: "Knockout Stage", stage: "Single Elimination", status: "Top 8 Teams" }
];

export class EventsView extends BaseStaticPage {
  render() {
    return html`
      <main class="event-shell">
        <nav class="back-links">
          <a href="index.html" data-back-link data-back-fallback="index.html">Back</a>
          <span class="divider" aria-hidden="true">·</span>
          <a href="index.html">Back to Home</a>
        </nav>
        <header class="page-header">
          <p class="eyebrow">${FEATURED_EVENT.season}</p>
          <h1>${FEATURED_EVENT.name}</h1>
          <p class="intro">${FEATURED_EVENT.description}</p>
          <div class="cta">
            <a class="btn primary" href="tournament.html">View bracket</a>
            <a class="btn ghost" href="teamchooser.html">Browse teams</a>
          </div>
        </header>
        <section class="layout">
          <aside>
            <div class="aside-head">
              <h2>Season Events</h2>
              <span>${SEASON_EVENTS.length} listed</span>
            </div>
            <div class="list-box">
              <ul>
                ${SEASON_EVENTS.map(
                  (event) => html`
                    <li>
                      <div>
                        <p class="name">${event.name}</p>
                        <p class="meta">${event.game} • ${event.city}</p>
                      </div>
                      <span class="date">${event.date}</span>
                    </li>
                  `
                )}
              </ul>
            </div>
            <p class="aside-link">
              <a href="index.html" data-back-link>Back to Home</a>
            </p>
          </aside>
          <article class="card">
            <section class="details">
              <dl>
                <div>
                  <dt>Type</dt>
                  <dd>${FEATURED_EVENT.type}</dd>
                </div>
                <div>
                  <dt>Game</dt>
                  <dd>${FEATURED_EVENT.game}</dd>
                </div>
                <div>
                  <dt>Location</dt>
                  <dd>${FEATURED_EVENT.location}</dd>
                </div>
                <div>
                  <dt>Dates</dt>
                  <dd>${FEATURED_EVENT.dates}</dd>
                </div>
              </dl>
              <p class="qualifier">${FEATURED_EVENT.qualifier}</p>
            </section>
            <section class="tournaments">
              <h3>Linked tournaments</h3>
              <div class="tournament-grid">
                ${TOURNAMENTS.map(
                  (tournament) => html`
                    <div class="t-card">
                      <p class="label">${tournament.stage}</p>
                      <h4>${tournament.name}</h4>
                      <p class="meta">${tournament.status}</p>
                    </div>
                  `
                )}
              </div>
            </section>
          </article>
        </section>
      </main>
    `;
  }

  static styles = [
    BaseStaticPage.styles,
    css`
      .event-shell {
        max-width: 1100px;
        padding: var(--space-5, 3rem) var(--space-4, 2rem);
      }
      .page-header {
        text-align: center;
        margin-bottom: var(--space-4, 2rem);
      }
      .eyebrow {
        text-transform: uppercase;
        letter-spacing: 0.25em;
        color: var(--color-muted, #64748b);
        font-size: 0.85rem;
      }
      .intro {
        max-width: 680px;
        margin: 0 auto var(--space-4, 2rem);
        color: var(--color-muted, #64748b);
      }
      .cta {
        display: flex;
        justify-content: center;
        gap: 0.75rem;
        flex-wrap: wrap;
      }
      .btn {
        border-radius: 999px;
        padding: 0.5rem 1.25rem;
        font-weight: 600;
        text-decoration: none;
        border: 1px solid transparent;
      }
      .btn.primary {
        background: var(--color-accent, #4f46e5);
        color: var(--color-accent-contrast, #fff);
      }
      .btn.ghost {
        border-color: var(--color-border, #e2e8f0);
        color: var(--color-text, #0f172a);
        background: var(--color-surface, transparent);
      }
      .layout {
        display: grid;
        grid-template-columns: minmax(240px, 1fr) 2fr;
        gap: var(--space-5, 3rem);
        align-items: start;
      }
      aside {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }
      .aside-head {
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        font-weight: 600;
      }
      .list-box {
        background: var(--color-surface, #fff);
        border: 1px solid var(--color-border, #e2e8f0);
        border-radius: var(--radius-lg, 14px);
        padding: 1rem 1.25rem;
        max-height: calc(100vh - 260px);
        overflow-y: auto;
        box-shadow: var(--shadow-sm, 0 1px 2px rgba(0, 0, 0, 0.06));
      }
      ul {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }
      li {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 0.75rem;
        padding-bottom: 0.35rem;
        border-bottom: 1px solid var(--color-border, #e2e8f0);
      }
      li:last-child {
        border-bottom: none;
        padding-bottom: 0;
      }
      .name {
        font-weight: 600;
        margin: 0;
      }
      .meta,
      .date,
      .qualifier {
        color: var(--color-muted, #64748b);
        margin: 0;
        font-size: 0.95rem;
      }
      .card {
        background: var(--color-surface, #fff);
        border-radius: var(--radius-lg, 16px);
        border: 1px solid var(--color-border, #e2e8f0);
        box-shadow: var(--shadow-md, 0 15px 45px rgba(15, 23, 42, 0.08));
        padding: var(--space-4, 2rem);
        display: flex;
        flex-direction: column;
        gap: var(--space-4, 2rem);
      }
      dl {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 1rem;
        margin: 0;
      }
      dt {
        text-transform: uppercase;
        font-size: 0.85rem;
        letter-spacing: 0.08em;
        color: var(--color-muted, #94a3b8);
      }
      dd {
        margin: 0;
        font-weight: 600;
        font-size: 1.1rem;
      }
      .tournaments h3 {
        margin: 0 0 0.75rem;
      }
      .tournament-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        gap: 1rem;
      }
      .t-card {
        border: 1px solid var(--color-border, #e2e8f0);
        border-radius: var(--radius-md, 12px);
        padding: 0.9rem 1rem;
        background: var(--color-bg, #f8fafc);
      }
      .label {
        text-transform: uppercase;
        font-size: 0.75rem;
        letter-spacing: 0.12em;
        color: var(--color-muted, #94a3b8);
        margin: 0 0 0.35rem;
      }
      h4 {
        margin: 0;
        font-size: 1.1rem;
      }
      .aside-link {
        margin: 0;
      }
      @media (max-width: 900px) {
        .layout {
          grid-template-columns: 1fr;
        }
        .list-box {
          max-height: none;
        }
      }
    `
  ];
}

export class MatchView extends BaseStaticPage {
  render() {
    return html`
      <main>
        <nav class="back-links">
          <a href="index.html" data-back-link data-back-fallback="index.html">Back</a>
          <span class="divider" aria-hidden="true">·</span>
          <a href="index.html">Back to Home</a>
        </nav>
        <h1>Match Information</h1>
        <p>Match: T1 vs AG</p>
        <p>Date: October 31, 2025</p>
        <p>
          Teams:
          <a href="team.html?id=T1">T1</a>
          vs
          <a href="team.html?id=Anyone%27s%20Legend">Anyone's Legend</a>
        </p>
        <p>Stats: <a href="stats.html">View Match Stats</a></p>
        <p><a href="index.html" data-back-link>Back to Home</a></p>
      </main>
    `;
  }
}

export class TournamentView extends BaseStaticPage {
  render() {
    return html`
      <main>
        <nav class="back-links">
          <a href="index.html" data-back-link data-back-fallback="events.html">Back</a>
          <span class="divider" aria-hidden="true">·</span>
          <a href="index.html">Back to Home</a>
        </nav>
        <h1>Tournament Bracket</h1>
        <p>Tournament: League of Legends Worlds Championship</p>
        <p>Schedule: <a href="match.html">Match Listings</a></p>
        <p><a href="events.html" data-back-link>Back to Event</a></p>
        <p><a href="index.html" data-back-link>Back to Home</a></p>
      </main>
    `;
  }
}

customElements.define("events-view", EventsView);
customElements.define("match-view", MatchView);
customElements.define("tournament-view", TournamentView);
