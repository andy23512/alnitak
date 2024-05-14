import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { Component, ViewChild, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import {
  MatSidenav,
  MatSidenavContent,
  MatSidenavModule,
} from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import * as fuzzy from 'fuzzy';
import { uniqBy } from 'ramda';
import { Observable } from 'rxjs';
import { filter, map, shareReplay, take } from 'rxjs/operators';
import { HotkeyDialogComponent } from '../components/hotkey-dialog/hotkey-dialog.component';
import { LESSON_DATA_FOR_SEARCH, TOPICS } from '../data/topics';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatListModule,
    MatSidenavContent,
    MatSidenavModule,
    MatToolbarModule,
    MatTooltipModule,
    RouterModule,
  ],
})
export class NavComponent {
  public topics = TOPICS;
  public readonly searchQuery = signal('');

  public readonly searchResult = computed(() => {
    const searchQuery = this.searchQuery();
    if (!searchQuery) {
      return null;
    }
    return uniqBy(
      (d) => d.id,
      fuzzy
        .filter(searchQuery, LESSON_DATA_FOR_SEARCH, {
          extract: (d) => d.key,
        })
        .map((d) => d.original.lesson),
    );
  });

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
    this.cleanSearchQuery();
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

  private cleanSearchQuery() {
    this.searchQuery.set('');
  }
}
