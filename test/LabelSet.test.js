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

import { formatLabelSetTitle } from '../src/util/LabelSet';

test('formatLabelSetTitle - single label is unchanged', () => {
    expect(formatLabelSetTitle(['IH/Kamek'])).toBe('IH/Kamek');
});

test('formatLabelSetTitle - no shared parent joins with " + "', () => {
    expect(formatLabelSetTitle(['Crypto', 'Fin'])).toBe('Crypto + Fin');
    expect(formatLabelSetTitle(['Fam/+ale', 'Trav'])).toBe('Fam/+ale + Trav');
});

test('formatLabelSetTitle - parent label plus its child shows parent once', () => {
    expect(formatLabelSetTitle(['IH/AI', 'IH/AI/Bender'])).toBe('IH/AI + Bender');
});

test('formatLabelSetTitle - parent with several children', () => {
    expect(formatLabelSetTitle(['IH/AI', 'IH/AI/Bender', 'IH/AI/Cortana']))
        .toBe('IH/AI + Bender + Cortana');
});

test('formatLabelSetTitle - siblings group leaves under the shared parent', () => {
    expect(formatLabelSetTitle(['IH/AI', 'IH/Kamek', 'IH/Spoint/Bro']))
        .toBe('IH/(AI, Kamek, Spoint/Bro)');
});

test('formatLabelSetTitle - factors multiple shared segments', () => {
    expect(formatLabelSetTitle(['A/B/x', 'A/B/y'])).toBe('A/B/(x, y)');
});

test('formatLabelSetTitle - partial segment overlap is not treated as shared', () => {
    // "AI" and "AInautics" are different segments, so no common parent
    expect(formatLabelSetTitle(['IH/AI', 'IH/AInautics']))
        .toBe('IH/(AI, AInautics)');
});
