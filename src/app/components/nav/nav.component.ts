import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AsyncPipe } from '@angular/common';
import {
  Component,
  OnDestroy,
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
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { filter, map, shareReplay, take } from 'rxjs/operators';
import { NAV_LINKS } from 'src/app/data/nav-links';
import { Lesson } from 'src/app/models/topic.models';
import { IconGuardPipe } from 'src/app/pipes/icon-guard.pipe';
import { RealTitleCasePipe } from 'src/app/pipes/real-title-case.pipe';
import { LESSON_DATA_FOR_SEARCH, TOPICS } from '../../data/topics';

function searchLessons(query: string): Lesson[] {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) {
    return [];
  }

  const matchedById = new Map<string, Lesson>();
  for (const entry of LESSON_DATA_FOR_SEARCH) {
    if (!entry.key.toLowerCase().includes(normalizedQuery)) {
      continue;
    }
    if (!matchedById.has(entry.lesson.id)) {
      matchedById.set(entry.lesson.id, entry.lesson);
    }
  }
  return Array.from(matchedById.values());
}

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
    TranslatePipe,
    RealTitleCasePipe,
  ],
})
export class NavComponent implements OnInit, OnDestroy {
  public isWebSerialApiSupported = 'serial' in navigator;
  public topics = TOPICS;
  public navLinks = NAV_LINKS;
  public toggleSideMenuShortcut = 'meta.b';

  public readonly searchQuery = signal('');

  public readonly searchResult = computed(() => {
    const searchQuery = this.searchQuery();
    if (!searchQuery) {
      return null;
    }
    return searchLessons(searchQuery);
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

  async openHotkeyDialog() {
    const { HotkeyDialogComponent } = await import(
      '../hotkey-dialog/hotkey-dialog.component'
    );
    this.matDialog.open(HotkeyDialogComponent);
  }

  async openSerialLogDialog() {
    const { SerialLogDialogComponent } = await import(
      '../serial-log-dialog/serial-log-dialog.component'
    );
    this.matDialog.open(SerialLogDialogComponent, {
      width: '80vw',
      height: '80vh',
    });
  }

  private cleanSearchQuery() {
    this.searchQuery.set('');
  }
}
