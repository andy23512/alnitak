import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SpeedoMeterComponent } from './speedo-meter.component';

describe('SpeedoMeterComponent', () => {
  let component: SpeedoMeterComponent;
  let fixture: ComponentFixture<SpeedoMeterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpeedoMeterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SpeedoMeterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
