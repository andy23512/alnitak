import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VisibilitySettingPanelContentComponent } from './visibility-setting-panel-content.component';

describe('VisibilitySettingPanelContentComponent', () => {
  let component: VisibilitySettingPanelContentComponent;
  let fixture: ComponentFixture<VisibilitySettingPanelContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisibilitySettingPanelContentComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VisibilitySettingPanelContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
