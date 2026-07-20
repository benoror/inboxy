// inboxy: Chrome extension for Google Inbox-style bundles in Gmail.
// Copyright (C) 2020  Teresa Ou

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

const NESTED_SEPARATOR = '/';

/**
 * Build a trie of the labels' path segments. Each node is
 * { segment, isLabel, children } where isLabel marks a node at which a label
 * actually ends, and children is an insertion-ordered Map of segment -> node.
 */
function _buildForest(labels) {
    const root = new Map();
    for (const label of labels) {
        let level = root;
        let node = null;
        for (const segment of label.split(NESTED_SEPARATOR)) {
            if (!level.has(segment)) {
                level.set(segment, { segment, isLabel: false, children: new Map() });
            }
            node = level.get(segment);
            level = node.children;
        }
        if (node) {
            node.isLabel = true;
        }
    }
    return root;
}

function _renderNode(node) {
    const children = [...node.children.values()];
    if (children.length === 0) {
        return node.segment;
    }

    const childStrings = children.map(_renderNode);
    if (node.isLabel) {
        // The node is itself a label *and* a parent of others; every one of
        // them is a real label on the thread, so list them as peers.
        return [node.segment, ...childStrings].join(' + ');
    }

    // Pure parent: group its children under it, shown once.
    const inner = childStrings.length === 1
        ? childStrings[0]
        : `(${childStrings.join(', ')})`;
    return `${node.segment}${NESTED_SEPARATOR}${inner}`;
}

/**
 * Present a set of (possibly nested) labels compactly for a combined bundle's
 * title. Any shared parent path is shown once instead of being repeated,
 * grouping is done per shared parent (not just a single global prefix):
 *
 *   ['IH/AI', 'IH/AI/Bender']                   -> 'IH/AI + Bender'
 *   ['IH/AI', 'IH/Kamek', 'IH/Spoint/Bro']      -> 'IH/(AI, Kamek, Spoint/Bro)'
 *   ['Fam/+ale', 'Fam/Contab', 'Fin', 'US/x']   -> 'Fam/(+ale, Contab) + Fin + US/x'
 *   ['Crypto', 'Fin']                           -> 'Crypto + Fin'  (no shared parent)
 */
function formatLabelSetTitle(labels) {
    if (labels.length <= 1) {
        return labels.join(' + ');
    }

    return [..._buildForest(labels).values()].map(_renderNode).join(' + ');
}

export { formatLabelSetTitle };
