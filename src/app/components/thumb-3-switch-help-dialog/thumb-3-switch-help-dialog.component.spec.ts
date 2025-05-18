import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Thumb3SwitchHelpDialogComponent } from './thumb-3-switch-help-dialog.component';

describe('Thumb3SwitchHelpDialogComponent', () => {
  let component: Thumb3SwitchHelpDialogComponent;
  let fixture: ComponentFixture<Thumb3SwitchHelpDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Thumb3SwitchHelpDialogComponent]
    });
    fixture = TestBed.createComponent(Thumb3SwitchHelpDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
