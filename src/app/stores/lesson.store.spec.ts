import { TestBed } from '@angular/core/testing';
import { Lesson } from '../models/topic.models';
import { KeyRecordService } from '../services/key-record.service';
import { LessonStore } from './lesson.store';

const lesson = (components = ['a', 'b']): Lesson => ({
  id: 'lesson-1',
  name: 'Lesson',
  components,
  componentNames: [],
  topic: { id: 'topic-1', name: 'Topic', type: 'character', lessons: [] },
});

describe('LessonStore', () => {
  let store: InstanceType<typeof LessonStore>;
  let push: jasmine.Spy;
  let now: jasmine.Spy;
  let random: jasmine.Spy;

  beforeEach(() => {
    push = jasmine.createSpy('pushIntoQueue');
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        LessonStore,
        { provide: KeyRecordService, useValue: { pushIntoQueue: push } },
      ],
    });
    store = TestBed.inject(LessonStore);
    now = spyOn(Date, 'now').and.returnValue(10_000);
    // random 0 -> every pick is the first component
    random = spyOn(Math, 'random').and.returnValue(0);
  });

  describe('setLesson', () => {
    it('starts empty', () => {
      expect(store.topicId()).toBeNull();
      expect(store.lessonId()).toBeNull();
      expect(store.history()).toEqual([' ', ' ', ' ']);
      expect(store.cpm()).toBe(0);
    });

    it('stores the topic, lesson and components and fills a queue of 20', () => {
      store.setLesson(lesson());
      expect(store.topicId()).toBe('topic-1');
      expect(store.lessonId()).toBe('lesson-1');
      expect(store.components()).toEqual(['a', 'b']);
      expect(store.queue().length).toBe(20);
      expect(store.queue().every((c) => c === 'a')).toBeTrue();
    });

    it('resets the progress of the previous lesson', () => {
      store.setLesson(lesson());
      store.type('a');
      store.type('b');
      store.setLesson(lesson(['x', 'y']));
      expect(store.history()).toEqual([' ', ' ', ' ']);
      expect(store.combo()).toBe(0);
      expect(store.keyIntervals()).toEqual([]);
      expect(store.lastCorrectKeyTime()).toBeNull();
      expect(store.error()).toBeFalse();
    });
  });

  describe('type', () => {
    it('does nothing before a lesson is set', () => {
      store.type('a');
      expect(store.combo()).toBe(0);
      expect(push).not.toHaveBeenCalled();
    });

    describe('with the correct key', () => {
      beforeEach(() => store.setLesson(lesson()));

      it('moves to the next key, adds to the history and raises the combo', () => {
        random.and.returnValue(0.99);
        store.type('a');
        expect(store.history()).toEqual([' ', ' ', 'a']);
        expect(store.queue().length).toBe(20);
        expect(store.queue()[19]).toBe('b');
        expect(store.combo()).toBe(1);
        expect(store.error()).toBeFalse();
      });

      it('keeps only the last 3 keys in the history', () => {
        ['a', 'a', 'a', 'a'].forEach((k) => store.type(k));
        expect(store.history()).toEqual(['a', 'a', 'a']);
      });

      it('records a correct key without a speed for the first key', () => {
        store.type('a');
        expect(push).toHaveBeenCalledOnceWith({
          timestamp: 10_000,
          topicId: 'topic-1',
          lessonId: 'lesson-1',
          targetKey: 'a',
          inputKey: 'a',
          isCorrect: true,
          intervalToPreviousCorrectKey: null,
          cpm: null,
          combo: 1,
        });
      });

      it('records the interval and the speed from the previous correct key', () => {
        store.type('a');
        now.and.returnValue(10_500);
        store.type('a');
        expect(push.calls.mostRecent().args[0]).toEqual(
          jasmine.objectContaining({
            intervalToPreviousCorrectKey: 500,
            cpm: 120,
            combo: 2,
          }),
        );
        expect(store.keyIntervals()).toEqual([500]);
      });

      it('rounds the recorded speed down', () => {
        store.type('a');
        now.and.returnValue(10_700);
        store.type('a');
        expect(push.calls.mostRecent().args[0].cpm).toBe(85);
      });

      it('keeps only the last 10 intervals', () => {
        let t = 10_000;
        for (let i = 0; i < 13; i++) {
          t += 100 + i;
          now.and.returnValue(t);
          store.type('a');
        }
        expect(store.keyIntervals().length).toBe(10);
        expect(store.keyIntervals()[9]).toBe(112);
        expect(store.keyIntervals()[0]).toBe(103);
      });

      it('clears an earlier error', () => {
        store.type('b');
        expect(store.error()).toBeTrue();
        store.type('a');
        expect(store.error()).toBeFalse();
        expect(store.lastErrorComponent()).toBeNull();
      });
    });

    describe('with a wrong key', () => {
      beforeEach(() => store.setLesson(lesson()));

      it('sets the error, resets the combo and remembers the wrong key', () => {
        store.type('a');
        store.type('b');
        expect(store.error()).toBeTrue();
        expect(store.combo()).toBe(0);
        expect(store.lastErrorComponent()).toBe('b');
      });

      it('does not advance the queue or the history', () => {
        const queue = store.queue();
        store.type('b');
        expect(store.queue()).toEqual(queue);
        expect(store.history()).toEqual([' ', ' ', ' ']);
      });

      it('does not move the last correct time or the intervals', () => {
        store.type('a');
        now.and.returnValue(12_000);
        store.type('b');
        expect(store.lastCorrectKeyTime()).toBe(10_000);
        expect(store.keyIntervals()).toEqual([]);
      });

      it('records a wrong key with no speed and combo 0', () => {
        store.type('a');
        now.and.returnValue(10_800);
        store.type('b');
        expect(push.calls.mostRecent().args[0]).toEqual({
          timestamp: 10_800,
          topicId: 'topic-1',
          lessonId: 'lesson-1',
          targetKey: 'a',
          inputKey: 'b',
          isCorrect: false,
          intervalToPreviousCorrectKey: 800,
          cpm: null,
          combo: 0,
        });
      });
    });
  });

  describe('airType', () => {
    it('does nothing before a lesson is set', () => {
      store.airType();
      expect(store.combo()).toBe(0);
      expect(store.queue()).toEqual([]);
    });

    it('treats the first queued key as typed without recording it', () => {
      store.setLesson(lesson());
      random.and.returnValue(0.99);
      store.airType();
      expect(store.history()).toEqual([' ', ' ', 'a']);
      expect(store.queue()[19]).toBe('b');
      expect(store.combo()).toBe(1);
      expect(push).not.toHaveBeenCalled();
    });

    it('records the interval from the previous key and clears an error', () => {
      store.setLesson(lesson());
      store.type('b');
      store.airType();
      expect(store.error()).toBeFalse();
      now.and.returnValue(10_400);
      store.airType();
      expect(store.keyIntervals()).toEqual([400]);
      expect(store.lastCorrectKeyTime()).toBe(10_400);
    });
  });

  describe('pauseLesson', () => {
    it('forgets the last correct time so the pause is not counted as an interval', () => {
      store.setLesson(lesson());
      store.type('a');
      store.pauseLesson();
      expect(store.lastCorrectKeyTime()).toBeNull();
      now.and.returnValue(99_000);
      store.type('a');
      expect(store.keyIntervals()).toEqual([]);
      expect(push.calls.mostRecent().args[0].cpm).toBeNull();
    });
  });

  describe('cpm', () => {
    it('is the number of intervals divided by their total minutes, rounded down', () => {
      store.setLesson(lesson());
      store.type('a');
      now.and.returnValue(10_500);
      store.type('a');
      now.and.returnValue(11_000);
      store.type('a');
      // 2 keys in 1 second = 120 per minute
      expect(store.cpm()).toBe(120);
    });

    it('is 0 without intervals', () => {
      store.setLesson(lesson());
      store.type('a');
      expect(store.cpm()).toBe(0);
    });
  });
});
