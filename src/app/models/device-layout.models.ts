import { Icon } from '../types/icon.types';
import { Tuple } from '../types/tuple.types';

/**
 * Shape of CharaChorder 3D device layout data. 90 keys x 3-4 layers
 */
export interface DeviceLayout {
  id: string;
  name: string;
  layout: Tuple<Tuple<number, 90>, 3> | Tuple<Tuple<number, 90>, 4>;
}

export enum Layer {
  Primary = 'A1',
  Secondary = 'A2' /* Numeric */,
  Tertiary = 'A3' /* Functional */,
  Quaternary = 'A4' /* Flag */,
}

/*
 * A key combination on CharaChorder 3D input devices
 */
export interface KeyCombination {
  characterKeyPositionCode: number;
  layer: Layer;
  shiftKey: boolean;
  altGraphKey: boolean;
}

/*
 * A key combination on CharaChorder 3D input devices with position codes of all used keys and priority score
 */
export interface HighlightKeyCombination extends KeyCombination {
  positionCodes: number[];
  score: number;
}

export enum FontLogo {
  Ubuntu = '\uf31b',
  ArchLinux = '\uf303',
  CentOS = '\uf304',
  Debian = '\uf306',
  Elementary = '\uf309',
  Fedora = '\uf30a',
  FreeBSD = '\uf30c',
  Gentoo = '\uf30d',
  Mageia = '\uf310',
  Mandriva = '\uf311',
  Manjaro = '\uf312',
  LinuxMint = '\uf30e',
  OpenBSD = '\uf328',
  RaspberryPi = '\uf315',
  RedHat = '\uf316',
  Sabayon = '\uf317',
  Tux = '\uf31a',
}

export type RawKeyLabel =
  | {
      type: KeyLabelType.String;
      c: string;
      title: string;
    }
  | { type: KeyLabelType.Icon; c: Icon; title: string }
  | { type: KeyLabelType.Logo; c: FontLogo; title: string }
  | { type: KeyLabelType.ActionCode; c: number; title: string };

/*
 * Label of a physical key, which records the corresponding character when the key is triggered under certain layer and modifiers
 */
export type KeyLabel = RawKeyLabel & {
  layer: Layer | null;
  shiftKey: boolean | null;
  altGraphKey: boolean | null;
};

export enum KeyLabelType {
  String = 'string',
  Icon = 'icon',
  Logo = 'logo',
  ActionCode = 'action-code',
}
