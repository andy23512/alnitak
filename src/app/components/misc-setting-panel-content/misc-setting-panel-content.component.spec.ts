import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiscSettingPanelContentComponent } from './misc-setting-panel-content.component';

describe('MiscSettingPanelContentComponent', () => {
  let component: MiscSettingPanelContentComponent;
  let fixture: ComponentFixture<MiscSettingPanelContentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MiscSettingPanelContentComponent]
    });
    fixture = TestBed.createComponent(MiscSettingPanelContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
