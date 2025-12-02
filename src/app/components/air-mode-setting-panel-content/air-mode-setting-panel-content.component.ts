import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslatePipe } from '@ngx-translate/core';
import { AirModeSettingStore } from 'src/app/stores/air-mode-setting.store';

@Component({
  selector: 'app-air-mode-setting-panel-content',
  standalone: true,
  imports: [
    CommonModule,
    MatCheckbox,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    TranslatePipe,
  ],
  templateUrl: './air-mode-setting-panel-content.component.html',
})
export class AirModeSettingPanelContentComponent {
  airModeSettingStore = inject(AirModeSettingStore);

  enabled = computed(() => this.airModeSettingStore.enabled());
  characterEntrySpeed = computed(() =>
    this.airModeSettingStore.characterEntrySpeed(),
  );
  chordSpeed = computed(() => this.airModeSettingStore.chordSpeed());

  setEnabled(enable: boolean) {
    this.airModeSettingStore.set('enabled', enable);
  }

  setCharacterEntrySpeed(speed: number) {
    this.airModeSettingStore.set('characterEntrySpeed', speed);
  }

  setChordSpeed(speed: number) {
    this.airModeSettingStore.set('chordSpeed', speed);
  }
}
