import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CharacterLessonComponent } from './character-lesson.component';

describe('CharacterLessonComponent', () => {
  let fixture: ComponentFixture<CharacterLessonComponent>;
  let component: CharacterLessonComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule],
      declarations: [CharacterLessonComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(CharacterLessonComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
