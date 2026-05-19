const fs = require('fs');
const path = require('path');

const root = process.cwd();
const outDir = path.join(root, 'out');
const appDir = path.join(root, '.next', 'server', 'app');
const staticDir = path.join(root, '.next', 'static');
const publicDir = path.join(root, 'public');

function copyDir(source, target) {
  if (!fs.existsSync(source)) return;
  fs.mkdirSync(target, { recursive: true });

  for (const entry of fs.readdirSync(source, { withFileTypes: true })) {
    const sourcePath = path.join(source, entry.name);
    const targetPath = path.join(target, entry.name);

    if (entry.isDirectory()) {
      copyDir(sourcePath, targetPath);
    } else {
      fs.copyFileSync(sourcePath, targetPath);
    }
  }
}

function writeRoute(route, sourcePath) {
  const cleanRoute = route.replace(/\\/g, '/');
  const nestedPath =
    cleanRoute === 'index'
      ? path.join(outDir, 'index.html')
      : path.join(outDir, cleanRoute, 'index.html');
  const flatPath =
    cleanRoute === 'index' ? path.join(outDir, 'index.html') : path.join(outDir, `${cleanRoute}.html`);

  fs.mkdirSync(path.dirname(nestedPath), { recursive: true });
  fs.copyFileSync(sourcePath, nestedPath);

  if (flatPath !== nestedPath) {
    fs.mkdirSync(path.dirname(flatPath), { recursive: true });
    fs.copyFileSync(sourcePath, flatPath);
  }
}

function walkHtml(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      walkHtml(fullPath);
      continue;
    }

    if (!entry.name.endsWith('.html')) continue;

    const relative = path.relative(appDir, fullPath).replace(/\.html$/, '');
    if (relative.startsWith('api')) continue;
    writeRoute(relative, fullPath);
  }
}

if (!fs.existsSync(appDir)) {
  throw new Error('Expected .next/server/app to exist. Run next build first.');
}

fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });

copyDir(publicDir, outDir);
copyDir(staticDir, path.join(outDir, '_next', 'static'));
walkHtml(appDir);

const bodyFiles = [
  ['robots.txt.body', 'robots.txt'],
  ['sitemap.xml.body', 'sitemap.xml'],
  ['icon.png.body', 'icon.png'],
];

for (const [sourceName, targetName] of bodyFiles) {
  const sourcePath = path.join(appDir, sourceName);
  if (fs.existsSync(sourcePath)) {
    fs.copyFileSync(sourcePath, path.join(outDir, targetName));
  }
}

console.log('Static fallback written to out/. Use a Render Web Service for API routes.');
