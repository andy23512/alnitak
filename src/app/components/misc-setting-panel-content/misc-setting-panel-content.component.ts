import { Component, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { KeyLabelType, Layer } from 'src/app/models/device-layout.models';
import { MiscSettingStore } from 'src/app/stores/misc-setting.store';
import { LayoutComponent } from '../layout/layout.component';

@Component({
  selector: 'app-misc-setting-panel-content',
  templateUrl: './misc-setting-panel-content.component.html',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, FormsModule, LayoutComponent],
})
export class MiscSettingPanelContentComponent {
  miscSettingStore = inject(MiscSettingStore);
  KeyLabelType = KeyLabelType;
  Layer = Layer;

  thumbRotationAngle = computed(() =>
    this.miscSettingStore.thumbRotationAngle(),
  );

  setThumbRotationAngle(angle: number) {
    this.miscSettingStore.set('thumbRotationAngle', angle);
  }
}
