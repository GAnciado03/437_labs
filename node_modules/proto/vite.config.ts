import { defineConfig } from 'vite';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const r = (p: string) => resolve(__dirname, p);

export default defineConfig({
  appType: 'mpa',
  server: {
    port: 3000,
    proxy: {
      '/api': 'http://localhost:4000'
    }
  },
  preview: { port: 3000 },
  build: {
    rollupOptions: {
      input: {
        index: r('index.html'),
        game: r('game.html'),
        match: r('match.html'),
        player: r('player.html'),
        stats: r('stats.html'),
        team: r('team.html'),
        tournament: r('tournament.html'),
        events: r('events.html'),
        teamchooser: r('teamchooser.html'),
        user: r('user.html')
      }
    }
  }
});
