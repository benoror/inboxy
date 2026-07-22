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

import SelectiveBundling from '../src/bundling/SelectiveBundling';
import DomUtils from '../src/util/DomUtils';

/**
 * Build a SelectiveBundling with the given stored options. The chrome storage
 * callback fires synchronously here, so the instance is fully configured once
 * the constructor returns. combineLabels defaults to false so findRelevantLabels
 * returns the plain list of bundled labels rather than a single combined key.
 */
function makeBundling(stored) {
    global.chrome = {
        storage: { sync: { get: (keys, cb) => cb({ combineLabels: false, ...stored }) } },
    };
    return new SelectiveBundling();
}

function relevantLabels(bundling, messageLabels) {
    DomUtils.getLabelStrings = jest.fn().mockReturnValue(messageLabels);
    return bundling.findRelevantLabels({});
}

test('exclude list - "/*" wildcard excludes a label and its whole subtree', () => {
    const bundling = makeBundling({ exclude: true, labels: ['Newsletters/*'] });
    expect(relevantLabels(bundling, ['Newsletters', 'Newsletters/Tech', 'Newsletters/Tech/AI', 'Work']))
        .toEqual(['Work']);
});

test('include list - "/*" wildcard includes a label and its whole subtree', () => {
    const bundling = makeBundling({ exclude: false, labels: ['Newsletters/*'] });
    expect(relevantLabels(bundling, ['Newsletters/Tech', 'Newsletters/Tech/AI', 'Work']))
        .toEqual(['Newsletters/Tech', 'Newsletters/Tech/AI']);
});

test('wildcard matching is case-insensitive', () => {
    const bundling = makeBundling({ exclude: true, labels: ['newsletters/*'] });
    expect(relevantLabels(bundling, ['Newsletters/Tech', 'Work'])).toEqual(['Work']);
});

test('a plain (non-wildcard) entry still matches exactly, not the subtree', () => {
    const bundling = makeBundling({ exclude: true, labels: ['Newsletters'] });
    expect(relevantLabels(bundling, ['Newsletters', 'Newsletters/Tech']))
        .toEqual(['Newsletters/Tech']);
});

test('wildcard does not match a sibling sharing a prefix', () => {
    const bundling = makeBundling({ exclude: true, labels: ['News/*'] });
    expect(relevantLabels(bundling, ['Newsletters'])).toEqual(['Newsletters']);
});

test('blank list bundles everything when excluding', () => {
    const bundling = makeBundling({ exclude: true, labels: [] });
    expect(relevantLabels(bundling, ['Work', 'Newsletters/Tech']))
        .toEqual(['Work', 'Newsletters/Tech']);
});
