import { Tuple } from '../types/tuple.types';

/**
 * Shape of CharaChorder One layout data. 90 keys x 3 layers = 180 action codes
 */
export interface DeviceLayout {
  id: string;
  name: string;
  layout: Tuple<Tuple<number, 90>, 3>;
}

export enum Layer {
  Primary = 'A1',
  Secondary = 'A2' /* Numeric */,
  Tertiary = 'A3' /* Functional */,
}

/*
 * A key combination on CharaChorder One
 */
export interface KeyCombination {
  characterKeyPositionCode: number;
  layer: Layer;
  shiftKey: boolean;
  altGraphKey: boolean;
}

/*
 * A key combination on CharaChorder One with position codes of all used keys and priority score
 */
export interface HighlightKeyCombination extends KeyCombination {
  positionCodes: number[];
  score: number;
}

/*
 * Label of a physical key, which records the corresponding character when the key is triggered under certain layer and modifiers
 */
export interface KeyLabel {
  type: KeyLabelType;
  c: string;
  layer: Layer | null;
  shiftKey: boolean | null;
  altGraphKey: boolean | null;
}

export enum KeyLabelType {
  String = 'string',
  Icon = 'icon',
}
