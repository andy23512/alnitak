import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeleteChordsConfirmDialogComponent } from './delete-chords-confirm-dialog.component';

describe('DeleteChordsConfirmDialogComponent', () => {
  let component: DeleteChordsConfirmDialogComponent;
  let fixture: ComponentFixture<DeleteChordsConfirmDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteChordsConfirmDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteChordsConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
