import { JsonPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
  computed,
  inject,
  signal,
} from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import {
  MatListOption,
  MatSelectionList,
  MatSelectionListChange,
} from '@angular/material/list';
import { patchState } from '@ngrx/signals';
import { setEntities } from '@ngrx/signals/entities';
import { sort } from 'ramda';
import { ChordInputKeysComponent } from 'src/app/components/chord-input-keys/chord-input-keys.component';
import { ChordOutputKeysComponent } from 'src/app/components/chord-output-keys/chord-output-keys.component';
import { ChordWithChordKeys } from 'src/app/models/chord.models';
import { ChordStore } from 'src/app/stores/chord.store';
import { KeyboardLayoutStore } from 'src/app/stores/keyboard-layout.store';
import { getChordKeyFromActionCode } from 'src/app/utils/layout.utils';

const sortWithNumber = sort((a: number, b: number) => a - b);

@Component({
  selector: 'app-chord-page',
  standalone: true,
  imports: [
    JsonPipe,
    MatButton,
    MatIcon,
    MatSelectionList,
    MatListOption,
    ChordInputKeysComponent,
    ChordOutputKeysComponent,
  ],
  templateUrl: './chord-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChordPageComponent {
  readonly chordStore = inject(ChordStore);
  readonly keyboardLayout = inject(KeyboardLayoutStore).selectedEntity;

  readonly selectedChordIds = signal<Set<string>>(new Set());
  readonly stage = signal<'setting' | 'practice'>('setting');

  chords = computed(() => {
    const rawChords = this.chordStore.entities();
    const keyboardLayout = this.keyboardLayout();
    return rawChords
      .map((c) => ({
        ...c,
        inputKeys: c.input.map((a) =>
          getChordKeyFromActionCode(a, keyboardLayout),
        ),
        outputKeys: c.output.map((a) =>
          getChordKeyFromActionCode(a, keyboardLayout),
        ),
      }))
      .filter(
        (c) =>
          c.inputKeys.every((r) => r !== null) &&
          c.outputKeys.every((r) => r !== null),
      ) as ChordWithChordKeys[];
  });

  @ViewChild('fileInput')
  public fileInput!: ElementRef<HTMLInputElement>;

  loadChordFile() {
    if (typeof FileReader === 'undefined') {
      return;
    }
    const fileInputElement = this.fileInput.nativeElement;
    if (
      fileInputElement.files === null ||
      fileInputElement.files.length === 0
    ) {
      return;
    }
    const reader = new FileReader();

    reader.onload = (e) => {
      if (!e.target?.result) {
        return;
      }
      const data = JSON.parse(e.target.result as string);
      if (!data) {
        return;
      }
      let chordsItem = null;
      if (data.history) {
        chordsItem = data.history[0].find(
          (item: any) => item.type === 'chords',
        );
      } else {
        chordsItem = data;
      }
      if (!chordsItem) {
        return;
      }
      patchState(
        this.chordStore,
        setEntities(
          (chordsItem.chords as [number[], number[]][]).map(
            ([input, output]) => {
              const cleanedInput = input.filter((a) => a > 0);
              return {
                id: sortWithNumber(cleanedInput).join('_'),
                input: cleanedInput,
                output,
              };
            },
          ),
        ),
      );
    };

    reader.readAsText(fileInputElement.files[0]);
  }

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
    this.stage.set('practice');
  }
}
