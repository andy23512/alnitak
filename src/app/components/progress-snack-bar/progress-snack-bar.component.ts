import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
} from '@angular/core';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

export interface ProgressSnackBarData {
  message: string;
  progress: number;
}

@Component({
  selector: 'app-progress-snack-bar',
  templateUrl: 'progress-snack-bar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatProgressBar],
})
export class ProgressSnackBarComponent {
  public data: ProgressSnackBarData = inject(MAT_SNACK_BAR_DATA);
  public cdr = inject(ChangeDetectorRef);

  public updateProgress(progress: number) {
    this.data.progress = progress;
    this.cdr.markForCheck();
  }
}
