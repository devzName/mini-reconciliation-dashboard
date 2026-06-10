/// <reference types="jest" />

import { formatDate, formatVnd } from '../app/lib/format';

describe('format helpers', () => {
  it('formats VND without decimals', () => {
    expect(formatVnd(1689196)).toBe('1.689.196 ₫');
    expect(formatVnd(-780804)).toBe('-780.804 ₫');
  });

  it('formats null dates as dash', () => {
    expect(formatDate(null)).toBe('-');
  });

  it('formats ISO dates for vi-VN display', () => {
    expect(formatDate('2026-05-31T17:00:00.000Z')).toBe('01/06/2026');
  });
});
