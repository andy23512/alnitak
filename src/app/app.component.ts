import { Component, inject } from '@angular/core';
import { NavComponent } from './nav/nav.component';
import { DeviceLayoutStore } from './stores/device-layout.store';
import { KeyboardLayoutStore } from './stores/keyboard-layout.store';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [NavComponent],
})
export class AppComponent {
  readonly deviceLayoutStore = inject(DeviceLayoutStore);
  readonly keyboardLayoutStore = inject(KeyboardLayoutStore);
}
