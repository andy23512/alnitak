import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { computed } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { ChordWithChordKeys } from '../models/chord.models';
import { pickRandomItem, pickRandomItemNTimes } from '../utils/random.utils';

const QUEUE_SIZE = 20;

interface ChordPracticeState {
  chords: ChordWithChordKeys[] | null;
  queue: ChordWithChordKeys[];
  history: ChordWithChordKeys[];
  lastCorrectChordTime: number | null;
  chordIntervals: number[];
  buffer: string[];
}

const initialState: ChordPracticeState = {
  chords: null,
  queue: [],
  history: [],
  lastCorrectChordTime: null,
  chordIntervals: [],
  buffer: [],
};

export const ChordPracticeStore = signalStore(
  { providedIn: 'root' },
  withDevtools('chordPractice'),
  withState(initialState),
  withMethods((store) => ({
    setChords(chords: ChordWithChordKeys[]) {
      patchState(store, () => ({
        chords,
        queue: pickRandomItemNTimes(chords, QUEUE_SIZE),
        history: [],
        chordIntervals: [],
      }));
    },
    airType() {
      patchState(
        store,
        ({ queue, chords, history, lastCorrectChordTime, chordIntervals }) => {
          if (!chords) {
            return {};
          }
          const currentKeyTime = Date.now();
          return {
            queue: [...queue.slice(1), pickRandomItem(chords)],
            history: [...history, queue[0]].slice(-3),
            lastCorrectChordTime: currentKeyTime,
            chordIntervals: lastCorrectChordTime
              ? [...chordIntervals, currentKeyTime - lastCorrectChordTime]
              : [...chordIntervals],
            buffer: [],
          };
        },
      );
    },
    keyUp(event: KeyboardEvent) {
      patchState(
        store,
        ({
          buffer,
          queue,
          chords,
          history,
          lastCorrectChordTime,
          chordIntervals,
        }) => {
          if (!chords) {
            return {};
          }
          const currentKeyTime = Date.now();
          const nextBuffer = [...buffer];
          if (event.code === 'Backspace') {
            nextBuffer.pop();
          } else {
            nextBuffer.push(event.key);
          }
          if (nextBuffer.join('').trim() === queue[0].outputText) {
            return {
              queue: [...queue.slice(1), pickRandomItem(chords)],
              history: [...history, queue[0]].slice(-3),
              lastCorrectChordTime: currentKeyTime,
              chordIntervals: lastCorrectChordTime
                ? [...chordIntervals, currentKeyTime - lastCorrectChordTime]
                : [...chordIntervals],
              buffer: [],
            };
          }
          return {
            buffer: nextBuffer,
          };
        },
      );
    },
  })),
  withComputed((state) => ({
    chpm: computed(() => {
      const chordIntervals = state.chordIntervals();
      const totalPeriodInMinute =
        chordIntervals.reduce((a, b) => a + b, 0) / 1000 / 60;
      if (totalPeriodInMinute === 0) {
        return 0;
      }
      const characterNumber = chordIntervals.length;
      return Math.floor(characterNumber / totalPeriodInMinute);
    }),
  })),
);
