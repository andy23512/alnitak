import { fakeAsync, tick } from '@angular/core/testing';
import { ChordAnimationEvent } from '../models/chord-animation-event.models';
import { chordAnimationEventsToObservable } from './chord-animation.utils';

describe('chordAnimationEventsToObservable', () => {
  const events: ChordAnimationEvent[] = [
    { type: '+', c: 'a', t: 0 },
    { type: '+', c: 'b', t: 10 },
    { type: '-', t: 20 },
  ];

  function collect(noDelete: boolean, until: number) {
    const log: { text: string; at: number }[] = [];
    let now = 0;
    const sub = chordAnimationEventsToObservable(events, noDelete).subscribe(
      (text) => log.push({ text, at: now }),
    );
    // step 1 ms at a time so each emission time is recorded exactly
    for (; now < until;) {
      now++;
      tick(1);
    }
    sub.unsubscribe();
    return log;
  }

  it('emits the growing text at 200ms + 3 * event time', fakeAsync(() => {
    const log = collect(true, 400);
    expect(log).toEqual([
      { text: 'a', at: 200 },
      { text: 'ab', at: 230 },
      { text: 'a', at: 260 },
    ]);
  }));

  it('treats a "-" event as deleting the last character', fakeAsync(() => {
    const log = collect(true, 400);
    expect(log[log.length - 1].text).toBe('a');
  }));

  it('does not remove the text afterwards when noDelete is true', fakeAsync(() => {
    const log = collect(true, 5000);
    expect(log.map((l) => l.text)).toEqual(['a', 'ab', 'a']);
  }));

  it('erases the final text one character at a time, starting 2000ms after the last frame', fakeAsync(() => {
    const only: ChordAnimationEvent[] = [
      { type: '+', c: 'a', t: 0 },
      { type: '+', c: 'b', t: 0 },
      { type: '+', c: 'c', t: 10 },
    ];
    const log: { text: string; at: number }[] = [];
    let now = 0;
    chordAnimationEventsToObservable(only, false).subscribe((text) =>
      log.push({ text, at: now }),
    );
    for (; now < 2400;) {
      now++;
      tick(1);
    }
    // last frame at 230ms, so removal starts at 230 + 2000
    expect(log.slice(3)).toEqual([
      { text: 'ab', at: 2230 },
      { text: 'a', at: 2280 },
      { text: '', at: 2330 },
    ]);
  }));

  it('emits nothing before the first frame time', fakeAsync(() => {
    const log: string[] = [];
    chordAnimationEventsToObservable(events, true).subscribe((t) =>
      log.push(t),
    );
    tick(199);
    expect(log).toEqual([]);
    tick(1);
    expect(log).toEqual(['a']);
    tick(1000);
  }));

  it('completes after the last scheduled emission', fakeAsync(() => {
    let completed = false;
    chordAnimationEventsToObservable(events, false).subscribe({
      complete: () => (completed = true),
    });
    tick(260);
    expect(completed).toBeFalse();
    tick(2000 + 50 * 2 + 10);
    expect(completed).toBeTrue();
  }));
});
