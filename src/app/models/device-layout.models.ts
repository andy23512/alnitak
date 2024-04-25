import { Tuple } from '../types/tuple.types';

interface BaseDeviceLayout {
  id: string;
  device: string;
  name: string;
  layout: any;
}

export interface CharaChorderOneLayout extends BaseDeviceLayout {
  device: 'CharaChorderOne';
  layout: Tuple<Tuple<number, 90>, 3>;
}

export type DeviceLayout = CharaChorderOneLayout;
