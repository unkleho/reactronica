import { defineConfig } from 'vite';
import reactRefresh from '@vitejs/plugin-react-refresh';
// import path from 'path';
// import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    reactRefresh(),
    // Not quite working, getting Uncaught SyntaxError: indirect export not found: SongProps
    // tsconfigPaths({
    //   projects: ['./tsconfig.json', '../tsconfig.json'],
    // }),
  ],
  // resolve: {
  //   alias: {
  //     // Not quite working, getting Uncaught SyntaxError: indirect export not found: SongProps
  //     reactronica: path.resolve(__dirname, '../src'),
  //   },
  // },
});
