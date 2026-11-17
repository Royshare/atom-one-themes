#!/usr/bin/env bash
# Release the version in plugin.toml to GitHub and the OpenIDEA plugin registry.
# Nothing is signed, tagged, pushed, or published until checks pass and you
# confirm each external publishing step.
#
# Usage:
#   ./release.sh [--dry-run] [--key PATH] [--public-key KEY] [--yes] [--no-pr]
#
# Bump version and change-notes in plugin.toml, then commit and push to main.
# The signing key defaults to ~/.config/openidea/keys/<publisher>.key.
# For a first publisher registration, pass --public-key with the output from
# `openidea-plugin keygen`.
#
# Requires: gh (authenticated), openidea-plugin, npm, git, shasum.
set -euo pipefail

here="$(cd "$(dirname "$0")" && pwd)"
cd "$here"

REGISTRY="l0ng-ai/openidea-plugins"
dry=0 yes=0 pr=1 key="" public_key=""
while [ "$#" -gt 0 ]; do
  case "$1" in
    --dry-run) dry=1 ;;
    --yes) yes=1 ;;
    --no-pr) pr=0 ;;
    --key) key="${2:?--key needs a path}"; shift ;;
    --public-key) public_key="${2:?--public-key needs a value}"; shift ;;
    -h|--help) sed -n '2,18p' "$0"; exit 0 ;;
    *) echo "unknown option: $1" >&2; exit 2 ;;
  esac
  shift
done

die() { echo "error: $*" >&2; exit 1; }
say() { printf '\n== %s ==\n' "$*"; }
confirm() {
  [ "$yes" = 1 ] && return 0
  read -r -p "$1 [y/N] " answer
  [ "$answer" = y ] || [ "$answer" = Y ]
}
field() {
  sed -n "s/^$1 *= *\"\([^\"]*\)\".*/\1/p" plugin.toml | head -n 1
}

id="$(field id)"
version="$(field version)"
change_notes="$(field change-notes)"
publisher="${id%%.*}"
[ -n "$id" ] && [ -n "$version" ] && [ -n "$change_notes" ] \
  || die "plugin.toml is missing id, version, or change-notes"
tag="v$version"
package="dist/$id-$version.oiplugin"
key="${key:-$HOME/.config/openidea/keys/$publisher.key}"

say "preflight: $id $version"
for command in gh openidea-plugin npm git shasum; do
  command -v "$command" >/dev/null || die "$command is not installed"
done
gh auth status >/dev/null 2>&1 || die "gh is not logged in (run gh auth login)"
[ -f "$key" ] || die "no signing key at $key (create it with openidea-plugin keygen)"
mode="$(stat -f '%Lp' "$key" 2>/dev/null || stat -c '%a' "$key")"
[ "$mode" = 600 ] || die "$key must have mode 600 (chmod 600 '$key'; current mode: $mode)"
[ -z "$(git status --porcelain)" ] || die "the working tree has uncommitted changes"
branch="$(git rev-parse --abbrev-ref HEAD)"
[ "$branch" = main ] || die "release from main (currently on $branch)"
git fetch -q origin main --tags
[ "$(git rev-parse HEAD)" = "$(git rev-parse origin/main)" ] \
  || die "HEAD is not origin/main; push or pull first"
[ -z "$(git tag -l "$tag")" ] \
  && ! git ls-remote --exit-code --tags origin "refs/tags/$tag" >/dev/null 2>&1 \
  || die "tag $tag already exists; bump the version in plugin.toml"

repo="$(gh repo view --json nameWithOwner -q .nameWithOwner)"
visibility="$(gh repo view --json visibility -q .visibility)"
[ "$visibility" = PUBLIC ] || die "$repo is $visibility; the registry requires a public repository"

say "checks"
npm run check
npm test
openidea-plugin check .

say "sign"
mkdir -p dist
rm -f "$package"
openidea-plugin pack . --key "$key" --publisher "$publisher" --out "$package"
openidea-plugin check "$package"
sha="$(shasum -a 256 "$package" | cut -d' ' -f1)"
echo "sha256 $sha"

if [ "$dry" = 1 ]; then
  say "dry run complete; nothing was published"
  exit 0
fi

say "GitHub release"
echo "repository: $repo"
echo "tag: $tag"
echo "asset: $package"
confirm "Tag and publish this GitHub release?" || die "stopped before publishing"
git tag -a "$tag" -m "$id $version"
git push origin "$tag"
gh release create "$tag" "$package" --repo "$repo" --title "$version" --notes "$change_notes"

temp="$(mktemp -d)"
trap 'rm -rf "$temp"' EXIT
url="https://github.com/$repo/releases/download/$tag/$(basename "$package")"
gh release download "$tag" --repo "$repo" -p "$(basename "$package")" -D "$temp"
[ "$(shasum -a 256 "$temp/$(basename "$package")" | cut -d' ' -f1)" = "$sha" ] \
  || die "downloaded GitHub release asset does not match the signed package"
echo "verified release asset: $url"

[ "$pr" = 1 ] || { echo "registry PR skipped (--no-pr)"; exit 0; }

say "registry pull request"
me="$(gh api user -q .login)"
confirm "Open a registry pull request as $me?" || {
  echo "GitHub release is published; stopped before registry PR"; exit 0;
}
gh repo fork "$REGISTRY" --clone=false >/dev/null 2>&1 || true
work="$temp/registry"
gh repo clone "$me/openidea-plugins" "$work" -- --quiet
cd "$work"
git remote add upstream "https://github.com/$REGISTRY.git" 2>/dev/null || true
git fetch -q upstream main
registry_branch="$id-$version"
git checkout -q -B "$registry_branch" upstream/main

plugin_file="plugins/$id.toml"
publisher_file="publishers/$publisher.toml"
mkdir -p plugins publishers
if [ ! -f "$publisher_file" ]; then
  [ -n "$public_key" ] || die "publisher $publisher is not registered; rerun with --public-key '<keygen output>'"
  author="$(sed -n 's/^authors *= *\["\([^"]*\)".*/\1/p' "$here/plugin.toml" | head -n 1)"
  cat >"$publisher_file" <<EOF
name = "$author"
owners = ["$me"]
keys = ["$public_key"]
revoked-keys = []
EOF
fi

if [ -f "$plugin_file" ]; then
  grep -q "^version = \"$version\"" "$plugin_file" \
    && die "$plugin_file already lists version $version"
else
  printf 'repository = "https://github.com/%s"\n' "$repo" >"$plugin_file"
fi
cat >>"$plugin_file" <<EOF

[[versions]]
version = "$version"
package = "$url"
sha256 = "$sha"
EOF

git add "plugins/$id.toml" "publishers/$publisher.toml"
git commit -q -m "$id $version"
git push -q -u origin "$registry_branch" --force-with-lease
gh pr create --repo "$REGISTRY" --base main --head "$me:$registry_branch" \
  --title "$id $version" \
  --body "$change_notes

Package: $url
SHA-256: $sha
Signed with the $publisher publisher key.
Source: https://github.com/$repo/releases/tag/$tag"
