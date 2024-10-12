import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LayoutViewerPageComponent } from './layout-viewer-page.component';

describe('LayoutViewerPageComponent', () => {
  let component: LayoutViewerPageComponent;
  let fixture: ComponentFixture<LayoutViewerPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LayoutViewerPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LayoutViewerPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
