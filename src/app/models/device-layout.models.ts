import { Layer } from 'tangent-cc-lib';

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
