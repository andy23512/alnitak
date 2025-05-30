import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickSettingPanelContentComponent } from './quick-setting-panel-content.component';

describe('QuickSettingPanelContentComponent', () => {
  let component: QuickSettingPanelContentComponent;
  let fixture: ComponentFixture<QuickSettingPanelContentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QuickSettingPanelContentComponent]
    });
    fixture = TestBed.createComponent(QuickSettingPanelContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
