import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KeyboardLayoutViewerPageComponent } from './keyboard-layout-viewer-page.component';

describe('KeyboardLayoutViewerPageComponent', () => {
  let component: KeyboardLayoutViewerPageComponent;
  let fixture: ComponentFixture<KeyboardLayoutViewerPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KeyboardLayoutViewerPageComponent]
    });
    fixture = TestBed.createComponent(KeyboardLayoutViewerPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
