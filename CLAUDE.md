# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Working agreements

- **Commit atomic changes eagerly.** If a change is small, isolated, semantic, and
  atomic, `git commit` it right away with a meaningful message. If in doubt, ask first.
- **Keep documentation current.** Whenever a change makes it relevant, update the
  README, this file, and any other docs or agentic files so they stay accurate.

## What this is

`inboxy` is a Manifest V3 browser extension (Chrome + Firefox) that recreates Google
Inbox-style bundles in Gmail. It's a fork of
[teresa-ou/inboxy](https://github.com/teresa-ou/inboxy) — the upstream project is no
longer actively maintained. Licensed GPL-3.0.

The extension runs as a content script injected into `mail.google.com`, observing
Gmail's DOM and restructuring the message list into collapsible bundles by label.

## Layout

- `src/` — all editable JavaScript source (ES modules). Entry point: `src/content.js`.
  - `bundling/` — core logic that groups messages into bundles and toggles them
    (`Bundler`, `BundleToggler`, `DateGrouper`, `SelectiveBundling`, `InboxyStyler`).
  - `handlers/` — `MutationObserver`-based watchers that react to Gmail navigation,
    rerenders, starring, and theme changes.
  - `components/` — DOM builders for injected UI (bundle rows, dividers, toggles, the
    bulk-archive button, the floating "Bundle selected" custom-bundle control).
  - `containers/` — in-memory models of the bundled mail state (`BundledMail`,
    `Bundle`, and `CustomBundles` — the persisted, thread-id-keyed custom bundles).
  - `util/` — `Constants.js` (Gmail DOM selectors + inboxy CSS classes) and DOM helpers.
- `dist/` — the loadable unpacked extension. Contains committed static assets
  (`manifest.json`, `style.css`, `background.js`, `popup/`, `options/`, `icons/`,
  `assets/`) plus the webpack-built `content.js`.
- `test/` — Jest tests.

## Build & develop

Webpack bundles **only** `src/content.js` → `dist/content.js`. Everything else in
`dist/` is committed by hand.

```bash
npm install       # one-time: install build deps
npm run build     # one-off build → dist/content.js
npm run watch     # rebuild automatically on save (use this while iterating)
npm test          # Jest tests
```

`dist/content.js` is gitignored (build artifact) — do not commit it.

### Loading in Chrome

1. `chrome://extensions` → enable **Developer mode**.
2. **Load unpacked** → select the `dist/` folder.
3. Open `mail.google.com`.

After a rebuild: click **reload ↻** on the inboxy card in `chrome://extensions`, then
refresh Gmail.

## Releasing

This fork runs its **own release line**, independent of upstream teresa-ou/inboxy — we do
**not** propose changes upstream. PRs, tags, and releases all live on `benoror/inboxy`.

Conventions:

- **Semantic versioning**, tags prefixed `v` (e.g. `v2.0.0`). `package.json` and
  `dist/manifest.json` share one version — always bump them together.
- The **manifest version is what ships** and Chrome requires plain dotted integers
  (1–4 groups, each 0–65535); **no** pre-release suffixes like `-beta` there. Tags/release
  names may be richer, but keep the numeric core in sync with the manifest.
- Every release gets a `CHANGELOG.md` entry ([Keep a Changelog](https://keepachangelog.com/)
  format: Added / Changed / Fixed).

Flow for landing a feature branch and cutting a release:

1. **PR into the fork.** Open the PR against `benoror/inboxy`'s `master` explicitly —
   `gh` defaults to the upstream parent, so always pass `--repo benoror/inboxy`:
   ```bash
   gh pr create --repo benoror/inboxy --base master --head <feature-branch>
   ```
   Prefer a **merge commit** (`gh pr merge <n> --repo benoror/inboxy --merge`) to preserve
   the branch's atomic-commit history.
2. **Release commit on `master`** (after merge): bump the version in both
   `dist/manifest.json` and `package.json`, add the `CHANGELOG.md` section, commit as
   `Release vX.Y.Z`.
3. **Tag & push:** `git tag -a vX.Y.Z -m "inboxy vX.Y.Z (benoror fork)" && git push origin vX.Y.Z`.
4. **GitHub Release:** `gh release create vX.Y.Z --repo benoror/inboxy --latest --notes-file <notes>`
   (notes = that version's changelog section).

> Running `npm test` from inside a `.claude/worktrees/…` path reports "0 tests": `master`'s
> Jest config ignores `/.claude/`, which matches the worktree's own path. Run tests from the
> main checkout, or override: `npx jest --testPathIgnorePatterns=/node_modules/`.

## Notes

- `src/content.js` has a `DEBUG` flag that logs `inboxy-debug:` messages to the console.
- Gmail ships no stable API; the extension depends on DOM selectors in
  `src/util/Constants.js`. Gmail markup changes are the usual cause of breakage.
- **Custom bundles** (ad-hoc groupings with no Gmail label) are keyed by Gmail's
  stable `data-legacy-thread-id` (read via `DomUtils.getThreadId`) and persisted
  in `chrome.storage.sync` by `containers/CustomBundles.js`. Their bundle key is
  the user's name prefixed with `0x1E` (`util/CustomBundleKey.js`) so it flows
  through the label-keyed pipeline without colliding with a real label or a
  combined-label (`0x1F`) key. `SelectiveBundling` checks custom membership first
  (custom wins over priority rules and labels). Membership changes trigger a
  Gmail refresh (via `chrome.storage.onChanged` in `content.js`) so bundling
  re-runs; this same path applies changes synced from other devices. `options/`
  reads/writes the same storage key directly for management.
- Versioning, tags, and releases are covered under **Releasing** above.
