<p align="center">
  <img width="650" src="https://github.com/teresa-ou/inboxy/blob/master/images/inboxy-illustration.png" alt="Illustration of inboxy">
</p>

# inboxy: Google Inbox-style bundles for Gmail

> **Fork notice:** This is [benoror/inboxy](https://github.com/benoror/inboxy), a maintained fork of
> [teresa-ou/inboxy](https://github.com/teresa-ou/inboxy) with additional options for combined-label
> bundles, bundle coloring, and Stylus theme-matching. It is not published to the Chrome or Firefox
> stores — load it as an unpacked extension from `dist/`.

inboxy is a browser extension that bundles together your email messages and makes it easier to manage
your inbox.

## Features

* Messages with the same label are bundled together in your inbox
* Optionally bundle by the whole *set* of labels, so threads sharing labels
  A + B form their own bundle, colored by the first label (enable in Options)
* Priority bundles: force chosen labels (or label sets) to always group
  together regardless of a thread's other labels — e.g. `Bank`, `School/*`
  (subtree), or `Work + Urgent`; first matching rule wins (configure in Options)
* Custom bundles: select any messages in Gmail and click the floating
  "Bundle selected" button to group them on the fly — no Gmail label needed.
  Custom bundles override label-based grouping, stick across reloads, and sync
  to your other signed-in Chrome browsers. Manage or delete them under
  Options → Custom bundles
* Single-item bundles are skipped by default, shown as regular messages
* Archive all bundled messages on the current page quickly
* Star a message to pin it outside of its bundle
* Intuitive date headings
* Supports light and dark themes
* Optionally color bundles to match their Gmail label color — either a subtle
  background tint or just the left accent bar and text, both theme-aware
  (enable in Options)
* The pinned-messages toggle and per-bundle archive-all button are optional
  (hidden by default; enable them under Options → Features)
* Optional Stylus userstyle color-matching: when enabled, bundle colors are
  snapped to a detected Catppuccin theme's palette (Options → Bundle colors →
  Stylus; off by default)

For more info on the original project, visit https://www.inboxymail.com.

## Setup

inboxy uses webpack to bundle js files:

```bash
# Install dependencies
npm install

# Build with webpack to create dist/content.js
npm run build

# Rebuild automatically on every save (development)
npm run watch
```

The `dist` directory can then be loaded as an [unpacked extension](https://developer.chrome.com/extensions/getstarted).

## Feedback

Feel free to [send feedback](https://github.com/benoror/inboxy/issues) by filing an issue.

## Acknowledgements

* [material.io](https://material.io/resources/icons/): Icons in [dist/assets/](https://github.com/teresa-ou/inboxy/tree/master/dist/assets/), [dist/options/assets/](https://github.com/teresa-ou/inboxy/tree/master/dist/options/assets/), and [dist/popup/assets/](https://github.com/teresa-ou/inboxy/tree/master/dist/popup/assets/) are modified versions of icons from material.io. The original material.io icons are licensed under [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0.html).
* [Nova](https://www.streamlineicons.com/nova/index.html): The inboxy logo is modified from a Nova icon.

## License

[GPL-3.0](https://github.com/benoror/inboxy/blob/master/COPYING), Copyright (C) 2020 [Teresa Ou](https://github.com/teresa-ou).
Fork maintained by [benoror](https://github.com/benoror).
