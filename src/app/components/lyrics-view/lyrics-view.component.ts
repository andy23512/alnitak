import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  input,
} from '@angular/core';
import { LyricSegment } from 'src/app/models/lyrics.models';

@Component({
  selector: 'app-lyrics-view',
  templateUrl: 'lyrics-view.component.html',
  styleUrl: 'lyrics-view.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class LyricsViewComponent {
  @HostBinding('class') public hostClasses = ['block'];

  currentTime = input.required<number>();
  shownLyricSegments = input.required<LyricSegment[]>();
}
