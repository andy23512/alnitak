import { cos, sin } from './math.utils';

describe('math utils', () => {
  it('computes the sine of an angle in degrees', () => {
    expect(sin(0)).toBeCloseTo(0, 10);
    expect(sin(30)).toBeCloseTo(0.5, 10);
    expect(sin(90)).toBeCloseTo(1, 10);
    expect(sin(270)).toBeCloseTo(-1, 10);
  });

  it('computes the cosine of an angle in degrees', () => {
    expect(cos(0)).toBeCloseTo(1, 10);
    expect(cos(60)).toBeCloseTo(0.5, 10);
    expect(cos(90)).toBeCloseTo(0, 10);
    expect(cos(180)).toBeCloseTo(-1, 10);
  });

  it('handles negative angles and angles above 360', () => {
    expect(sin(-90)).toBeCloseTo(-1, 10);
    expect(cos(360)).toBeCloseTo(1, 10);
    expect(sin(450)).toBeCloseTo(1, 10);
  });
});
