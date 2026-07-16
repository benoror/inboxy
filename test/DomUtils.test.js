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

import DomUtils from '../src/util/DomUtils';

/**
 * Build a message row containing a Gmail-style label chip, mirroring the
 * `.ar.as > .at[title] > .au > .av` structure that getLabelColors reads from.
 */
function messageWithLabel(title, { background, color } = {}) {
    const message = document.createElement('tr');
    const container = document.createElement('div');
    container.className = 'ar as';

    const chip = document.createElement('div');
    chip.className = 'at';
    chip.title = title;
    if (background) {
        chip.style.backgroundColor = background;
    }

    const inner = document.createElement('div');
    inner.className = 'au';
    const text = document.createElement('div');
    text.className = 'av';
    if (color) {
        text.style.color = color;
    }
    text.textContent = title;

    inner.appendChild(text);
    chip.appendChild(inner);
    container.appendChild(chip);
    message.appendChild(container);
    return message;
}

//
// getLabelColors
//

test('getLabelColors - reads background and text color from the label chip', () => {
    const message = messageWithLabel('Work', {
        background: 'rgb(251, 233, 231)',
        color: 'rgb(0, 0, 0)',
    });

    expect(DomUtils.getLabelColors(message, 'Work')).toEqual({
        background: 'rgb(251, 233, 231)',
        color: 'rgb(0, 0, 0)',
    });
});

test('getLabelColors - returns null when the label has no custom color', () => {
    const message = messageWithLabel('Work');
    expect(DomUtils.getLabelColors(message, 'Work')).toBeNull();
});

test('getLabelColors - returns null when the label is not present', () => {
    const message = messageWithLabel('Work', { background: 'rgb(1, 2, 3)' });
    expect(DomUtils.getLabelColors(message, 'School')).toBeNull();
});

test('getLabelColors - matches the correct label among several', () => {
    const message = document.createElement('tr');
    message.appendChild(
        messageWithLabel('Work', { background: 'rgb(251, 233, 231)' }).firstChild);
    message.appendChild(
        messageWithLabel('School', { background: 'rgb(200, 230, 201)' }).firstChild);

    expect(DomUtils.getLabelColors(message, 'School')).toEqual({
        background: 'rgb(200, 230, 201)',
        color: null,
    });
});
