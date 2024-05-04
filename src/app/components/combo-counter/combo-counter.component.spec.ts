import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComboCounterComponent } from './combo-counter.component';

describe('ComboCounterComponent', () => {
  let component: ComboCounterComponent;
  let fixture: ComponentFixture<ComboCounterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComboCounterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ComboCounterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
