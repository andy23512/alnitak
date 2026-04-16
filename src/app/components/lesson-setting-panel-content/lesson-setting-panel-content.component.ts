import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatOption, MatSelect } from '@angular/material/select';
import { TranslatePipe } from '@ngx-translate/core';
import { RealTitleCasePipe } from 'src/app/pipes/real-title-case.pipe';
import { LessonSettingStore } from 'src/app/stores/lesson-setting.store';

@Component({
  selector: 'app-lesson-setting-panel-content',
  templateUrl: 'lesson-setting-panel-content.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatFormField,
    MatSelect,
    MatOption,
    MatLabel,
    TranslatePipe,
    RealTitleCasePipe,
  ],
})
export class LessonSettingPanelContentComponent {
  public lessonSettingStore = inject(LessonSettingStore);
  public languageCode = this.lessonSettingStore.languageCode;
  public keyboardLayoutId = this.lessonSettingStore.keyboardLayoutId;
  public keyboardLayoutOptions = this.lessonSettingStore.keyboardLayoutOptions;

  public setKeyboardLayoutId(keyboardLayoutId: string) {
    this.lessonSettingStore.setKeyboardLayoutId(keyboardLayoutId);
  }
}
