import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AsyncPipe } from '@angular/common';
import {
  Component,
  OnInit,
  ViewChild,
  computed,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormField, MatSuffix } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
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
import { MatTooltip } from '@angular/material/tooltip';
import {
  RouterLinkActive,
  RouterLinkWithHref,
  RouterOutlet,
} from '@angular/router';
import { HotkeysService } from '@ngneat/hotkeys';
import * as fuzzy from 'fuzzy';
import { uniqBy } from 'ramda';
import { Observable } from 'rxjs';
import { filter, map, shareReplay, take } from 'rxjs/operators';
import { NAV_LINKS } from 'src/app/data/nav-links';
import { IconGuardPipe } from 'src/app/pipes/icon-guard.pipe';
import { LESSON_DATA_FOR_SEARCH, TOPICS } from '../../data/topics';
import { HotkeyDialogComponent } from '../hotkey-dialog/hotkey-dialog.component';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  standalone: true,
  imports: [
    AsyncPipe,
    FormsModule,
    MatFormField,
    MatSuffix,
    MatIcon,
    MatButton,
    MatInput,
    MatListItem,
    MatListSubheaderCssMatStyler,
    MatNavList,
    MatSidenav,
    MatSidenavContainer,
    MatSidenavContent,
    MatTooltip,
    RouterLinkActive,
    RouterLinkWithHref,
    RouterOutlet,
    IconGuardPipe,
  ],
})
export class NavComponent implements OnInit {
  public topics = TOPICS;
  public navLinks = NAV_LINKS;
  public toggleSideMenuShortcut = 'meta.b';

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

  readonly hotkeysService = inject(HotkeysService);

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay(1),
    );

  ngOnInit(): void {
    this.hotkeysService
      .addShortcut({ keys: this.toggleSideMenuShortcut })
      .subscribe(() => this.drawer.toggle());
  }

  ngOnDestroy(): void {
    this.hotkeysService.removeShortcuts([this.toggleSideMenuShortcut]);
  }

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
