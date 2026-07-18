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

import DomUtils from '../util/DomUtils';
import { LABEL_SET_SEPARATOR } from '../util/Constants';

/**
 * Identifies the labels that have bundling enabled, according to the user's options.
 * By default, all labels are bundled.
 */
class SelectiveBundling {
    constructor() {
        const self = this;
        chrome.storage.sync.get(
            ['exclude', 'labels', 'combineLabels'],
            ({ exclude = true, labels = [], combineLabels = false }) => {
                self.exclude = exclude;
                self.labels = new Set(labels.map(s => s.toLowerCase()));
                self.combineLabels = combineLabels;
            });
    }

    /**
     * Returns the bundle key(s) a message belongs to. Normally this is the list
     * of its bundling-enabled labels (one bundle per label). When combineLabels
     * is on, the whole set of labels is joined into a single key, so a distinct
     * combination of labels forms its own bundle.
     */
    findRelevantLabels(message) {
        const messageLabels = DomUtils.getLabelStrings(message);

        const relevant = this.exclude
            ? messageLabels.filter(l => !this.labels.has(l.toLowerCase()))
            : messageLabels.filter(l => this.labels.has(l.toLowerCase()));

        if (this.combineLabels) {
            return relevant.length ? [relevant.join(LABEL_SET_SEPARATOR)] : [];
        }
        return relevant;
    }
}

export default SelectiveBundling;