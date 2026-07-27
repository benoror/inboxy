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
    bulk-archive button).
  - `containers/` — in-memory models of the bundled mail state.
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

## Notes

- `src/content.js` has a `DEBUG` flag that logs `inboxy-debug:` messages to the console.
- Gmail ships no stable API; the extension depends on DOM selectors in
  `src/util/Constants.js`. Gmail markup changes are the usual cause of breakage.
- This fork tracks its own release line, independent of upstream's versioning. As of
  `2.0.0`, `package.json` and `dist/manifest.json` share the same version; bump both
  together, tag `vX.Y.Z`, and record changes in `CHANGELOG.md`. The manifest version is
  what ships, and Chrome requires it to be plain dotted integers (no pre-release suffix).
