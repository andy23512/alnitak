import { dateToString } from './date.utils';

describe('dateToString', () => {
  it('formats local date and time as YYYYMMDD_HHmmss', () => {
    expect(dateToString(new Date(2024, 11, 25, 13, 45, 59))).toBe(
      '20241225_134559',
    );
  });

  it('pads single-digit month, day, hour, minute and second with zeros', () => {
    expect(dateToString(new Date(2024, 0, 2, 3, 4, 5))).toBe('20240102_030405');
  });

  it('uses 1-based months (January is 01, December is 12)', () => {
    expect(dateToString(new Date(2024, 0, 1, 0, 0, 0))).toContain('202401');
    expect(dateToString(new Date(2024, 11, 1, 0, 0, 0))).toContain('202412');
  });

  it('formats midnight as 000000', () => {
    expect(dateToString(new Date(2024, 5, 15, 0, 0, 0))).toBe(
      '20240615_000000',
    );
  });

  it('uses 24-hour time', () => {
    expect(dateToString(new Date(2024, 5, 15, 23, 59, 59))).toBe(
      '20240615_235959',
    );
  });
});
