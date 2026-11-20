import {
  Directive,
  Input,
  TemplateRef,
  ViewContainerRef,
  effect,
  inject,
  signal,
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

  private readonly key = signal<keyof VisibilitySetting | null>(null);

  @Input() set appVisible(key: keyof VisibilitySetting | null) {
    this.key.set(key);
  }

  constructor() {
    // Reads the setting inside an effect, so the content follows the setting
    // while it is on screen, not only when the key changes.
    effect(() => {
      const key = this.key();
      const visible = !key || this.visibilitySettingStore[key]();
      if (visible && !this.hasView) {
        this.viewContainer.createEmbeddedView(this.templateRef);
        this.hasView = true;
      } else if (!visible && this.hasView) {
        this.viewContainer.clear();
        this.hasView = false;
      }
    });
  }
}
