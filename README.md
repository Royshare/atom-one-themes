# Atom One Themes for OpenIDEA

Two complete themes inspired by Atom's One Light and One Dark, in a single
native [OpenIDEA](https://github.com/l0ng-ai/openidea) plugin.

| | Atom One Light | Atom One Dark |
| --- | --- | --- |
| Editor background | `#fafafa` | `#282c34` |
| Editor foreground | `#383a42` | `#abb2bf` |
| Keywords | `#a626a4` | `#c678dd` |
| Functions | `#4078f2` | `#61afef` |
| Strings | `#50a14f` | `#98c379` |
| Accent | `#356ddb` | `#61afef` |

Each variant sets 268 tokens: application surfaces, tool windows, tabs,
popups, controls, selections, syntax, Python details, Markdown, diff and Git
colors, editor diagnostics, and all 16 console and terminal ANSI colors.
Body text, muted labels, links, primary buttons and editor selections are
checked for WCAG AA contrast. Syntax hues retain Atom's palette; subdued
comments are slightly brighter in dark mode for readability.

Fonts, font sizes, ligatures, layout and compact mode remain controlled by
your OpenIDEA settings. This is a data-only plugin: no WebAssembly or permissions.

## Install

1. In OpenIDEA, open **Settings → Plugins → ⚙ → Install Plugin from Package File…**.
2. Select `dist/myrrr.atom-one-themes-1.0.0.oiplugin` or
   `dist/myrrr.atom-one-themes-1.0.0.zip`.
   Alternatively use **Install Plugin from Disk…** and select this repository's folder.
3. Apply **Atom One Light** or **Atom One Dark** in the plugin details, or select
   it under **Settings → Appearance → Theme**.

If **Sync with OS** is enabled, assign Atom One Light and Atom One Dark to the
preferred light and dark themes. Existing custom accents and editor color
overrides take precedence over a theme's defaults; use the default accent and
editor scheme to see the complete palette.

Targets OpenIDEA's plugin API `^1.2` (for the plugin icon). Resource coverage is
checked against the official **OpenIDEA 0.1.45** theme template. This package
is for OpenIDEA; it does not use IntelliJ's plugin format. Its plugin ID is
`myrrr.atom-one-themes`; OpenIDEA requires lowercase IDs. The publisher name is
`MyRRR`.

## Edit and validate

Node.js 22+ is only needed for development; the plugin itself has no dependencies.

```sh
npm run generate   # regenerate themes/*.json from scripts/palettes.mjs
npm run check      # check generated resources are current
npm test          # token coverage, host constraints, palette and contrast checks
```

Edit the role palettes in `scripts/palettes.mjs`, then regenerate the JSON.
The finished JSON files can also be used directly without Node.js.

Use the [official plugin CLI](https://github.com/l0ng-ai/openidea/blob/v0.1.45/plugins/README.md)
to validate using the same loader as the IDE and create an unsigned local package:

```sh
openidea-plugin check .
openidea-plugin pack . --out dist/myrrr.atom-one-themes-1.0.0.oiplugin
openidea-plugin check dist/myrrr.atom-one-themes-1.0.0.oiplugin
```

Create `dist` first if it does not exist. On Windows, `npm run package:zip`
(PowerShell 7+) validates and creates a ZIP using an explicit file list.

### Sign for distribution

The local package above is unsigned. For a signed release, create a publisher
key once, keep the private key outside the repository, then sign the package
with publisher `myrrr` (the lowercase namespace in the plugin ID):

```sh
umask 077
mkdir -p "$HOME/.config/openidea/keys"
openidea-plugin keygen "$HOME/.config/openidea/keys/myrrr.key"
openidea-plugin pack . \
  --out dist/myrrr.atom-one-themes-1.0.0.oiplugin \
  --key "$HOME/.config/openidea/keys/myrrr.key" --publisher myrrr
openidea-plugin check dist/myrrr.atom-one-themes-1.0.0.oiplugin
```

Register publisher `myrrr` and its public key with the OpenIDEA plugin
registry before submitting the signed package. The signature is Ed25519 and
covers the plugin ID, version, and package contents. See the official
[distribution and signing guide](https://github.com/l0ng-ai/openidea/blob/v0.1.45/plugins/README.md#8-distribution).

For live editing, `openidea-plugin link .` registers a development plugin.
Open Settings → Plugins or use **Reload Plugins** to pick up edits.
`openidea-plugin unlink .` removes the development link.

## Publish a release

`release.sh` checks the generated resources, runs the test suite, signs the
package, publishes a GitHub Release, verifies its uploaded package, and opens
a pull request to the OpenIDEA community registry. It reads the version and
release notes from `plugin.toml`. Before using it, push a clean commit to the
`main` branch of a public GitHub repository.

Create a signing key once and keep it outside this repository. The command
prints a public key; keep that value for an initial publisher registration:

```sh
umask 077
mkdir -p "$HOME/.config/openidea/keys"
openidea-plugin keygen "$HOME/.config/openidea/keys/myrrr.key"
```

Review the complete signed build without publishing anything:

```sh
./release.sh --dry-run
```

For a regular release, run `./release.sh`. It asks before publishing the GitHub
Release and before opening the registry pull request. For a first-time
publisher registration, pass the public key printed by `keygen`:

```sh
./release.sh --public-key '<base64 public key>'
```

The registry maintainers review and merge the pull request. `--no-pr` stops
after the GitHub Release; `--yes` skips the script's confirmations.

## Attribution

MIT licensed. Inspired by the Atom team; see [NOTICE.md](NOTICE.md) for the
original palette sources and the Phosphor icon license and attribution.

Theme format reference: [OpenIDEA theme plugins](https://github.com/l0ng-ai/openidea/blob/v0.1.45/plugins/themes.md).
