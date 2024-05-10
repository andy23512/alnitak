import { ACTIONS } from '../data/actions';
import {
  CharaChorderOneLayer,
  CharacterDeviceKey,
  DeviceLayout,
} from '../models/device-layout.models';
import {
  CharacterActionCode,
  CharacterKeyCode,
  CharacterKeyCodeMap,
  KeyBoardLayout,
  KeyboardLayoutKey,
} from '../models/keyboard-layout.models';
import { WritingSystemKeyCode } from '../models/writing-system-key-code.models';

export function convertKeyboardLayoutToCharacterKeyCodeMap(
  keyboardLayout: KeyBoardLayout | null,
): CharacterKeyCodeMap {
  if (!keyboardLayout) {
    return new Map();
  }
  return new Map(
    (
      Object.entries(keyboardLayout.layout) as [
        WritingSystemKeyCode,
        Partial<KeyboardLayoutKey>,
      ][]
    )
      .map(([keyCode, keyboardLayoutKey]) =>
        keyboardLayoutKey
          ? (
              Object.entries(keyboardLayoutKey) as [
                keyof KeyboardLayoutKey,
                string,
              ][]
            ).map(
              ([modifier, character]) =>
                [
                  character,
                  {
                    keyCode,
                    shiftKey:
                      modifier === 'withShift' ||
                      modifier === 'withShiftAltGraph',
                    altGraphKey:
                      modifier === 'withAltGraph' ||
                      modifier === 'withShiftAltGraph',
                  },
                ] as const,
            )
          : [],
      )
      .flat(),
  );
}

export function getCharacterKeyCodeFromCharacter(
  character: string,
  characterKeyCodeMap: CharacterKeyCodeMap,
) {
  return characterKeyCodeMap.get(character);
}

export function getCharacterActionCodeFromCharacterKeyCode({
  keyCode,
  shiftKey,
  altGraphKey,
}: CharacterKeyCode) {
  const action = ACTIONS.find((a) => a.writingSystemKeyCode === keyCode);
  if (!action) {
    return null;
  }
  return {
    actionCode: action.codeId,
    shiftKey,
    altGraphKey,
  };
}

export function getCharacterDeviceKeysFromActionCode(
  { actionCode, shiftKey, altGraphKey }: CharacterActionCode,
  deviceLayout: DeviceLayout | null,
): CharacterDeviceKey[] | null {
  if (!deviceLayout) {
    return null;
  }
  return deviceLayout.layout
    .map((layer, layerIndex) => {
      const positionCodesList = layer
        .map((ac, index) => (ac === actionCode ? index : -1))
        .filter((pos) => pos !== -1)
        .map((pos) => {
          let layer = CharaChorderOneLayer.Primary;
          if (layerIndex === 1) {
            layer = CharaChorderOneLayer.Secondary;
          } else if (layerIndex === 2) {
            layer = CharaChorderOneLayer.Tertiary;
          }
          return {
            device: 'CharaChorderOne' as const,
            characterKeyPositionCode: pos,
            layer,
            shiftKey,
            altGraphKey,
          };
        });
      if (positionCodesList.length === 0) {
        return null;
      }
      return positionCodesList;
    })
    .filter(Boolean)[0];
}

export function humanizePositionCode(positionCode: number) {
  const hand = positionCode < 45 ? 'Left' : 'Right';
  const sw = [
    'Thumb Back',
    'Thumb Middle',
    'Thumb Front',
    'Index',
    'Middle',
    'Ring',
    'Pinky',
    'Middle Secondary',
    'Ring Secondary',
  ][Math.floor((positionCode % 45) / 5)];
  const direction = (
    hand === 'Left'
      ? ['Down (Press)', 'East', 'North', 'West', 'South']
      : ['Down (Press)', 'West', 'North', 'East', 'South']
  )[positionCode % 5];
  return [hand, sw, direction].join(' ');
}
