import {
  ChangeDetectionStrategy,
  Component,
  computed,
  HostBinding,
  inject,
  OnInit,
  Signal,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';
import { LayoutSongHelpDialogComponent } from 'src/app/components/layout-song-help-dialog/layout-song-help-dialog.component';
import { LayoutComponent } from 'src/app/components/layout/layout.component';
import { LyricsViewComponent } from 'src/app/components/lyrics-view/lyrics-view.component';
import {
  LAYOUT_SONG_LYRICS,
  WORDS_WITH_COMPONENTS_IN_LAYOUT_SONG_LYRICS,
} from 'src/app/const/lyrics.const';
import { DEFAULT_DEVICE_LAYOUT } from 'src/app/data/device-layouts';
import {
  HighlightKeyCombination,
  KeyLabel,
  KeyLabelType,
  Layer,
} from 'src/app/models/device-layout.models';
import { IconGuardPipe } from 'src/app/pipes/icon-guard.pipe';
import { INITIAL_HIGHLIGHT_SETTING } from 'src/app/stores/highlight-setting.store';
import { KeyboardLayoutStore } from 'src/app/stores/keyboard-layout.store';
import { VisibilitySettingStore } from 'src/app/stores/visibility-setting.store';
import {
  getCharacterActionCodesFromCharacterKeyCode,
  getCharacterKeyCodeFromCharacter,
  getHighlightKeyCombinationFromKeyCombinations,
  getKeyCombinationsFromActionCodes,
  getModifierKeyPositionCodeMap,
} from 'src/app/utils/layout.utils';
import { nonNullable } from 'src/app/utils/non-nullable.utils';

const AUDIO_URL = './assets/layout.mp3';

@Component({
  selector: 'app-layout-song-page',
  templateUrl: 'layout-song-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    IconGuardPipe,
    MatIconModule,
    MatSliderModule,
    MatButtonModule,
    LyricsViewComponent,
    LayoutComponent,
  ],
})
export class LayoutSongPageComponent implements OnInit {
  @HostBinding('class') classes =
    'flex flex-col gap-2 h-full w-full relative overflow-hidden';
  readonly visibilitySettingStore = inject(VisibilitySettingStore);

  isPlaying = signal(false);
  currentTime = signal(0);
  progress = computed(() => {
    if (!this.audio) {
      return 0;
    }
    return (this.currentTime() / this.audio.duration) * 100;
  });
  error = signal<string | null>(null);
  private audio: HTMLAudioElement | null = null;

  ngOnInit() {
    this.loadAudio();
  }

  loadAudio() {
    this.audio?.pause();
    this.audio = new Audio(AUDIO_URL);

    this.audio.addEventListener('timeupdate', this.updateProgress.bind(this));
    this.audio.addEventListener('ended', () => {
      this.isPlaying.set(false);
    });
    this.audio.addEventListener('canplay', () => this.error.set(null));
    this.audio.addEventListener('error', () => {
      this.error.set('Unable to load audio. Please check the audio source.');
      this.isPlaying.set(false);
    });
  }

  handlePlayPause() {
    if (this.audio) {
      if (this.isPlaying()) {
        this.audio.pause();
      } else {
        this.audio.play().catch(() => {
          this.error.set('Playback failed. Please try again.');
        });
      }
      this.isPlaying.set(!this.isPlaying());
    }
  }

  handleSeek(value: number) {
    if (this.audio) {
      const newTime = (value / 100) * this.audio.duration;
      this.audio.currentTime = newTime;
    }
  }

  updateProgress() {
    if (this.audio) {
      const currentTime = this.audio.currentTime;
      this.currentTime.set(currentTime);
    }
  }

  shownLyricSegments = computed(() => {
    const currentTime = this.currentTime();
    let currentLyricIndex = LAYOUT_SONG_LYRICS.segments.findIndex(
      ({ start, end }) => start <= currentTime && currentTime <= end,
    );
    let nextLyricIndex: number | null = null;
    if (currentLyricIndex === -1) {
      nextLyricIndex = LAYOUT_SONG_LYRICS.segments.findIndex(
        ({ start }) => currentTime < start,
      );
      if (nextLyricIndex === -1) {
        currentLyricIndex = LAYOUT_SONG_LYRICS.segments.length - 1;
      } else if (nextLyricIndex === 0) {
        currentLyricIndex = 0;
        nextLyricIndex = 1;
      } else {
        currentLyricIndex = nextLyricIndex - 1;
      }
    } else {
      nextLyricIndex = currentLyricIndex + 1;
      if (nextLyricIndex >= LAYOUT_SONG_LYRICS.segments.length) {
        nextLyricIndex = null;
      }
    }
    return [
      LAYOUT_SONG_LYRICS.segments[currentLyricIndex],
      ...(nextLyricIndex !== null
        ? [LAYOUT_SONG_LYRICS.segments[nextLyricIndex]]
        : []),
    ].filter((v) => !!v);
  });

