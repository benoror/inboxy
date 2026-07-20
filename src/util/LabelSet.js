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
 * Longest common leading run of segments shared by every segment list.
 */
function _longestCommonPrefix(segmentLists) {
    if (segmentLists.length === 0) {
        return [];
    }

    let prefix = segmentLists[0].slice();
    for (let i = 1; i < segmentLists.length; i++) {
        const segments = segmentLists[i];
        let j = 0;
        while (j < prefix.length && j < segments.length && prefix[j] === segments[j]) {
            j++;
        }
        prefix = prefix.slice(0, j);
        if (prefix.length === 0) {
            break;
        }
    }
    return prefix;
}

/**
 * Present a set of (possibly nested) labels compactly for a combined bundle's
 * title. When the labels share a common parent path, the parent is shown once
 * instead of being repeated on every label:
 *
 *   ['IH/AI', 'IH/AI/Bender']              -> 'IH/AI + Bender'
 *   ['IH/AI', 'IH/Kamek', 'IH/Spoint/Bro'] -> 'IH/(AI, Kamek, Spoint/Bro)'
 *   ['Crypto', 'Fin']                      -> 'Crypto + Fin'   (no shared parent)
 *
 * A single label (or a set with no shared parent) is just joined with ' + '.
 */
function formatLabelSetTitle(labels) {
    if (labels.length <= 1) {
        return labels.join(' + ');
    }

    const segmentLists = labels.map(l => l.split(NESTED_SEPARATOR));
    const common = _longestCommonPrefix(segmentLists);
    if (common.length === 0) {
        return labels.join(' + ');
    }

    const commonPath = common.join(NESTED_SEPARATOR);
    const tails = segmentLists.map(segments =>
        segments.slice(common.length).join(NESTED_SEPARATOR));

    // A tail is empty when that label *is* the shared parent. In that case show
    // the parent followed by each child's leaf ("IH/AI + Bender"); otherwise the
    // labels are siblings, so group their leaves under the parent ("IH/(a, b)").
    const parentIsMember = tails.some(t => t === '');
    const leaves = tails.filter(t => t !== '');

    return parentIsMember
        ? [commonPath, ...leaves].join(' + ')
        : `${commonPath}/(${leaves.join(', ')})`;
}

export { formatLabelSetTitle };
