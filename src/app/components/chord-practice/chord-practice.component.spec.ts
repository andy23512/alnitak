import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChordPracticeComponent } from './chord-practice.component';

describe('ChordPracticeComponent', () => {
  let component: ChordPracticeComponent;
  let fixture: ComponentFixture<ChordPracticeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChordPracticeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ChordPracticeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
