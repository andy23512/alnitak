import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { MatSlider } from '@angular/material/slider';
import { By } from '@angular/platform-browser';
import { provideTranslateService } from '@ngx-translate/core';
import { LayoutSongHelpDialogComponent } from 'src/app/components/layout-song-help-dialog/layout-song-help-dialog.component';
import { LayoutComponent } from 'src/app/components/layout/layout.component';
import { LyricsViewComponent } from 'src/app/components/lyrics-view/lyrics-view.component';
import {
  LAYOUT_SONG_LYRICS,
  WORDS_WITH_COMPONENTS_IN_LAYOUT_SONG_LYRICS,
} from 'src/app/const/lyrics.const';
import { patchState } from '@ngrx/signals';
import { LayoutSongSettingStore } from 'src/app/stores/layout-song-setting.store';
import { VisibilitySettingStore } from 'src/app/stores/visibility-setting.store';
import { Layer } from 'tangent-cc-lib';
import { LayoutSongPageComponent } from './layout-song-page.component';

/** A stand-in for the browser's Audio: it records what the page does and lets the test fire events. */
class FakeAudio extends EventTarget {
  static last: FakeAudio;
  static all: FakeAudio[] = [];
  volume = 1;
  muted = false;
  loop = false;
  currentTime = 0;
  duration = 200;
  paused = true;
  play = jasmine.createSpy('play').and.callFake(() => {
    this.paused = false;
    return Promise.resolve();
  });
  pause = jasmine.createSpy('pause').and.callFake(() => {
    this.paused = true;
  });
  constructor(public src: string) {
    super();
    FakeAudio.last = this;
    FakeAudio.all.push(this);
  }
  fire(type: string) {
    this.dispatchEvent(new Event(type));
  }
}

const segments = LAYOUT_SONG_LYRICS.segments;

