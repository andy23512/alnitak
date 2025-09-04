import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChordPracticeSubPageComponent } from './chord-practice-sub-page.component';

describe('ChordPageComponent', () => {
  let component: ChordPracticeSubPageComponent;
  let fixture: ComponentFixture<ChordPracticeSubPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChordPracticeSubPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ChordPracticeSubPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
