import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KeyLabelComponent } from './key-label.component';

describe('KeyLabelComponent', () => {
  let component: KeyLabelComponent;
  let fixture: ComponentFixture<KeyLabelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KeyLabelComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(KeyLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
