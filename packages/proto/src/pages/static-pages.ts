import { LitElement, html, css } from "lit";

class BaseStaticPage extends LitElement {
  static styles = css`
    :host { display: block; }
    main { max-width: 720px; margin: 0 auto; padding: var(--space-3); }
  `;
}

export class EventsView extends BaseStaticPage {
  render() {
    return html`
      <main>
        <h1>Event Details</h1>
        <a href="tournament.html">Worlds Championship</a>
        <p>Type: Global Event</p>
        <p>Includes Tournaments:</p>
        <ul class="nav-list" style="max-width: 360px;">
          <li>League of Legends Champions Korea</li>
        </ul>
        <p><a href="index.html">Back to Home</a></p>
      </main>
    `;
  }
}

export class MatchView extends BaseStaticPage {
  render() {
    return html`
      <main>
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
        <p><a href="index.html">Back to Home</a></p>
      </main>
    `;
  }
}

export class TournamentView extends BaseStaticPage {
  render() {
    return html`
      <main>
        <h1>Tournament Bracket</h1>
        <p>Tournament: League of Legends Worlds Championship</p>
        <p>Schedule: <a href="match.html">Match Listings</a></p>
        <p><a href="events.html">Back to Event</a></p>
        <p><a href="index.html">Back to Home</a></p>
      </main>
    `;
  }
}

customElements.define("events-view", EventsView);
customElements.define("match-view", MatchView);
customElements.define("tournament-view", TournamentView);
