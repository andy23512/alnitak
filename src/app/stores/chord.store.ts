import {
  withDevtools,
  withStorageSync,
} from '@angular-architects/ngrx-toolkit';
import { signalStore } from '@ngrx/signals';
import { withEntities } from '@ngrx/signals/entities';
import { Chord } from '../models/chord.models';

export const ChordStore = signalStore(
  { providedIn: 'root' },
  withDevtools('chord'),
  withStorageSync('chord'),
  withEntities<Chord>(),
);
