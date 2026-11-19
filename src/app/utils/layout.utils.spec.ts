import { TranslateService } from '@ngx-translate/core';
import {
  ACTIONS,
  ActionType,
  KeyboardLayout,
  Layer,
  WSKAction,
} from 'tangent-cc-lib';
import { ACTION_REPRESENTATION_ICON_MAP } from '../data/action-representation-icon-map';
import { toTitleCase } from './case.utils';
import {
  convertPositionCodeToKeyNotation,
  convertPositionCodeToText,
  getChordKeyFromActionCode,
  getHoldKeys,
} from './layout.utils';

const wskActions = ACTIONS.filter(
  (a): a is WSKAction => a.type === ActionType.WSK,
);
const wskAction = wskActions.find((a) => !a.withShift)!;
const wskShiftAction = wskActions.find(
  (a) => a.withShift && a.keyCode === wskAction.keyCode,
)!;

function layoutWith(
  keyCode: WSKAction['keyCode'],
  key: Record<string, { type: 'text' | 'dead-key'; value: string }>,
): KeyboardLayout {
  return {
    id: 'test',
    name: 'Test',
    reference: '',
    layout: { [keyCode]: key },
  } as unknown as KeyboardLayout;
}

describe('getChordKeyFromActionCode', () => {
  it('returns null without a keyboard layout', () => {
    expect(getChordKeyFromActionCode(wskAction.codeId, null)).toBeNull();
  });

  it('maps a WSK action to the unmodified character of the layout', () => {
    const layout = layoutWith(wskAction.keyCode, {
      unmodified: { type: 'text', value: 'x' },
      withShift: { type: 'text', value: 'X' },
    });
    expect(getChordKeyFromActionCode(wskAction.codeId, layout)).toEqual({
      type: 'character',
      value: 'x',
    });
  });

  it('uses the shifted character for a shift WSK action', () => {
    const layout = layoutWith(wskAction.keyCode, {
      unmodified: { type: 'text', value: 'x' },
      withShift: { type: 'text', value: 'X' },
    });
    expect(getChordKeyFromActionCode(wskShiftAction.codeId, layout)).toEqual({
      type: 'character',
      value: 'X',
    });
  });

  it('returns null when the layout has no such key', () => {
    const layout = { layout: {} } as unknown as KeyboardLayout;
    expect(getChordKeyFromActionCode(wskAction.codeId, layout)).toBeNull();
  });

  it('returns null when the layout lacks the modifier variant', () => {
    const layout = layoutWith(wskAction.keyCode, {
      unmodified: { type: 'text', value: 'x' },
    });
    expect(getChordKeyFromActionCode(wskShiftAction.codeId, layout)).toBeNull();
  });

  it('returns null for a dead key', () => {
    const layout = layoutWith(wskAction.keyCode, {
      unmodified: { type: 'dead-key', value: '^' },
    });
    expect(getChordKeyFromActionCode(wskAction.codeId, layout)).toBeNull();
  });

  it('maps an action with a representation icon to that icon', () => {
    const [code, icon] = Array.from(
      ACTION_REPRESENTATION_ICON_MAP.entries(),
    )[0];
    const layout = layoutWith(wskAction.keyCode, {});
    expect(getChordKeyFromActionCode(code, layout)).toEqual({
      type: 'icon',
      value: icon,
    });
  });

  it('returns null for an action that is neither WSK nor has an icon', () => {
    const layout = layoutWith(wskAction.keyCode, {});
    expect(getChordKeyFromActionCode(-1, layout)).toBeNull();
  });
});

