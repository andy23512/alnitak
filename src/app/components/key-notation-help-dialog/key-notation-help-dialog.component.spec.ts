import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KeyNotationHelpDialogComponent } from './key-notation-help-dialog.component';

describe('KeyNotationHelpDialogComponent', () => {
  let component: KeyNotationHelpDialogComponent;
  let fixture: ComponentFixture<KeyNotationHelpDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KeyNotationHelpDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(KeyNotationHelpDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
