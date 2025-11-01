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
        player2: r('player2.html'),
        stats: r('stats.html'),
        stats2: r('stats2.html'),
        team: r('team.html'),
        team2: r('team2.html'),
        tournament: r('tournament.html'),
        events: r('events.html'),
        user: r('user.html')
      }
    }
  }
});
