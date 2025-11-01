import { defineConfig } from 'vite';
import { resolve } from 'path';

const r = (p: string) => resolve(__dirname, p);

export default defineConfig({
  root: '.',
  appType: 'mpa',
  server: { port: 3000 },
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
