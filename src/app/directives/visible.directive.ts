import {
  Directive,
  Input,
  TemplateRef,
  ViewContainerRef,
  inject,
} from '@angular/core';
import { VisibilitySetting } from '../models/visibility-setting.models';
import { VisibilitySettingStore } from '../stores/visibility-setting.store';

@Directive({
  selector: '[appVisible]',
  standalone: true,
})
export class VisibleDirective {
  private hasView = false;

  private templateRef = inject(TemplateRef);
  private viewContainer = inject(ViewContainerRef);
  private visibilitySettingStore = inject(VisibilitySettingStore);

  @Input() set appVisible(key: keyof VisibilitySetting | null) {
    const visible = !key || this.visibilitySettingStore[key]();
    if (visible && !this.hasView) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (!visible && this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;
    }
  }
}
