import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-chord-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chord-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChordPageComponent {}
