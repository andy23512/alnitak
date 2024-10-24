import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AirModeSettingPanelContentComponent } from './air-mode-setting-panel-content.component';

describe('AirModeSettingPanelContentComponent', () => {
  let component: AirModeSettingPanelContentComponent;
  let fixture: ComponentFixture<AirModeSettingPanelContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AirModeSettingPanelContentComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AirModeSettingPanelContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
