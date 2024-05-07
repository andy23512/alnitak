import {
  Directive,
  Input,
  TemplateRef,
  ViewContainerRef,
  inject,
} from '@angular/core';
import { Setting } from '../models/setting.models';
import { SettingStore } from '../stores/setting.store';

@Directive({
  selector: '[appVisible]',
  standalone: true,
})
export class VisibleDirective {
  private hasView = false;

  private templateRef = inject(TemplateRef);
  private viewContainer = inject(ViewContainerRef);
  private settingStore = inject(SettingStore);

  @Input() set appVisible(key: keyof Setting['hidden']) {
    const hidden = this.settingStore.hidden()[key];
    if (!hidden && !this.hasView) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (hidden && this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;
    }
  }
}
