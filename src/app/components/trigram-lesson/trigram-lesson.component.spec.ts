import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TrigramLessonComponent } from './trigram-lesson.component';

describe('TrigramLessonComponent', () => {
  let fixture: ComponentFixture<TrigramLessonComponent>;
  let component: TrigramLessonComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule],
      declarations: [TrigramLessonComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(TrigramLessonComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
