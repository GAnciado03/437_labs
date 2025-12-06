import { History, View } from "@calpoly/mustang";
import { css, html } from "lit";
import { property, state } from "lit/decorators.js";
import type { Player } from "server/models";
import { MODEL_CONTEXT } from "../contexts";
import type { Model } from "../model";
import type { Msg } from "../messages";

type FormValues = Partial<Player> & { id?: string };

export class PlayerEditViewElement extends View<Model, Msg> {
  @property({ attribute: "player-id", reflect: true })
  playerId?: string;

  @state()
  private errorMessage = "";

  constructor() {
    super(MODEL_CONTEXT);
  }

  connectedCallback() {
    super.connectedCallback();
    this.dispatchMessage(["players/request"]);
  }

  private get playersStatus() {
    return this.model.playersStatus;
  }

  private get player(): Player | undefined {
    const id = (this.playerId || "").toLowerCase();
    return this.model.players.find(
      (player) => (player.id || "").toLowerCase() === id
    );
  }

  private get formValues(): FormValues {
    const player = this.player;
    if (!player) {
      return {
        id: this.playerId ?? "",
        name: "",
        team: "",
        role: "",
        game: "",
        bio: ""
      };
    }
    return {
      id: player.id,
      name: player.name,
      team: player.team,
      role: player.role,
      game: player.game,
      bio: player.bio
    };
  }

  private handleSubmit = (event: Event) => {
    event.preventDefault();
    const form = event.currentTarget as HTMLFormElement | null;
    if (!form) return;
    this.errorMessage = "";
    const data = new FormData(form);
    const details: FormValues = {
      id: data.get("id")?.toString(),
      name: data.get("name")?.toString(),
      team: data.get("team")?.toString(),
      role: data.get("role")?.toString(),
      game: data.get("game")?.toString(),
      bio: data.get("bio")?.toString()
    };
    const id = details.id || this.playerId || this.player?.id;
    if (!id) {
      this.errorMessage = "Player id is required.";
      return;
    }
    const updated = {
      ...(this.player ?? {}),
      ...details,
      id
    } as Player;
    this.dispatchMessage([
      "player/save",
      {
        player: updated,
        callbacks: {
          onSuccess: () => {
            History.dispatch(this, "history/navigate", {
              href: `/app/players/${id}`
            });
          },
          onFailure: (error: Error) => {
            this.errorMessage =
              error instanceof Error ? error.message : String(error);
            this.requestUpdate();
          }
        }
      }
    ]);
  };

  private renderMainForm() {
    return html`
      <form class="stacked-form" @submit=${this.handleSubmit}>
        <label>
          <span>Player ID</span>
          <input name="id" required .value=${this.formValues.id ?? ""} />
        </label>
        <label>
          <span>Name</span>
          <input name="name" required .value=${this.formValues.name ?? ""} />
        </label>
        <label>
          <span>Team</span>
          <input name="team" required .value=${this.formValues.team ?? ""} />
        </label>
        <label>
          <span>Role</span>
          <input name="role" .value=${this.formValues.role ?? ""} />
        </label>
        <label>
          <span>Game</span>
          <input name="game" .value=${this.formValues.game ?? ""} />
        </label>
        <label>
          <span>Bio</span>
          <textarea
            name="bio"
            rows="6"
            placeholder="Tell us about the player"
            .value=${this.formValues.bio ?? ""}
          ></textarea>
        </label>
        <button type="submit" class="primary">Save Edits</button>
      </form>
    `;
  }

  render() {
    if (this.playersStatus === "loading") {
      return html`<p class="muted">Loading player data...</p>`;
    }
    if (this.playersStatus === "error") {
      return html`<p class="muted">${this.model.playersError ?? "Unable to load players."}</p>`;
    }
    if (!this.player && !this.formValues.id) {
      return html`<p class="muted">Player not found.</p>`;
    }
    return html`
      <main class="edit-layout">
        <div class="edit-card">
          <nav class="back-links">
            <a href="/app/players/${this.playerId ?? ""}">Cancel</a>
            <span class="divider" aria-hidden="true">&middot;</span>
            <a href="/app/players">Players</a>
          </nav>
          <div class="editor-body">
            <h1>Edit Player</h1>
            ${this.errorMessage ? html`<p class="error">${this.errorMessage}</p>` : null}
            <div class="form-wrapper">
              ${this.renderMainForm()}
            </div>
          </div>
        </div>
      </main>
    `;
  }

  static styles = css`
    :host {
      display: block;
    }
    .edit-layout {
      max-width: 720px;
      margin: 0 auto;
      padding: var(--space-4, 2rem);
    }
    .edit-card {
      background: var(--color-surface, #fff);
      color: inherit;
      border-radius: 1rem;
      padding: var(--space-4, 2rem);
      box-shadow: var(--shadow-md, 0 20px 50px rgba(15, 23, 42, 0.08));
      border: 1px solid var(--color-border, #e2e8f0);
      display: flex;
      flex-direction: column;
      gap: var(--space-3, 1.25rem);
    }
    .editor-body {
      max-width: 520px;
      margin: 0 auto;
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: var(--space-2, 0.75rem);
    }
    .editor-body h1 {
      margin: 0;
      text-align: center;
    }
    .editor-body .error {
      text-align: center;
      margin: 0;
    }
    .form-wrapper {
      display: flex;
      flex-direction: column;
      width: 100%;
      align-items: center;
    }
    .stacked-form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      width: 100%;
      max-width: 520px;
    }
    .stacked-form label {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
      font-weight: 600;
    }
    .stacked-form input,
    .stacked-form textarea {
      border: 1px solid var(--color-border, #e2e8f0);
      border-radius: 8px;
      padding: 0.6rem 0.75rem;
      font: inherit;
      background: var(--color-surface, #fff);
      color: inherit;
    }
    .stacked-form textarea {
      min-height: 160px;
    }
    .stacked-form button {
      border-radius: 999px;
      border: none;
      padding: 0.6rem 1.5rem;
      font-weight: 600;
      background: var(--color-accent, #4f46e5);
      color: var(--color-accent-contrast, #fff);
      cursor: pointer;
      align-self: center;
      margin-top: 0.5rem;
    }
    .error {
      color: var(--color-danger, #dc2626);
      margin: 0;
    }
  `;
}

customElements.define("player-edit-view", PlayerEditViewElement);
