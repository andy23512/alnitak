import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { computed, inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { TrigramLesson } from '../models/topic.models';
import { KeyRecordService } from '../services/key-record.service';
import { pickRandomItem, pickRandomItemNTimes } from '../utils/random.utils';

const QUEUE_SIZE = 20;

interface TrigramLessonState {
  topicId: string | null;
  lessonId: string | null;
  trigrams: string[];
  queue: string[];
  history: string[];
  combo: number;
  lastCorrectTrigramTime: number | null;
  trigramIntervals: number[];
  buffer: string[];
  error: boolean;
  lastErrorCharacter: string | null;
}

const initialState: TrigramLessonState = {
  topicId: null,
  lessonId: null,
  trigrams: [],
  queue: [],
  history: ['   '],
  combo: 0,
  lastCorrectTrigramTime: null,
  trigramIntervals: [],
  error: false,
  buffer: [],
  lastErrorCharacter: null,
};

export const TrigramLessonStore = signalStore(
  withDevtools('trigramLesson'),
  withState(initialState),
  withMethods((store, keyRecordService = inject(KeyRecordService)) => ({
    setLesson(lesson: TrigramLesson) {
      patchState(store, () => ({
        topicId: lesson.topic.id,
        lessonId: lesson.id,
        trigrams: lesson.components,
        queue: pickRandomItemNTimes(lesson.componentNames, QUEUE_SIZE),
        history: ['   '],
        combo: 0,
        lastCorrectTrigramTime: null,
        trigramIntervals: [],
        error: false,
        buffer: [],
      }));
    },
    pauseLesson() {
      patchState(store, (state) => ({
        ...state,
        lastCorrectTrigramTime: null,
      }));
    },
    // TODO - add airType
    input(event: InputEvent) {
      patchState(
        store,
        ({
          topicId,
          lessonId,
          buffer,
          queue,
          trigrams,
          trigramIntervals,
          lastCorrectTrigramTime,
          combo,
        }) => {
          if (topicId === null || lessonId === null) {
            return {};
          }
          const currentKeyTime = Date.now();
          const nextBuffer = [...buffer];
          if (event.inputType === 'deleteContentBackward') {
            nextBuffer.pop();
          } else if (event.inputType === 'insertText' && event.data) {
            if (nextBuffer.length === 0 && event.data === ' ') {
              return {};
            }
            nextBuffer.push(event.data);
          } else {
            return {};
          }
          if (nextBuffer.join('') === queue[0]) {
            return {
              queue: [...queue.slice(1), pickRandomItem(trigrams)],
              history: [queue[0]],
              lastCorrectTrigramTime: currentKeyTime,
              trigramIntervals: lastCorrectTrigramTime
                ? [...trigramIntervals, currentKeyTime - lastCorrectTrigramTime]
                : [...trigramIntervals],
              buffer: [],
              combo: combo + 1,
              error: false,
              lastErrorCharacter: null,
            };
          }
          if (!queue[0].startsWith(nextBuffer.join(''))) {
            return {
              error: true,
              combo: 0,
              lastErrorCharacter:
                event.inputType === 'insertText' && event.data
                  ? event.data
                  : null,
            };
          }
          return {
            error: false,
            lastErrorCharacter: null,
            buffer: nextBuffer,
          };
        },
      );
    },
  })),
  withComputed((state) => ({
    wpm: computed(() => {
      const trigramIntervals = state.trigramIntervals();
      const totalPeriodInMinute =
        trigramIntervals.reduce((a, b) => a + b, 0) / 1000 / 60;
      if (totalPeriodInMinute === 0) {
        return 0;
      }
      const characterNumber = trigramIntervals.length * 3;
      return Math.floor(characterNumber / 5 / totalPeriodInMinute);
    }),
  })),
);
