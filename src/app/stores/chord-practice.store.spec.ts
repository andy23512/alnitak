import { TestBed } from '@angular/core/testing';
import { patchState } from '@ngrx/signals';
import { ChordWithChordKeys } from '../models/chord.models';
import { ChordPracticeStore } from './chord-practice.store';

const chord = (id: string, outputText: string): ChordWithChordKeys => ({
  id,
  input: [1],
  output: [2],
  inputKeys: [],
  outputKeys: [],
  outputText,
});
const input = (inputType: string, data: string | null = null) =>
  ({ inputType, data }) as InputEvent;
const insert = (data: string) => input('insertText', data);

describe('ChordPracticeStore', () => {
  const the = chord('1', 'the');
  const and = chord('2', 'and');
  let store: InstanceType<typeof ChordPracticeStore>;
  let now: jasmine.Spy;

  beforeEach(() => {
    TestBed.resetTestingModule();
    store = TestBed.inject(ChordPracticeStore);
    now = spyOn(Date, 'now').and.returnValue(1_000);
  });

  /** Starts a practice with `queue` as the pending words (picks are random otherwise). */
  function start(queue: ChordWithChordKeys[], chords = [the, and]) {
    store.setChords(chords);
    patchState(store, { queue });
  }

  describe('setChords', () => {
    it('starts empty before any chords are set', () => {
      expect(store.chords()).toBeNull();
      expect(store.queue()).toEqual([]);
      expect(store.history()).toEqual([]);
      expect(store.chpm()).toBe(0);
    });

    it('keeps the chords and fills the queue with 20 picks from them', () => {
      store.setChords([the, and]);
      expect(store.chords()).toEqual([the, and]);
      expect(store.queue().length).toBe(20);
      expect(store.queue().every((c) => c === the || c === and)).toBeTrue();
    });

    it('clears history and chord intervals', () => {
      start([the]);
      store.airType();
      store.airType();
      store.setChords([the, and]);
      expect(store.history()).toEqual([]);
      expect(store.chordIntervals()).toEqual([]);
    });

    it('forgets the typing buffer and last correct time of the previous practice', () => {
      start([the]);
      store.input(insert('t'));
      store.airType();
      patchState(store, { buffer: ['x'] });
      store.setChords([the, and]);
      expect(store.buffer()).toEqual([]);
      expect(store.lastCorrectChordTime()).toBeNull();
    });

    it('does not count the time between two practices as a chord interval', () => {
      start([the]);
      store.airType();
      store.setChords([the, and]);
      patchState(store, { queue: [the] });
      store.airType();
      expect(store.chordIntervals()).toEqual([]);
    });
  });

  describe('airType', () => {
    it('does nothing before chords are set', () => {
      store.airType();
      expect(store.queue()).toEqual([]);
      expect(store.history()).toEqual([]);
    });

    it('moves the first queued chord into the history and keeps the queue length', () => {
      start([the, and, and]);
      store.airType();
      expect(store.history()).toEqual([the]);
      expect(store.queue().length).toBe(3);
      expect(store.queue().slice(0, 2)).toEqual([and, and]);
    });

    it('keeps only the last 3 history items', () => {
      start([the, and, the, and, the]);
      for (let i = 0; i < 4; i++) {
        store.airType();
      }
      expect(store.history()).toEqual([and, the, and]);
    });

    it('records the time and the interval from the previous correct chord', () => {
      start([the, and, the]);
      store.airType();
      expect(store.lastCorrectChordTime()).toBe(1_000);
      expect(store.chordIntervals()).toEqual([]);
      now.and.returnValue(1_600);
      store.airType();
      expect(store.chordIntervals()).toEqual([600]);
      expect(store.lastCorrectChordTime()).toBe(1_600);
    });

    it('clears the typing buffer', () => {
      start([the]);
      store.input(insert('t'));
      store.airType();
      expect(store.buffer()).toEqual([]);
    });
  });

  describe('input', () => {
    it('does nothing before chords are set', () => {
      store.input(insert('a'));
      expect(store.buffer()).toEqual([]);
    });

    it('collects typed characters in the buffer', () => {
      start([the]);
      store.input(insert('t'));
      store.input(insert('h'));
      expect(store.buffer()).toEqual(['t', 'h']);
    });

    it('removes the last character on backspace', () => {
      start([the]);
      store.input(insert('t'));
      store.input(insert('h'));
      store.input(input('deleteContentBackward'));
      expect(store.buffer()).toEqual(['t']);
    });

    it('ignores backspace on an empty buffer', () => {
      start([the]);
      store.input(input('deleteContentBackward'));
      expect(store.buffer()).toEqual([]);
    });

    it('ignores other input types and empty data', () => {
      start([the]);
      store.input(input('insertFromPaste', 'abc'));
      store.input(input('insertText', null));
      store.input(input('insertText', ''));
      expect(store.buffer()).toEqual([]);
    });

    it('advances to the next chord when the buffer equals the output text', () => {
      start([the, and, and]);
      store.input(insert('t'));
      store.input(insert('h'));
      expect(store.history()).toEqual([]);
      store.input(insert('e'));
      expect(store.history()).toEqual([the]);
      expect(store.queue().slice(0, 2)).toEqual([and, and]);
      expect(store.buffer()).toEqual([]);
    });

    it('ignores spaces before and after the typed text (a chord ends with a space)', () => {
      start([the, and]);
      'the '.split('').forEach((c) => store.input(insert(c)));
      expect(store.history()).toEqual([the]);
      start([the, and]);
      ' the'.split('').forEach((c) => store.input(insert(c)));
      expect(store.history()).toEqual([the]);
    });

    it('keeps a wrong buffer without advancing', () => {
      start([the, and]);
      store.input(insert('x'));
      store.input(insert('y'));
      expect(store.history()).toEqual([]);
      expect(store.buffer()).toEqual(['x', 'y']);
    });

    it('records the interval between correct chords', () => {
      start([the, and, the]);
      'the'.split('').forEach((c) => store.input(insert(c)));
      now.and.returnValue(1_500);
      'and'.split('').forEach((c) => store.input(insert(c)));
      expect(store.chordIntervals()).toEqual([500]);
    });
  });

  describe('chpm', () => {
    it('is the number of intervals divided by their total minutes, rounded down', () => {
      patchState(store, { chordIntervals: [1000, 1000, 1000] });
      // 3 chords in 3 seconds = 60 per minute
      expect(store.chpm()).toBe(60);
      patchState(store, { chordIntervals: [700, 700, 700] });
      // 3 chords in 2.1 seconds = 85.7 per minute
      expect(store.chpm()).toBe(85);
    });

    it('is 0 without intervals', () => {
      patchState(store, { chordIntervals: [] });
      expect(store.chpm()).toBe(0);
    });
  });
});
