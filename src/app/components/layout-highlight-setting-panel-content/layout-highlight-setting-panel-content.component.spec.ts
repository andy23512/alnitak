import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LayoutHighlightSettingPanelContentComponent } from './layout-highlight-setting-panel-content.component';

describe('LayoutHighlightSettingPanelContentComponent', () => {
  let component: LayoutHighlightSettingPanelContentComponent;
  let fixture: ComponentFixture<LayoutHighlightSettingPanelContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LayoutHighlightSettingPanelContentComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(
      LayoutHighlightSettingPanelContentComponent,
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
