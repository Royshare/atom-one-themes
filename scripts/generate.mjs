import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { makeTheme } from './palettes.mjs';

const root = new URL('../', import.meta.url);
const check = process.argv.includes('--check');
if (!check) await mkdir(new URL('themes/', root), { recursive: true });
for (const kind of ['light', 'dark']) {
  const pair = makeTheme(kind);
  for (const type of ['theme', 'scheme']) {
    const path = new URL(`themes/atom-one-${kind}.${type}.json`, root);
    const content = `${JSON.stringify(pair[type], null, 2)}\n`;
    if (check) {
      if (await readFile(path, 'utf8') !== content) throw new Error(`Regenerate ${fileURLToPath(path)} with npm run generate`);
    } else {
      await writeFile(path, content);
    }
  }
  console.log(`${pair.theme.name}: ${Object.keys(pair.theme.tokens).length} UI + ${Object.keys(pair.scheme.tokens).length} editor tokens`);
}
