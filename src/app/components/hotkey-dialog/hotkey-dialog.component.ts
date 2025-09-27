import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { HotkeysShortcutPipe } from '@ngneat/hotkeys';

export const HOTKEY_GROUPS = [
  {
    name: 'Global',
    hotkeys: [
      { key: '?', description: 'Toggle hotkey dialog' },
      { key: 'meta.b', description: 'Toggle side menu' },
    ],
  },
  {
    name: 'Home Page',
    hotkeys: [{ key: 'space', description: 'Go to first lesson' }],
  },
  {
    name: 'Lesson Page',
    hotkeys: [
      { key: 'meta.left', description: 'Go to previous lesson' },
      { key: 'meta.right', description: 'Go to next lesson' },
      { key: 'space', description: 'Start/resume lesson' },
      { key: 'escape', description: 'Pause lesson' },
    ],
  },
  {
    name: 'Chord Practice Page',
    hotkeys: [
      { key: 'space', description: 'Start/resume practice' },
      { key: 'escape', description: 'Pause practice' },
    ],
  },
  {
    name: 'Layout Viewer Page',
    hotkeys: [
      { key: 'alt.1', description: 'Switch to the primary layer' },
      { key: 'alt.2', description: 'Switch to the numeric layer' },
      { key: 'alt.3', description: 'Switch to the functional layer' },
      { key: 'alt.s', description: 'Toggle the Shift modifier' },
      { key: 'alt.a', description: 'Toggle the AltGr modifier' },
    ],
  },
];

@Component({
  selector: 'app-hotkey-dialog',
  standalone: true,
  imports: [
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle,
    MatButton,
    HotkeysShortcutPipe,
  ],
  templateUrl: './hotkey-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HotkeyDialogComponent {
  hotkeyGroups = HOTKEY_GROUPS;
  keyAlias = { escape: 'esc', space: 'space' };
}
