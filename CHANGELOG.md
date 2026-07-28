# Changelog

All notable changes to this fork of inboxy are documented here.

This is the [benoror](https://github.com/benoror/inboxy) fork of the (unmaintained)
[teresa-ou/inboxy](https://github.com/teresa-ou/inboxy). It tracks its own release line,
independent of upstream's versioning. The format is based on
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.0.0] - 2026-07-27

**Rebrand: inboxy → Inbundly.** Same bundling engine, new identity — plus a public site and
store-ready packaging. Remains a GPL-3.0 fork of `teresa-ou/inboxy` with upstream attribution
retained (see `NOTICE.md`).

### Added
- New **Inbundly** brand: logo/wordmark, a theme-flipping extension icon set (dark tile on
  light toolbars, light tile on dark, via `theme_icons`), and a Catppuccin-modernized palette.
- Redesigned **options** and **popup** pages with light + dark theming, self-contained
  (no remote web fonts), and a branded favicon on the options tab.
- **Marketing site** under `docs/` (GitHub Pages, `inbundly.com`): landing page + a
  **Privacy Policy** page (required for Chrome Web Store).
- `NOTICE.md` documenting modifications and dates per GPL-3.0 §5a; contributor copyright
  `Copyright (C) 2026 Ben Orozco` added alongside the retained `Copyright (C) 2020 Teresa Ou`.

### Changed
- Extension **name** → `Inbundly – Inbox Bundles for Gmail`; `homepage_url` → `inbundly.com`.
- Internal CSS/JS identifiers renamed `inboxy`→`inbundly` in lockstep (root `html.inbundly`
  class, `--inbundly-*` custom properties, `InbundlyClasses`, `InbundlyStyler`).
- `package.json`: `name` → `inbundly`, `license` → `GPL-3.0-only`, real `description`.

### Note
- **Breaking for external userstyles:** any Stylus/userstyle targeting the old `.inboxy`
  root class or `--inboxy-*` variables must switch to `.inbundly` / `--inbundly-*`.
- Saved data is preserved — the `customBundles` storage key is unchanged.

[3.0.0]: https://github.com/benoror/inboxy/releases/tag/v3.0.0

## [2.1.0] - 2026-07-27

### Added
- **Custom bundles** — select any messages in Gmail and click the floating
  "Bundle selected" button to group them on the fly, with no Gmail label required.
  Custom bundles override label-based grouping, are kept even when they hold a single
  message, stick across reloads, and sync to your other signed-in Chrome browsers.
  Selecting messages already in a bundle turns the button into "Remove from bundle".
  Manage (rename/delete) them under Options → Custom bundles.
  - Keyed by Gmail's stable `data-legacy-thread-id` and persisted in
    `chrome.storage.sync` (`containers/CustomBundles.js`); the bundle key is the user's
    name prefixed with `0x1E` so it flows through the label-keyed pipeline without
    colliding with a real label or a combined-label (`0x1F`) key.

[2.1.0]: https://github.com/benoror/inboxy/releases/tag/v2.1.0

## [2.0.0] - 2026-07-27

First feature release of the fork. Forked from upstream v1.6.5 and brings Gmail bundling
closer to the original Google Inbox experience, plus the tooling and tests to maintain it.

### Added
- **Label-color bundles** — tint each bundle to match its Gmail label color, in one of
  two styles: a subtle, theme-aware background fill, or an accent bar + text only. The
  color runs the full height of open bundles.
- **Opt-in Stylus / Catppuccin color-matching** — snap bundle colors to a detected
  Catppuccin palette (`src/util/ThemePalette.js`).
- **Combine labels** — optionally bundle by the whole *set* of a thread's labels, so
  threads labeled `A + B` form their own bundle distinct from just `A`. Combined-bundle
  titles are compacted by factoring shared parent labels (`src/util/LabelSet.js`).
- **Priority bundles** — force chosen labels (or label sets) to always bundle together
  regardless of a thread's other labels. Join with `+` to require several; add a trailing
  `/*` to include a label's whole sub-label subtree; first matching rule wins.
- **`/*` subtree wildcard in the include/exclude label list** — the same multi-level,
  parent-inclusive wildcard now works in the "Only bundle…/Bundle all except…" list,
  reusing `matchLabelPattern`.
- **Skip single-item bundles** option (on by default) — labels with a single thread show
  as regular messages.
- Options to **hide the pinned-messages toggle** and the **bundle archive-all button**.
- `npm run watch` webpack script, a `CLAUDE.md` project guide, and new Jest suites
  (`ThemePalette`, `LabelSet`, `SelectiveBundling`, `DomUtils`, `DateDivider`).

### Changed
- combine-labels and bundle-colors are enabled by default.
- Tightened vertical spacing of expanded bundles.
- Fork-aware README and Options → Help / Get-started copy.
- `package.json` and `dist/manifest.json` now share a single version (2.0.0), starting
  this fork's own release line.
- Jest ignores `.claude/` worktrees so nested worktrees don't pollute test runs.

### Fixed
- Crash when a message row has no date cell.
- Raw NUL byte in the combined-label separator.

[2.0.0]: https://github.com/benoror/inboxy/releases/tag/v2.0.0
