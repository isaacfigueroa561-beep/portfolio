// After the Vite build: the static v2 page becomes the homepage, and the React app
// moves to app.html so its routes (/resume, /privacy, /terms) keep working.
import { copyFileSync, renameSync } from 'node:fs';
const out = new URL('../dist/public/', import.meta.url);
renameSync(new URL('index.html', out), new URL('app.html', out));
copyFileSync(new URL('v2/index.html', out), new URL('index.html', out));
console.log('promote-v2: v2 is now index.html, React app is app.html');
