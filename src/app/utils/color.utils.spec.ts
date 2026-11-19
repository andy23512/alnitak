import { rank, temperatureToColor } from './color.utils';

describe('rank', () => {
  it('returns the index of the first level above the score', () => {
    expect(rank(0)).toBe(0);
    expect(rank(9)).toBe(0);
    expect(rank(15)).toBe(1);
    expect(rank(55)).toBe(5);
    expect(rank(150)).toBe(8);
    expect(rank(499)).toBe(9);
  });

  it('moves up exactly at each level boundary', () => {
    const boundaries = [10, 20, 30, 40, 50, 60, 80, 100, 200, 500];
    boundaries.forEach((b, i) => {
      expect(rank(b - 1)).toBe(i);
      expect(rank(b)).toBe(i + 1);
    });
  });

  it('puts scores of 500 and above (and Infinity-like scores) in the top rank', () => {
    expect(rank(500)).toBe(10);
    expect(rank(1_000_000)).toBe(10);
  });

  it('puts negative scores in the lowest rank', () => {
    expect(rank(-5)).toBe(0);
  });
});

describe('temperatureToColor', () => {
  const channels = (hex: string) => [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ];

  it('returns a #rrggbb string', () => {
    expect(temperatureToColor(5000)).toMatch(/^#[0-9a-f]{6}$/);
  });

  it('gives pure white at 6600K', () => {
    expect(temperatureToColor(6600)).toBe('#ffffff');
  });

  it('gives a warm orange at 2000K: full red, almost no blue', () => {
    const [r, g, b] = channels(temperatureToColor(2000));
    expect(r).toBe(255);
    expect(g).toBeGreaterThan(100);
    expect(g).toBeLessThan(180);
    expect(b).toBeLessThan(20);
  });

  it('gives no blue at or below 1900K', () => {
    expect(channels(temperatureToColor(1900))[2]).toBe(0);
    expect(channels(temperatureToColor(1000))[2]).toBe(0);
  });

  it('keeps red at 255 up to 6600K and full blue from 6600K', () => {
    [1500, 3000, 5000, 6600].forEach((t) =>
      expect(channels(temperatureToColor(t))[0]).toBe(255),
    );
    expect(channels(temperatureToColor(6600))[2]).toBe(255);
    expect(channels(temperatureToColor(10000))[2]).toBe(255);
  });

  it('turns bluish above 6600K: red drops below 255 and blue stays 255', () => {
    const [r, , b] = channels(temperatureToColor(10000));
    expect(r).toBeLessThan(255);
    expect(b).toBe(255);
  });

  it('gets less red and more blue as the temperature rises', () => {
    const warm = channels(temperatureToColor(3000));
    const cool = channels(temperatureToColor(9000));
    expect(cool[0]).toBeLessThan(warm[0]);
    expect(cool[2]).toBeGreaterThan(warm[2]);
  });

  it('clamps every channel to 0-255 for extreme temperatures', () => {
    [100, 1000, 40000, 1_000_000].forEach((t) => {
      const hex = temperatureToColor(t);
      expect(hex).toMatch(/^#[0-9a-f]{6}$/);
      channels(hex).forEach((c) => {
        expect(c).toBeGreaterThanOrEqual(0);
        expect(c).toBeLessThanOrEqual(255);
      });
    });
  });
});