describe('convertPositionCodeToKeyNotation', () => {
  it('uses L for codes below 45 and R from 45', () => {
    expect(convertPositionCodeToKeyNotation(0)[0]).toBe('L');
    expect(convertPositionCodeToKeyNotation(44)[0]).toBe('L');
    expect(convertPositionCodeToKeyNotation(45)[0]).toBe('R');
    expect(convertPositionCodeToKeyNotation(89)[0]).toBe('R');
  });

  it('names the switch from the position code in groups of 5', () => {
    const switches = ['1bb', '1b', '1', '2', '3', '4', '5', '3b', '4b'];
    switches.forEach((sw, i) => {
      expect(convertPositionCodeToKeyNotation(i * 5)).toBe(`L${sw}D`);
      expect(convertPositionCodeToKeyNotation(45 + i * 5)).toBe(`R${sw}D`);
    });
  });

  it('maps the five directions on the left hand', () => {
    expect(
      [0, 1, 2, 3, 4].map((d) => convertPositionCodeToKeyNotation(d)),
    ).toEqual(['L1bbD', 'L1bbE', 'L1bbN', 'L1bbW', 'L1bbS']);
  });

  it('mirrors east and west on the right hand', () => {
    expect(
      [0, 1, 2, 3, 4].map((d) => convertPositionCodeToKeyNotation(45 + d)),
    ).toEqual(['R1bbD', 'R1bbW', 'R1bbN', 'R1bbE', 'R1bbS']);
  });

  it('gives known examples', () => {
    expect(convertPositionCodeToKeyNotation(17)).toBe('L2N');
    expect(convertPositionCodeToKeyNotation(89)).toBe('R4bS');
  });
});

describe('convertPositionCodeToText', () => {
  const translate = {
    instant: (key: string, params?: Record<string, string>) =>
      params
        ? `${params['hand']}|${params['switch']}|${params['direction']}`
        : key,
  } as unknown as TranslateService;
  const text = (code: number) => convertPositionCodeToText(code, translate);

  it('translates hand, switch and direction into the guide text and title-cases it', () => {
    expect(text(0)).toBe(
      toTitleCase('hand.left|switch.thumb-back|direction.down'),
    );
  });

  it('uses the right hand from code 45', () => {
    expect(text(44)).toContain(toTitleCase('hand.left').slice(0, 4));
    expect(text(45)).toBe(
      toTitleCase('hand.right|switch.thumb-back|direction.down'),
    );
  });

  it('names all nine switches in order', () => {
    const names = [
      'thumb-back',
      'thumb-middle',
      'thumb-front',
      'index',
      'middle',
      'ring',
      'pinky',
      'middle-secondary',
      'ring-secondary',
    ];
    names.forEach((n, i) =>
      expect(text(i * 5)).toBe(
        toTitleCase(`hand.left|switch.${n}|direction.down`),
      ),
    );
  });

  it('maps left-hand directions and mirrors east and west for the right hand', () => {
    const left = ['down', 'east', 'north', 'west', 'south'];
    const right = ['down', 'west', 'north', 'east', 'south'];
    left.forEach((d, i) =>
      expect(text(i)).toBe(
        toTitleCase(`hand.left|switch.thumb-back|direction.${d}`),
      ),
    );
    right.forEach((d, i) =>
      expect(text(45 + i)).toBe(
        toTitleCase(`hand.right|switch.thumb-back|direction.${d}`),
      ),
    );
  });

  it('asks the translate service for the guide text with all three parts', () => {
    const instant = jasmine
      .createSpy('instant')
      .and.callFake((key: string) => key);
    convertPositionCodeToText(7, { instant } as unknown as TranslateService);
    expect(instant).toHaveBeenCalledWith('layout-text-guide', {
      hand: 'hand.left',
      switch: 'switch.thumb-middle',
      direction: 'direction.north',
    });
  });
});

describe('getHoldKeys', () => {
  it('holds nothing on the primary layer without modifiers', () => {
    expect(getHoldKeys(Layer.Primary, false, false)).toEqual([]);
  });

  it('holds num-shift on the secondary layer', () => {
    expect(getHoldKeys(Layer.Secondary, false, false)).toEqual(['num-shift']);
  });

  it('holds fn on the tertiary layer', () => {
    expect(getHoldKeys(Layer.Tertiary, false, false)).toEqual(['fn']);
  });

  it('holds flag-shift on the quaternary layer', () => {
    expect(getHoldKeys(Layer.Quaternary, false, false)).toEqual(['flag-shift']);
  });

  it('adds shift and alt-gr after the layer key', () => {
    expect(getHoldKeys(Layer.Tertiary, true, true)).toEqual([
      'fn',
      'shift',
      'alt-gr',
    ]);
  });

  it('adds shift alone or alt-gr alone', () => {
    expect(getHoldKeys(Layer.Primary, true, false)).toEqual(['shift']);
    expect(getHoldKeys(Layer.Primary, false, true)).toEqual(['alt-gr']);
  });
});
