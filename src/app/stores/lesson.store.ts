import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { computed } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { Chance } from 'chance';

const QUEUE_SIZE = 20;
const chance = new Chance();

interface LessonState {
  components: string[];
  queue: string[];
  history: string[];
  combo: number;
  lastCorrectKeyTime: number | null;
  keyIntervals: number[];
  error: boolean;
}

const initialState: LessonState = {
  components: [],
  queue: [],
  history: [' ', ' ', ' '],
  combo: 0,
  lastCorrectKeyTime: null,
  keyIntervals: [],
  error: false,
};

export const LessonStore = signalStore(
  withDevtools('lesson'),
  withState(initialState),
  withMethods((store) => ({
    setComponents(components: string[]) {
      patchState(store, () => ({
        components,
        queue: chance.n(chance.pickone, QUEUE_SIZE, components),
        history: [' ', ' ', ' '],
        lastCorrectKeyTime: null,
        keyIntervals: [],
        combo: 0,
        error: false,
      }));
    },
    type(component: string) {
      patchState(store, (state) => {
        const currentKeyTime = performance.now();
        if (component !== state.queue[0]) {
          return { error: true, combo: 0 };
        }
        const keyIntervals = [...state.keyIntervals];
        if (state.lastCorrectKeyTime !== null) {
          const keyInterval = currentKeyTime - state.lastCorrectKeyTime;
          keyIntervals.push(keyInterval);
        }
        return {
          queue: [...state.queue.slice(1), chance.pickone(state.components)],
          history: [...state.history.slice(1), component],
          lastCorrectKeyTime: currentKeyTime,
          keyIntervals: keyIntervals.slice(-10),
          combo: state.combo + 1,
          error: false,
        };
      });
    },
  })),
  withComputed((state) => ({
    cpm: computed(() => {
      const keyIntervals = state.keyIntervals();
      const totalPeriodInMinute =
        keyIntervals.reduce((a, b) => a + b, 0) / 1000 / 60;
      if (totalPeriodInMinute === 0) {
        return 0;
      }
      const characterNumber = keyIntervals.length;
      return Math.floor(characterNumber / totalPeriodInMinute);
    }),
  })),
);