  currentLyricWords = computed(() => {
    const currentTime = this.currentTime();
    return WORDS_WITH_COMPONENTS_IN_LAYOUT_SONG_LYRICS.filter(
      (w) =>
        w.start <= currentTime && w.end + (w.end - w.start) * 0.2 > currentTime,
    );
  });

  readonly characterKeyCodeMap =
    inject(KeyboardLayoutStore).characterKeyCodeMap;

  readonly lessonCharactersDevicePositionCodes = computed(() => {
    const characterKeyCodeMap = this.characterKeyCodeMap();
    const [currentLyricSegment] = this.shownLyricSegments();
    const deviceLayout = DEFAULT_DEVICE_LAYOUT;
    return currentLyricSegment.components
      ?.map((c) => {
        const characterKeyCode = getCharacterKeyCodeFromCharacter(
          c,
          characterKeyCodeMap,
        );
        if (!characterKeyCode) {
          return null;
        }
        const actionCodes =
          getCharacterActionCodesFromCharacterKeyCode(characterKeyCode);
        if (actionCodes.length === 0) {
          return null;
        }
        return {
          c,
          characterDeviceKeys: getKeyCombinationsFromActionCodes(
            actionCodes,
            deviceLayout,
          ),
        };
      })
      .filter(nonNullable);
  });

  readonly modifierKeyPositionCodeMap = computed(() => {
    const deviceLayout = DEFAULT_DEVICE_LAYOUT;
    if (!deviceLayout) {
      return null;
    }
    return getModifierKeyPositionCodeMap(deviceLayout);
  });

  readonly keyLabelMap = computed(() => {
    const lessonCharactersDevicePositionCodes =
      this.lessonCharactersDevicePositionCodes();
    if (!lessonCharactersDevicePositionCodes) {
      return {};
    }
    const modifierKeyPositionCodeMap = this.modifierKeyPositionCodeMap();
    if (!modifierKeyPositionCodeMap) {
      return {};
    }
    const keyLabelMap: Record<number, KeyLabel[]> = {};
    lessonCharactersDevicePositionCodes.forEach((v) => {
      v?.characterDeviceKeys?.forEach(
        ({ characterKeyPositionCode, layer, shiftKey, altGraphKey }) => {
          if (layer !== Layer.Primary || shiftKey || altGraphKey) {
            return;
          }
          const d = {
            type: KeyLabelType.String as const,
            c: v.c,
            title: `Character: ${v.c}`,
            layer,
            shiftKey,
            altGraphKey,
          };
          if (!keyLabelMap[characterKeyPositionCode]) {
            keyLabelMap[characterKeyPositionCode] = [d];
          } else {
            keyLabelMap[characterKeyPositionCode].push(d);
          }
        },
      );
    });
    return keyLabelMap;
  });

  readonly highlightCharacterKeyCombinationMap: Signal<
    Record<string, HighlightKeyCombination>
  > = computed(() => {
    const lessonCharactersDevicePositionCodes =
      this.lessonCharactersDevicePositionCodes();
    const highlightSetting = INITIAL_HIGHLIGHT_SETTING;
    const deviceLayout = DEFAULT_DEVICE_LAYOUT;
    if (!lessonCharactersDevicePositionCodes || !deviceLayout) {
      return {};
    }
    const modifierKeyPositionCodeMap = this.modifierKeyPositionCodeMap();
    const highlightCharacterKeyMap: Record<string, HighlightKeyCombination> =
      {};
    lessonCharactersDevicePositionCodes.forEach((k) => {
      if (!k?.characterDeviceKeys || !modifierKeyPositionCodeMap) {
        return;
      }
      highlightCharacterKeyMap[k.c] =
        getHighlightKeyCombinationFromKeyCombinations(
          k.characterDeviceKeys,
          modifierKeyPositionCodeMap,
          highlightSetting,
        );
    });
    return highlightCharacterKeyMap;
  });

  readonly highlightKeyCombination = computed(() => {
    const currentLyricWords = this.currentLyricWords() ?? [];
    const components = currentLyricWords
      .map((w) => w.components)
      .flat()
      .filter((v) => !!v) as string[];
    const highlightCharacterKeyCombinationMap =
      this.highlightCharacterKeyCombinationMap();
    const positionCodes = components
      .map((c) => highlightCharacterKeyCombinationMap[c]?.positionCodes)
      .flat();
    return {
      characterKeyPositionCode: -1,
      layer: Layer.Primary,
      shiftKey: false,
      altGraphKey: false,
      positionCodes,
      score: -1,
    };
  });

  private readonly matDialog = inject(MatDialog);

  public openLayoutSongHelpDialog() {
    this.matDialog.open(LayoutSongHelpDialogComponent);
  }
}
