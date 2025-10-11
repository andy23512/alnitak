import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { computed, inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { CharacterLesson } from '../models/topic.models';
import { KeyRecordService } from '../services/key-record.service';
import { pickRandomItem, pickRandomItemNTimes } from '../utils/random.utils';

const QUEUE_SIZE = 20;

interface CharacterLessonState {
  topicId: string | null;
  lessonId: string | null;
  components: string[];
  queue: string[];
  history: string[];
  combo: number;
  lastCorrectKeyTime: number | null;
  keyIntervals: number[];
  error: boolean;
  lastErrorComponent: string | null;
}

const initialState: CharacterLessonState = {
  topicId: null,
  lessonId: null,
  components: [],
  queue: [],
  history: [' ', ' ', ' '],
  combo: 0,
  lastCorrectKeyTime: null,
  keyIntervals: [],
  error: false,
  lastErrorComponent: null,
};

export const CharacterLessonStore = signalStore(
  withDevtools('characterLesson'),
  withState(initialState),
  withMethods((store, keyRecordService = inject(KeyRecordService)) => ({
    setLesson(lesson: CharacterLesson) {
      patchState(store, () => ({
        topicId: lesson.topic.id,
        lessonId: lesson.id,
        components: lesson.components,
        queue: pickRandomItemNTimes(lesson.components, QUEUE_SIZE),
        history: [' ', ' ', ' '],
        lastCorrectKeyTime: null,
        keyIntervals: [],
        combo: 0,
        error: false,
      }));
    },
    pauseLesson() {
      patchState(store, (state) => ({
        ...state,
        lastCorrectKeyTime: null,
      }));
    },
    airType() {
      patchState(store, (state) => {
        if (state.topicId === null || state.lessonId === null) {
          return {};
        }
        const currentKeyTime = Date.now();
        const keyInterval =
          state.lastCorrectKeyTime !== null
            ? currentKeyTime - state.lastCorrectKeyTime
            : null;
        const keyIntervals = [...state.keyIntervals];
        if (keyInterval) {
          keyIntervals.push(keyInterval);
        }
        return {
          queue: [...state.queue.slice(1), pickRandomItem(state.components)],
          history: [...state.history.slice(1), state.queue[0]],
          lastCorrectKeyTime: currentKeyTime,
          keyIntervals: keyIntervals.slice(-10),
          combo: state.combo + 1,
          error: false,
          lastErrorComponent: null,
        };
      });
    },
    type(component: string) {
      patchState(store, (state) => {
        if (state.topicId === null || state.lessonId === null) {
          return {};
        }
        const currentKeyTime = Date.now();
        const keyInterval =
          state.lastCorrectKeyTime !== null
            ? currentKeyTime - state.lastCorrectKeyTime
            : null;
        const commonKeyRecord = {
          timestamp: currentKeyTime,
          topicId: state.topicId,
          lessonId: state.lessonId,
          targetKey: state.queue[0],
          inputKey: component,
        };
        if (component !== state.queue[0]) {
          keyRecordService.pushIntoQueue({
            ...commonKeyRecord,
            isCorrect: false,
            intervalToPreviousCorrectKey: keyInterval,
            cpm: null,
            combo: 0,
          });
          return { error: true, combo: 0, lastErrorComponent: component };
        }
        keyRecordService.pushIntoQueue({
          ...commonKeyRecord,
          isCorrect: true,
          intervalToPreviousCorrectKey: keyInterval,
          cpm: keyInterval ? Math.floor((60 * 1000) / keyInterval) : null,
          combo: state.combo + 1,
        });
        const keyIntervals = [...state.keyIntervals];
        if (keyInterval) {
          keyIntervals.push(keyInterval);
        }
        return {
          queue: [...state.queue.slice(1), pickRandomItem(state.components)],
          history: [...state.history.slice(1), component],
          lastCorrectKeyTime: currentKeyTime,
          keyIntervals: keyIntervals.slice(-10),
          combo: state.combo + 1,
          error: false,
          lastErrorComponent: null,
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
