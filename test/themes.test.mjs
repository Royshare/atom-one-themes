import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { makeTheme } from '../scripts/palettes.mjs';

const root = new URL('../', import.meta.url);
const reference = JSON.parse(await readFile(new URL('reference/openidea-0.1.45.tokens.json', root), 'utf8'));
const manifest = await readFile(new URL('plugin.toml', root), 'utf8');

function luminance(hex) {
  const rgb = hex.slice(1).match(/../g).map(c => parseInt(c, 16) / 255)
    .map(c => c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722;
}

function contrast(a, b) {
  const [high, low] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (high + 0.05) / (low + 0.05);
}

test('manifest registers two existing theme / editor scheme pairs without runtime code', async () => {
  const paths = [...manifest.matchAll(/^(?:path|editor-scheme) = "([^"]+)"/gm)].map(m => m[1]);
  assert.equal(paths.length, 4);
  assert.equal(new Set(paths).size, 4);
  for (const path of paths) {
    assert.ok(!path.includes('..') && !path.startsWith('/'));
    JSON.parse(await readFile(new URL(path, root), 'utf8'));
  }
  assert.doesNotMatch(manifest, /^(wasm|\[capabilities\])/m);
  assert.match(manifest, /^engines.openidea = "\^1\.2"$/m);
});

for (const kind of ['light', 'dark']) {
  const { theme, scheme } = makeTheme(kind);
  const tokens = { ...theme.tokens, ...scheme.tokens };

  test(`${theme.name}: includes the complete OpenIDEA ${reference.version} reference palette`, () => {
    assert.deepEqual(Object.keys(theme.tokens).sort(), [...reference.ui].sort());
    assert.deepEqual(Object.keys(scheme.tokens).sort(), [...reference.editor].sort());
    assert.equal(Object.keys(tokens).length, reference.ui.length + reference.editor.length);
    assert.ok(Object.keys(tokens).length <= 512);
  });

  test(`${theme.name}: generated files match the source palette`, async () => {
    for (const [type, expected] of Object.entries({ theme, scheme })) {
      const actual = JSON.parse(await readFile(new URL(`themes/atom-one-${kind}.${type}.json`, root), 'utf8'));
      assert.deepEqual(actual, expected);
    }
    assert.equal(theme.kind, kind);
    assert.equal(theme.name, scheme.name);
  });

  test(`${theme.name}: token values obey OpenIDEA's host constraints`, () => {
    for (const [key, value] of Object.entries(tokens)) {
      assert.match(key, /^--[a-z0-9-]{1,62}$/);
      assert.equal(typeof value, 'string');
      assert.ok(value.trim().length > 0 && value.length <= 256, key);
      assert.doesNotMatch(value, /[;{}<>\\\n\r]|url\(|image\(|@import|expression\(/i, key);
      // Keep all colours literal: references cannot silently inherit a different base palette.
      assert.doesNotMatch(value, /var\(/, key);
    }
  });

  test(`${theme.name}: body text, muted labels, buttons and selections have AA contrast`, () => {
    const pairs = [
      ['--fg', '--bg-app'], ['--fg', '--bg-island'], ['--fg', '--bg-frame'],
      ['--fg', '--bg-popup'], ['--fg', '--bg-selected'],
      ['--fg-muted', '--bg-app'], ['--fg-muted', '--bg-elev'],
      ['--fg-editor', '--bg-editor'], ['--fg-editor', '--bg-editor-selection'],
      ['--fg-tooltip', '--bg-tooltip'], ['--fg-button-primary', '--accent'],
      ['--fg-button-primary', '--bg-button-primary-hover'], ['--link', '--bg-app'],
    ];
    for (const [fg, bg] of pairs) {
      const ratio = contrast(tokens[fg], tokens[bg]);
      assert.ok(ratio >= 4.5, `${fg} on ${bg}: ${ratio.toFixed(2)}:1; expected >= 4.5:1`);
    }
  });

  test(`${theme.name}: console and terminal share all 16 ANSI colours`, () => {
    const ansi = Object.keys(tokens).filter(k => k.startsWith('--ansi-'));
    assert.equal(ansi.length, 16);
    for (const key of ansi) assert.equal(tokens[`--terminal-${key.slice(2)}`], tokens[key]);
  });
}

test('variants retain Atom One identity and leave typography / compact mode to the user', () => {
  const light = makeTheme('light');
  const dark = makeTheme('dark');
  assert.equal(light.scheme.tokens['--bg-editor'], '#fafafa');
  assert.equal(dark.scheme.tokens['--bg-editor'], '#282c34');
  assert.equal(light.scheme.tokens['--syn-keyword'], '#a626a4');
  assert.equal(dark.scheme.tokens['--syn-keyword'], '#c678dd');
  for (const { theme, scheme } of [light, dark]) {
    for (const key of Object.keys({ ...theme.tokens, ...scheme.tokens })) {
      assert.doesNotMatch(key, /^--(?:font-|fs-|h-|radius-|fw-)/);
    }
  }
});
