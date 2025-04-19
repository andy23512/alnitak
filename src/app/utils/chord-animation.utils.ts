import { delay, merge, of } from 'rxjs';
import { ChordAnimationEvent } from '../models/chord-animation-event.models';

export function chordAnimationEventsToObservable(
  chordAnimationEvents: ChordAnimationEvent[],
) {
  const textAnimationFrames = chordAnimationEvents.reduce(
    (acc, cur) => {
      const previousText = acc.length > 0 ? acc[acc.length - 1].text : '';
      let text =
        cur.type === '+' ? previousText + cur.c : previousText.slice(0, -1);
      return [...acc, { text, t: 200 + cur.t * 3 }];
    },
    [] as { text: string; t: number }[],
  );
  const { text: fullText, t: fullTime } =
    textAnimationFrames[textAnimationFrames.length - 1];
  const removeAnimationFrames = new Array(fullText.length)
    .fill(null)
    .map((_, i) => ({
      text: fullText.slice(0, -(i + 1)),
      t: fullTime + 2000 + i * 50,
    }));
  const textAnimationObservables = [
    ...textAnimationFrames,
    ...removeAnimationFrames,
  ].map(({ text, t }) => of(text).pipe(delay(t)));
  return merge(...textAnimationObservables);
}
