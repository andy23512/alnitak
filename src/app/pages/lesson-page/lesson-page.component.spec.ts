import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LessonPageComponent } from './lesson-page.component';

describe('LessonPageComponent', () => {
  let component: LessonPageComponent;
  let fixture: ComponentFixture<LessonPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LessonPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LessonPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
