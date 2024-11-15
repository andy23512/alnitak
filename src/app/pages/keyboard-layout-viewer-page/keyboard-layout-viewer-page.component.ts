import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { KeyboardLayoutComponent } from 'src/app/components/keyboard-layout/keyboard-layout.component';

@Component({
  selector: 'app-keyboard-layout-viewer-page',
  standalone: true,
  imports: [KeyboardLayoutComponent, MatCheckboxModule, FormsModule],
  templateUrl: './keyboard-layout-viewer-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KeyboardLayoutViewerPageComponent {
  @HostBinding('class') classes = 'flex flex-col gap-2 h-screen';
  shiftKey = signal(false);
  altGraphKey = signal(false);
}
