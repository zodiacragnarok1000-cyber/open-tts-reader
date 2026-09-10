import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const required = [
  'index.html',
  'app.js',
  'styles.css',
  'manifest.webmanifest',
  'sw.js',
  'README.md',
  'README.en.md',
  'LICENSE',
  'CONTRIBUTING.md',
  'CHANGELOG.md',
  'docs/speech-synthesis.html',
  'docs/web-speech-api.md',
  'docs/architecture.md',
  'docs/integration.md',
  '.github/workflows/ci.yml'
];

for (const file of required) {
  if (!fs.existsSync(path.join(root, file))) {
    throw new Error(`Missing required file: ${file}`);
  }
}

const forbidden = [
  /(?:sk|pk|ghp|github_pat)_[A-Za-z0-9_-]{20,}/g,
  /AKIA[0-9A-Z]{16}/g,
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/g,
  /(?:api[_-]?key|secret|token)\s*[:=]\s*['"][A-Za-z0-9_\-]{20,}['"]/gi
];

const extensions = new Set(['.js', '.html', '.css', '.md', '.yml', '.yaml', '.json', '.webmanifest']);
const ignoredDirs = new Set(['.git', 'node_modules']);

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ignoredDirs.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else if (extensions.has(path.extname(entry.name).toLowerCase())) out.push(full);
  }
  return out;
}

for (const file of walk(root)) {
  const text = fs.readFileSync(file, 'utf8');
  for (const pattern of forbidden) {
    if (pattern.test(text)) {
      throw new Error(`Possible hardcoded secret pattern found in ${path.relative(root, file)}`);
    }
    pattern.lastIndex = 0;
  }
}

const manifest = JSON.parse(fs.readFileSync(path.join(root, 'manifest.webmanifest'), 'utf8'));
for (const key of ['name', 'short_name', 'start_url', 'display']) {
  if (!manifest[key]) throw new Error(`manifest.webmanifest is missing '${key}'`);
}

console.log('Repository hygiene and required-file checks passed.');
