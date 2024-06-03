import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
  inject,
} from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatListOption, MatSelectionList } from '@angular/material/list';
import { patchState } from '@ngrx/signals';
import { setEntities } from '@ngrx/signals/entities';
import { sort } from 'ramda';
import { ChordStore } from 'src/app/stores/chord.store';

const sortWithNumber = sort((a: number, b: number) => a - b);

@Component({
  selector: 'app-chord-page',
  standalone: true,
  imports: [CommonModule, MatButton, MatIcon, MatSelectionList, MatListOption],
  templateUrl: './chord-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChordPageComponent {
  chordStore = inject(ChordStore);

  @ViewChild('fileInput', { static: true })
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
      const chordsItem = data.history[0].find(
        (item: any) => item.type === 'chords',
      );
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
}
