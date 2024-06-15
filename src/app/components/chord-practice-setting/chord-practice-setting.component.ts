import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostBinding,
  inject,
  input,
  output,
  ViewChild,
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
import { ChordWithChordKeys } from 'src/app/models/chord.models';
import { ChordStore } from 'src/app/stores/chord.store';
import { ChordInputKeysComponent } from '../chord-input-keys/chord-input-keys.component';
import { ChordOutputKeysComponent } from '../chord-output-keys/chord-output-keys.component';

const sortWithNumber = sort((a: number, b: number) => a - b);

@Component({
  selector: 'app-chord-practice-setting',
  standalone: true,
  imports: [
    MatButton,
    MatIcon,
    MatSelectionList,
    MatListOption,
    ChordInputKeysComponent,
    ChordOutputKeysComponent,
  ],
  templateUrl: './chord-practice-setting.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChordPracticeSettingComponent {
  readonly chordStore = inject(ChordStore);
  readonly chords = input.required<ChordWithChordKeys[]>();
  readonly selectedChordIds = input.required<Set<ChordWithChordKeys['id']>>();
  readonly selectionChange = output<MatSelectionListChange>();
  readonly startPractice = output<void>();

  @HostBinding() classes = 'flex flex-col';

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

  onChordSelectionChange(event: MatSelectionListChange) {
    this.selectionChange.emit(event);
  }
}
