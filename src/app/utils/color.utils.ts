function componentToHex(c: number) {
  const hex = c.toString(16);
  return hex.length == 1 ? '0' + hex : hex;
}

function rgbToHex(r: number, g: number, b: number) {
  return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

export function temperatureToColor(temp: number) {
  const m = window.Math;
  let r: number;
  let g: number;
  let b: number;

  temp /= 100;
  if (temp <= 66) {
    r = 255;
    g = m.min(m.max(99.4708025861 * m.log(temp) - 161.1195681661, 0), 255);
  } else {
    r = m.min(m.max(329.698727446 * m.pow(temp - 60, -0.1332047592), 0), 255);
    g = m.min(m.max(288.1221695283 * m.pow(temp - 60, -0.0755148492), 0), 255);
  }

  if (temp >= 66) {
    b = 255;
  } else if (temp <= 19) {
    b = 0;
  } else {
    b = temp - 10;
    b = m.min(m.max(138.5177312231 * m.log(b) - 305.0447927307, 0), 255);
  }

  return rgbToHex(Math.round(r), Math.round(g), Math.round(b));
}

export function rank(score: number) {
  const scoreLevels = [10, 20, 30, 40, 50, 60, 80, 100, 200, 500, Infinity];
  return scoreLevels.findIndex((s) => s > score);
}
