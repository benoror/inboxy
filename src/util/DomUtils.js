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

import { 
    GmailClasses, 
    Selectors,
} from './Constants';

const DomUtils = {
    findMessageRow: function(messageRowDescendant) {
        return messageRowDescendant.closest('tr');
    },

    extractDate: function(message) {
        var node = message.querySelector(Selectors.MESSAGE_DATE)
        return node ? node.title : null
    },

    isChecked: function(checkboxNode) {
        return checkboxNode.getAttribute('aria-checked') === 'true';
    },

    getLabelStrings: function(message) {
        return [...message.querySelectorAll(Selectors.LABELS)].map(l => l.title);
    },

    /**
     * Read the color that Gmail assigns to a label, by inspecting the label chip
     * matching labelTitle within the given message row.
     *
     * Returns { background, color } with the chip's inline colors, or null when
     * the label has no custom color (or the chip can't be found). Reading Gmail's
     * own inline colors keeps bundles consistent with the current Gmail theme.
     */
    getLabelColors: function(message, labelTitle) {
        const chip = [...message.querySelectorAll(Selectors.LABELS)]
            .find(l => l.title === labelTitle);
        if (!chip) {
            return null;
        }

        const container = chip.closest(Selectors.LABEL_CONTAINERS) || chip;
        let background = null;
        let color = null;
        for (const el of [container, ...container.querySelectorAll('*')]) {
            const style = el.style;
            if (!style) {
                continue;
            }
            if (!background && style.backgroundColor) {
                background = style.backgroundColor;
            }
            if (!color && style.color) {
                color = style.color;
            }
        }

        return background ? { background, color } : null;
    },

    htmlToElement: function(html) {
        var template = document.createElement('template');
        html = html.trim();
        template.innerHTML = html;
        return template.content.firstChild;
    }
}

export default DomUtils;