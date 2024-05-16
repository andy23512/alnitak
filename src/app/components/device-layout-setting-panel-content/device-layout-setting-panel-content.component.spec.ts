import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeviceLayoutSettingPanelContentComponent } from './device-layout-setting-panel-content.component';

describe('DeviceLayoutSettingPanelContentComponent', () => {
  let component: DeviceLayoutSettingPanelContentComponent;
  let fixture: ComponentFixture<DeviceLayoutSettingPanelContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeviceLayoutSettingPanelContentComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DeviceLayoutSettingPanelContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
