import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SevenSegmentComponent } from './seven-segment.component';

describe('SevenSegmentComponent', () => {
  let component: SevenSegmentComponent;
  let fixture: ComponentFixture<SevenSegmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SevenSegmentComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SevenSegmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
