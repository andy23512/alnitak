import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { Chance } from 'chance';

const QUEUE_SIZE = 20;
const chance = new Chance();

interface LessonState {
  components: string[];
  queue: string[];
  history: string[];
  combo: number,
  error: boolean;
}

const initialState: LessonState = {
  components: [],
  queue: [],
  history: [' ', ' ', ' '],
  combo: 0,
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
        combo: 0,
        error: false,
      }));
    },
    type(component: string) {
      patchState(store, (state) => {
        if (component !== state.queue[0]) {
          return { error: true, combo: 0 };
        }
        return {
          queue: [...state.queue.slice(1), chance.pickone(state.components)],
          history: [...state.history.slice(1), component],
          combo: state.combo + 1,
          error: false,
        };
      });
    },
  })),
);
