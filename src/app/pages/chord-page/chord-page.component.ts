import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatTabLink, MatTabNav, MatTabNavPanel } from '@angular/material/tabs';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { IconGuardPipe } from 'src/app/pipes/icon-guard.pipe';

@Component({
  selector: 'app-chord-page',
  standalone: true,
  templateUrl: 'chord-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterOutlet,
    MatTabNav,
    MatTabNavPanel,
    MatTabLink,
    RouterLink,
    RouterLinkActive,
    MatIcon,
    IconGuardPipe,
  ],
})
export class ChordPageComponent {}
