import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AsyncPipe, NgIf } from '@angular/common';
import { Component, ViewChild, inject } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import {
  MatListItem,
  MatListSubheaderCssMatStyler,
  MatNavList,
} from '@angular/material/list';
import {
  MatSidenav,
  MatSidenavContainer,
  MatSidenavContent,
} from '@angular/material/sidenav';
import { MatToolbar } from '@angular/material/toolbar';
import { MatTooltip } from '@angular/material/tooltip';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map, shareReplay, take } from 'rxjs/operators';
import { HotkeyDialogComponent } from '../components/hotkey-dialog/hotkey-dialog.component';
import { TOPICS } from '../data/topics';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
  standalone: true,
  imports: [
    MatSidenavContainer,
    MatSidenav,
    MatNavList,
    MatListItem,
    MatSidenavContent,
    NgIf,
    MatIconButton,
    MatIcon,
    RouterOutlet,
    AsyncPipe,
    RouterLink,
    RouterLinkActive,
    MatListSubheaderCssMatStyler,
    MatToolbar,
    MatTooltip,
    MatDivider,
  ],
})
export class NavComponent {
  public topics = TOPICS;

  private readonly breakpointObserver = inject(BreakpointObserver);
  private readonly matDialog = inject(MatDialog);

  @ViewChild('drawer') public drawer!: MatSidenav;

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay(1),
    );

  onNavLinkClick() {
    this.isHandset$
      .pipe(
        take(1),
        filter((isHandSet) => isHandSet),
      )
      .subscribe(() => {
        this.drawer.close();
      });
  }

  openHotkeyDialog() {
    this.matDialog.open(HotkeyDialogComponent);
  }
}
