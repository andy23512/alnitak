import { Tuple } from '../types/tuple.types';

/**
 * Base shape of device layout data
 */
interface BaseDeviceLayout {
  id: string;
  device: string;
  name: string;
  layout: any;
}

/**
 * Shape of CharaChorder One layout data. 90 keys x 3 layers = 180 action codes
 */
export interface CharaChorderOneLayout extends BaseDeviceLayout {
  device: 'CharaChorderOne';
  layout: Tuple<Tuple<number, 90>, 3>;
}

export type DeviceLayout = CharaChorderOneLayout;

export enum CharaChorderOneLayer {
  Primary = 'A1',
  Secondary = 'A2' /* Numeric */,
  Tertiary = 'A3' /* Functional */,
}

/*
 * Key information of a character on CharaChorder One
 */
export interface CharaChorderOneCharacterKey {
  device: 'CharaChorderOne';
  positionCodes: number[];
  layer: CharaChorderOneLayer;
  shiftKey: boolean;
  altGraphKey: boolean;
}

export interface CharaChorderOneKeyLabel {
  c: string;
  layer: CharaChorderOneLayer;
  shiftKey: boolean;
  altGraphKey: boolean;
}

export type CharacterDeviceKey = CharaChorderOneCharacterKey;
