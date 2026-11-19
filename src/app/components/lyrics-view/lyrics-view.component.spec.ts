import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LyricSegment } from 'src/app/models/lyrics.models';
import { LyricsViewComponent } from './lyrics-view.component';

const segment = (
  start: number,
  words: [string, number, number][],
): LyricSegment => ({
  start,
  end: words[words.length - 1][2],
  text: words.map((w) => w[0]).join(' '),
  words: words.map(([word, s, e]) => ({ word, start: s, end: e })),
});

describe('LyricsViewComponent', () => {
  let fixture: ComponentFixture<LyricsViewComponent>;

  const lines = () =>
    Array.from(
      fixture.nativeElement.querySelectorAll(':scope > div'),
    ) as HTMLElement[];
  const words = (line: HTMLElement) =>
    Array.from(line.querySelectorAll('span')) as HTMLElement[];
  function render(segments: LyricSegment[], currentTime = 0) {
    fixture.componentRef.setInput('shownLyricSegments', segments);
    fixture.componentRef.setInput('currentTime', currentTime);
    fixture.detectChanges();
  }

  beforeEach(() => {
    TestBed.configureTestingModule({});
    fixture = TestBed.createComponent(LyricsViewComponent);
  });

  it('is a block element', () => {
    render([]);
    expect(fixture.nativeElement.classList).toContain('block');
  });

  it('shows nothing without segments', () => {
    render([]);
    expect(lines().length).toBe(0);
  });

  it('shows one centered line per segment, with one span per word', () => {
    render([
      segment(0, [
        ['one', 0, 1],
        ['two', 1, 2],
      ]),
      segment(2, [['three', 2, 3]]),
    ]);
    expect(lines().length).toBe(2);
    expect(lines()[0].classList).toContain('text-center');
    expect(words(lines()[0]).map((w) => w.textContent)).toEqual(['one', 'two']);
    expect(words(lines()[1]).map((w) => w.textContent)).toEqual(['three']);
  });

  describe('word highlight', () => {
    // a word from 10 to 20 turns active 15% into it: at 11.5 seconds
    const lyric = () => [segment(10, [['la', 10, 20]])];
    const active = () => words(lines()[0])[0].classList.contains('active');

    it('is not active before the word starts', () => {
      render(lyric(), 0);
      expect(active()).toBeFalse();
    });

    it('is not active just before 15% of the word', () => {
      render(lyric(), 11.49);
      expect(active()).toBeFalse();
    });

    it('turns active at 15% of the word', () => {
      render(lyric(), 11.5);
      expect(active()).toBeTrue();
    });

    it('stays active after the word ends', () => {
      render(lyric(), 99);
      expect(active()).toBeTrue();
    });

    it('follows the current time, word by word', () => {
      render(
        [
          segment(0, [
            ['a', 0, 2],
            ['b', 2, 4],
          ]),
        ],
        2.2,
      );
      expect(
        words(lines()[0]).map((w) => w.classList.contains('active')),
      ).toEqual([true, false]);
      fixture.componentRef.setInput('currentTime', 3);
      fixture.detectChanges();
      expect(
        words(lines()[0]).map((w) => w.classList.contains('active')),
      ).toEqual([true, true]);
    });
  });

  it('fills a word over 70% of its length', () => {
    render([segment(0, [['la', 0, 10]])]);
    expect(words(lines()[0])[0].style.transition).toContain(
      'background-position',
    );
    expect(words(lines()[0])[0].style.transition).toContain('7s');
    expect(words(lines()[0])[0].style.transition).toContain('linear');
  });

  it('draws words as clipped text', () => {
    render([segment(0, [['la', 0, 1]])]);
    const w = words(lines()[0])[0];
    expect(w.classList).toContain('current-line');
    expect(w.classList).toContain('text-transparent');
  });
});
