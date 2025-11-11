import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

type Player = { id: string; name: string; team: string; role: string; kda: string };

@customElement('player-list')
export class PlayerList extends LitElement {
  static styles = css`
    :host { display: block; }
    .muted { color: var(--color-muted,#666); }
    ul { list-style: none; margin: 0; padding: 0; display: grid; gap: var(--space-2,.75rem); }
    li { padding: var(--space-2,.75rem); border: 1px solid var(--color-border,#e5e7eb); border-radius: var(--radius-md,10px); background: var(--color-surface,#fff); }
    strong { color: var(--color-heading,#111); }
  `;

  @property({ type: String }) src = '';
  @state() private players: Player[] = [];
  @state() private loading = false;
  @state() private error: string | null = null;
  #abort?: AbortController;

  willUpdate(changed: Map<string, unknown>) {
    if (changed.has('src') && this.src) this.fetchData();
  }

  async fetchData() {
    this.#abort?.abort();
    this.#abort = new AbortController();
    this.loading = true; this.error = null;
    try {
      const res = await fetch(this.src, { signal: this.#abort.signal });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as unknown;
      this.players = Array.isArray(data) ? data as Player[] : [];
    } catch (e: unknown) {
      if ((e as any)?.name !== 'AbortError') this.error = String(e);
    } finally {
      this.loading = false;
    }
  }

  render() {
    if (this.loading) return html`<p class="muted">Loading…</p>`;
    if (this.error) return html`<p class="muted">Error: ${this.error}</p>`;
    if (!this.players.length) return html`<p class="muted">No players found.</p>`;
    return html`
      <ul>
        ${this.players.map(p => html`
          <li>
            <a href="player.html?id=${p.id}"><strong>${p.name}</strong></a> · ${p.team} · ${p.role}
            <div class="muted">KDA: ${p.kda}</div>
          </li>
        `)}
      </ul>
    `;
  }
}

declare global { interface HTMLElementTagNameMap { 'player-list': PlayerList } }
