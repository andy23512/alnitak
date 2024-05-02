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
