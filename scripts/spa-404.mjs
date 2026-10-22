// GitHub Pages has no SPA rewrites: serve the app shell for unknown paths
// (dist/404.html) so deep links like /Lumen-Grove/en/residences survive a refresh.
import { copyFileSync } from 'node:fs'
copyFileSync('dist/index.html', 'dist/404.html')
console.log('spa-404: dist/404.html written')
