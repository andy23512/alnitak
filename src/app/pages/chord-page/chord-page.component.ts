import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { MatSelectionListChange } from '@angular/material/list';
import { ChordPracticeSettingComponent } from 'src/app/components/chord-practice-setting/chord-practice-setting.component';
import { ChordPracticeComponent } from 'src/app/components/chord-practice/chord-practice.component';
import { ChordWithChordKeys } from 'src/app/models/chord.models';
import { ChordPracticeStore } from 'src/app/stores/chord-practice.store';
import { ChordStore } from 'src/app/stores/chord.store';
import { KeyboardLayoutStore } from 'src/app/stores/keyboard-layout.store';
import { getChordKeyFromActionCode } from 'src/app/utils/layout.utils';

@Component({
  selector: 'app-chord-page',
  standalone: true,
  imports: [ChordPracticeSettingComponent, ChordPracticeComponent],
  templateUrl: './chord-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChordPageComponent {
  readonly chordStore = inject(ChordStore);
  readonly keyboardLayout = inject(KeyboardLayoutStore).selectedEntity;
  readonly chordPracticeStore = inject(ChordPracticeStore);

  readonly selectedChordIds = signal<Set<string>>(new Set());
  readonly stage = signal<'setting' | 'practice'>('setting');

  chords = computed(() => {
    const rawChords = this.chordStore.entities();
    const keyboardLayout = this.keyboardLayout();
    return rawChords
      .map((c) => {
        const outputKeys = c.output.map((a) =>
          getChordKeyFromActionCode(a, keyboardLayout),
        );
        return {
          ...c,
          inputKeys: c.input.map((a) =>
            getChordKeyFromActionCode(a, keyboardLayout),
          ),
          outputKeys,
          outputText: outputKeys
            .filter((k) => k?.type === 'character')
            .map((k) => k?.value)
            .join(''),
        };
      })
      .filter(
        (c) =>
          c.inputKeys.every((r) => r !== null) &&
          c.outputKeys.every((r) => r !== null),
      ) as ChordWithChordKeys[];
  });

  onChordSelectionChange({ options }: MatSelectionListChange) {
    let selectedChordIds = this.selectedChordIds();
    options.forEach((option) => {
      if (option.selected) {
        selectedChordIds.add((option.value as ChordWithChordKeys).id);
      } else {
        selectedChordIds.delete((option.value as ChordWithChordKeys).id);
      }
    });
    this.selectedChordIds.set(selectedChordIds);
  }

  startChordPractice() {
    this.chordPracticeStore.setChords(
      this.chords().filter((c) => this.selectedChordIds().has(c.id)),
    );
    this.stage.set('practice');
  }
}
