import { TranslateService } from '@ngx-translate/core';
import { ACTIONS, ActionType, KeyboardLayout, Layer } from 'tangent-cc-lib';
import { ACTION_REPRESENTATION_ICON_MAP } from '../data/action-representation-icon-map';
import { ChordKey } from '../models/chord.models';
import { toTitleCase } from './case.utils';

export function getChordKeyFromActionCode(
  actionCode: number,
  keyboardLayout: KeyboardLayout | null,
): ChordKey | null {
  if (!keyboardLayout) {
    return null;
  }
  const action = ACTIONS.find((a) => a.codeId === actionCode);
  if (action?.type === ActionType.WSK && action.keyCode) {
    const keyboardLayoutKey = keyboardLayout.layout[action.keyCode];
    const modifier = action.withShift ? 'withShift' : 'unmodified';
    const character = keyboardLayoutKey?.[modifier];
    if (character?.type !== 'text') {
      return null;
    }
    return { type: 'character', value: character.value };
  } else {
    const icon = ACTION_REPRESENTATION_ICON_MAP.get(actionCode);
    if (!icon) {
      return null;
    }
    return { type: 'icon', value: icon };
  }
}

export function convertPositionCodeToText(
  positionCode: number,
  translateService: TranslateService,
) {
  const hand = positionCode < 45 ? 'hand.left' : 'hand.right';
  const sw =
    'switch.' +
    [
      'thumb-back',
      'thumb-middle',
      'thumb-front',
      'index',
      'middle',
      'ring',
      'pinky',
      'middle-secondary',
      'ring-secondary',
    ][Math.floor((positionCode % 45) / 5)];
  const direction = (
    hand === 'hand.left'
      ? [
          'direction.down',
          'direction.east',
          'direction.north',
          'direction.west',
          'direction.south',
        ]
      : [
          'direction.down',
          'direction.west',
          'direction.north',
          'direction.east',
          'direction.south',
        ]
  )[positionCode % 5];
  return toTitleCase(
    translateService.instant('layout-text-guide', {
      hand: translateService.instant(hand),
      switch: translateService.instant(sw),
      direction: translateService.instant(direction),
    }),
  );
}

export function convertPositionCodeToKeyNotation(positionCode: number) {
  const hand = positionCode < 45 ? 'L' : 'R';
  const sw = ['1bb', '1b', '1', '2', '3', '4', '5', '3b', '4b'][
    Math.floor((positionCode % 45) / 5)
  ];
  const direction = (
    hand === 'L' ? ['D', 'E', 'N', 'W', 'S'] : ['D', 'W', 'N', 'E', 'S']
  )[positionCode % 5];
  return [hand, sw, direction].join('');
}

export function getHoldKeys(
  layer: Layer,
  shiftKey: boolean,
  altGraphKey: boolean,
) {
  const holdKeys: ('num-shift' | 'fn' | 'flag-shift' | 'shift' | 'alt-gr')[] =
    [];
  switch (layer) {
    case Layer.Secondary:
      holdKeys.push('num-shift');
      break;
    case Layer.Tertiary:
      holdKeys.push('fn');
      break;
    case Layer.Quaternary:
      holdKeys.push('flag-shift');
  }
  if (shiftKey) {
    holdKeys.push('shift');
  }
  if (altGraphKey) {
    holdKeys.push('alt-gr');
  }
  return holdKeys;
}
