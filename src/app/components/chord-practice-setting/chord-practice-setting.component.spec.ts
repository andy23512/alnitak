import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChordPracticeSettingComponent } from './chord-practice-setting.component';

describe('ChordPracticeSettingComponent', () => {
  let component: ChordPracticeSettingComponent;
  let fixture: ComponentFixture<ChordPracticeSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChordPracticeSettingComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ChordPracticeSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