describe('LayoutSongPageComponent', () => {
  let fixture: ComponentFixture<LayoutSongPageComponent>;
  let component: LayoutSongPageComponent;
  let settings: InstanceType<typeof LayoutSongSettingStore>;
  let dialogOpen: jasmine.Spy;

  const el = () => fixture.nativeElement as HTMLElement;
  const audio = () => FakeAudio.last;
  const layout = () =>
    fixture.debugElement.query(By.directive(LayoutComponent))
      .componentInstance as LayoutComponent;
  const icons = () =>
    Array.from(el().querySelectorAll('section button mat-icon')).map((i) =>
      i.textContent!.trim(),
    );
  const buttons = () =>
    Array.from(el().querySelectorAll('section button')) as HTMLButtonElement[];
  const sliders = () => fixture.debugElement.queryAll(By.directive(MatSlider));
  function tickTo(time: number) {
    audio().currentTime = time;
    audio().fire('timeupdate');
    fixture.detectChanges();
  }

  beforeEach(() => {
    TestBed.resetTestingModule();
    localStorage.clear();
    FakeAudio.all = [];
    spyOn(window as never, 'Audio' as never).and.callFake(function (
      src: string,
    ) {
      return new FakeAudio(src);
    } as never);
    TestBed.configureTestingModule({ providers: [provideTranslateService()] });
    settings = TestBed.inject(LayoutSongSettingStore);
    dialogOpen = spyOn(TestBed.inject(MatDialog), 'open');
  });

  afterEach(() => localStorage.clear());

  function create() {
    fixture = TestBed.createComponent(LayoutSongPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  it('fills the page', () => {
    create();
    for (const c of [
      'flex',
      'flex-col',
      'h-full',
      'w-full',
      'relative',
      'overflow-hidden',
    ]) {
      expect(el().classList).toContain(c);
    }
    expect(el().querySelector('h2')!.textContent!.trim().toLowerCase()).toBe(
      'layout-song-page.title',
    );
  });

  describe('audio', () => {
    it('loads the song with the stored volume, mute and loop settings', () => {
      settings.setVolume(0.4);
      settings.setLoop(true);
      create();
      expect(audio().src).toBe('./assets/layout.mp3');
      expect(audio().volume).toBe(0.4);
      expect(audio().muted).toBeFalse();
      expect(audio().loop).toBeTrue();
    });

    it('follows later changes of the settings', () => {
      create();
      settings.setVolume(0.2);
      settings.setLoop(true);
      fixture.detectChanges();
      expect(audio().volume).toBe(0.2);
      expect(audio().loop).toBeTrue();
      settings.setMuted(true);
      fixture.detectChanges();
      expect(audio().muted).toBeTrue();
    });

    it('is paused and rewound when the page goes away', () => {
      create();
      audio().currentTime = 50;
      fixture.destroy();
      expect(audio().pause).toHaveBeenCalled();
      expect(audio().currentTime).toBe(0);
    });

    it('pauses the old audio when it is loaded again', () => {
      create();
      const first = audio();
      component.loadAudio();
      expect(first.pause).toHaveBeenCalled();
      expect(FakeAudio.all.length).toBe(2);
    });
  });

  describe('play button', () => {
    it('cannot be used before the song can play', () => {
      create();
      expect(buttons()[0].disabled).toBeTrue();
      expect(component.canPlay()).toBeFalse();
    });

    it('can be used once the audio can play', () => {
      create();
      audio().fire('canplay');
      fixture.detectChanges();
      expect(buttons()[0].disabled).toBeFalse();
    });

    it('plays, shows pause, and pauses again', () => {
      create();
      audio().fire('canplay');
      fixture.detectChanges();
      expect(icons()[0]).toBe('play_arrow');
      buttons()[0].click();
      fixture.detectChanges();
      expect(audio().play).toHaveBeenCalledTimes(1);
      expect(icons()[0]).toBe('pause');
      buttons()[0].click();
      fixture.detectChanges();
      expect(audio().pause).toHaveBeenCalled();
      expect(icons()[0]).toBe('play_arrow');
    });

    it('goes back to the play icon when the song ends', () => {
      create();
      audio().fire('canplay');
      buttons()[0].click();
      audio().fire('ended');
      fixture.detectChanges();
      expect(component.isPlaying()).toBeFalse();
      expect(component.canPlay()).toBeTrue();
    });

    it('cannot be used again after an error', () => {
      create();
      audio().fire('canplay');
      buttons()[0].click();
      audio().fire('error');
      fixture.detectChanges();
      expect(component.canPlay()).toBeFalse();
      expect(component.isPlaying()).toBeFalse();
      expect(buttons()[0].disabled).toBeTrue();
    });

    it('cannot be used when the browser refuses to play', async () => {
      create();
      audio().fire('canplay');
      audio().play.and.returnValue(Promise.reject(new Error('blocked')));
      component.handlePlayPause();
      await Promise.resolve();
      await Promise.resolve();
      expect(component.canPlay()).toBeFalse();
    });
  });

  describe('loop button', () => {
    it('toggles the setting and its colour', () => {
      create();
      const loop = () => buttons()[1];
      expect(loop().classList).toContain('!text-gray-200');
      loop().click();
      fixture.detectChanges();
      expect(settings.loop()).toBeTrue();
      expect(loop().classList).toContain('!text-alnitak-500');
      expect(loop().classList).not.toContain('!text-gray-200');
      loop().click();
      expect(settings.loop()).toBeFalse();
    });
  });

  describe('progress', () => {
    beforeEach(() => create());

    it('starts at the beginning', () => {
      expect(component.currentTime()).toBe(0);
      expect(component.progress()).toBe(0);
    });

    it('follows the time of the audio, as a percentage of its length', () => {
      tickTo(50);
      expect(component.currentTime()).toBe(50);
      expect(component.progress()).toBe(25);
    });

    it('shows the progress on the slider', () => {
      tickTo(100);
      const thumb = sliders()[0].nativeElement.querySelector(
        'input',
      ) as HTMLInputElement;
      expect(thumb.value).toBe('50');
    });

    it('seeks to the percentage of the length', () => {
      component.handleSeek(25);
      expect(audio().currentTime).toBe(50);
    });
  });

  describe('volume', () => {
    beforeEach(() => create());
    const volumeThumb = () =>
      sliders()[1].nativeElement.querySelector('input') as HTMLInputElement;

    it('shows the volume on the slider, and 0 while muted', () => {
      settings.setVolume(0.5);
      fixture.detectChanges();
      expect(volumeThumb().value).toBe('0.5');
      settings.setMuted(true);
      fixture.detectChanges();
      expect(volumeThumb().value).toBe('0');
    });

    it('sets the volume from the slider', () => {
      volumeThumb().value = '0.3';
      volumeThumb().dispatchEvent(new Event('input'));
      volumeThumb().dispatchEvent(new Event('change'));
      fixture.detectChanges();
      expect(settings.volume()).toBe(0.3);
    });

    it('mutes when the slider is moved to 0', () => {
      volumeThumb().value = '0';
      volumeThumb().dispatchEvent(new Event('input'));
      volumeThumb().dispatchEvent(new Event('change'));
      expect(settings.muted()).toBeTrue();
    });

    it('shows the volume off icon for a volume of 0 even when not muted', () => {
      patchState(settings, { volume: 0, muted: false });
      fixture.detectChanges();
      expect(icons()[2]).toBe('volume_off');
    });

    it('shows the mute icon only when muted or silent', () => {
      expect(icons()[2]).toBe('volume_up');
      buttons()[2].click();
      fixture.detectChanges();
      expect(settings.muted()).toBeTrue();
      expect(icons()[2]).toBe('volume_off');
      buttons()[2].click();
      fixture.detectChanges();
      expect(icons()[2]).toBe('volume_up');
      settings.setVolume(0);
      fixture.detectChanges();
      expect(icons()[2]).toBe('volume_off');
    });

    it('labels the buttons', () => {
      expect(buttons()[2].getAttribute('aria-label')).toBe(
        'layout-song-page.mute-button-aria-label',
      );
      expect(buttons()[3].getAttribute('aria-label')).toBe(
        'layout-song-page.help-button-aria-label',
      );
    });
  });

  it('opens the help dialog', () => {
    create();
    buttons()[3].click();
    expect(dialogOpen).toHaveBeenCalledOnceWith(LayoutSongHelpDialogComponent);
  });

  describe('lyrics', () => {
    beforeEach(() => create());
    const shown = () => component.shownLyricSegments();

    it('shows the first two lines before the song starts', () => {
      expect(shown()).toEqual([segments[0], segments[1]]);
    });

    it('shows the line being sung and the next one', () => {
      const mid = (segments[3].start + segments[3].end) / 2;
      tickTo(mid);
      expect(shown()).toEqual([segments[3], segments[4]]);
    });

    it('shows the line that just ended and the next while in a gap', () => {
      const gap = segments.findIndex(
        (s, i) => i > 0 && s.start > segments[i - 1].end + 0.01,
      );
      if (gap === -1) {
        pending('the lyrics have no gaps');
      }
      tickTo((segments[gap - 1].end + segments[gap].start) / 2);
      expect(shown()).toEqual([segments[gap - 1], segments[gap]]);
    });

    it('shows only the last line after the song ends', () => {
      tickTo(segments[segments.length - 1].end + 5);
      expect(shown()).toEqual([segments[segments.length - 1]]);
    });

    it('includes the exact start and end time of a line that has a gap on both sides', () => {
      const i = segments.findIndex(
        (x, n) =>
          n > 0 &&
          n < segments.length - 1 &&
          x.start > segments[n - 1].end &&
          x.end < segments[n + 1].start,
      );
      if (i === -1) {
        pending('every line touches its neighbours');
      }
      tickTo(segments[i].start);
      expect(shown()[0]).toBe(segments[i]);
      tickTo(segments[i].end);
      expect(shown()[0]).toBe(segments[i]);
    });

    it('treats the start and the end of a line as part of it', () => {
      tickTo(segments[2].start);
      expect(shown()[0]).toBe(segments[2]);
      tickTo(segments[2].end);
      expect(shown()[0]).toBe(segments[2]);
    });

    it('gives the lyrics view the current time and lines', () => {
      tickTo(segments[1].start + 0.1);
      const view = fixture.debugElement.query(By.directive(LyricsViewComponent))
        .componentInstance as LyricsViewComponent;
      expect(view.currentTime()).toBe(segments[1].start + 0.1);
      expect(view.shownLyricSegments()).toEqual(component.shownLyricSegments());
    });

    it('includes a word from its exact start time', () => {
      const w = WORDS_WITH_COMPONENTS_IN_LAYOUT_SONG_LYRICS.find(
        (x, n, all) =>
          n > 0 &&
          x.start > all[n - 1].end + (all[n - 1].end - all[n - 1].start) * 0.2,
      )!;
      tickTo(w.start);
      expect(component.currentLyricWords()).toContain(w);
    });

    it('lists the words with keys that are being sung, a little after they end', () => {
      const w = WORDS_WITH_COMPONENTS_IN_LAYOUT_SONG_LYRICS[0];
      tickTo((w.start + w.end) / 2);
      expect(component.currentLyricWords()).toContain(w);
      tickTo(w.end + (w.end - w.start) * 0.1);
      expect(component.currentLyricWords()).toContain(w);
      tickTo(w.end + (w.end - w.start) * 0.3);
      expect(component.currentLyricWords()).not.toContain(w);
      tickTo(w.start - 0.01);
      expect(component.currentLyricWords()).not.toContain(w);
    });
  });

  describe('layout', () => {
    beforeEach(() => create());

    it('is always shown, without guides, following the thumb 3 switch setting', () => {
      expect(layout().alwaysShowLayout()).toBeTrue();
      expect(layout().alwaysHideLayoutGuides()).toBeTrue();
      expect(layout().showThumb3Switch()).toBe(
        TestBed.inject(VisibilitySettingStore).layoutThumb3Switch(),
      );
    });

    it('hides the thumb 3 switch when the setting says so', () => {
      TestBed.inject(VisibilitySettingStore).set('layoutThumb3Switch', false);
      create();
      expect(layout().showThumb3Switch()).toBeFalse();
    });

    it('labels the keys of the characters of the current line', () => {
      const labels = Object.values(component.keyLabelMap()).flat();
      const chars = new Set(labels.map((l) => (l as { c: string }).c));
      expect(chars.size).toBeGreaterThan(0);
      for (const c of chars) {
        expect(segments[0].components).toContain(c);
      }
    });

    it('only labels plain keys of the primary layer', () => {
      for (const label of Object.values(component.keyLabelMap()).flat()) {
        expect((label as { layer: Layer }).layer).toBe(Layer.Primary);
        expect((label as { shiftKey: boolean }).shiftKey).toBeFalsy();
        expect((label as { altGraphKey: boolean }).altGraphKey).toBeFalsy();
      }
    });

    it('has no highlight while nothing is being sung', () => {
      expect(component.highlightKeyCombination().positionCodes).toEqual([]);
    });

    it('highlights the keys of the words being sung', () => {
      const w = WORDS_WITH_COMPONENTS_IN_LAYOUT_SONG_LYRICS.find(
        (x) => x.components?.length,
      )!;
      tickTo((w.start + w.end) / 2);
      const h = component.highlightKeyCombination();
      expect(h.positionCodes.length).toBeGreaterThan(0);
      expect(h.layer).toBe(Layer.Primary);
      expect(h.characterKeyPositionCode).toBe(-1);
      expect(layout().highlightKeyCombination()).toEqual(h);
    });
  });
});
