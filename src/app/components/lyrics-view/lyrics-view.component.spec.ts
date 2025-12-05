import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LyricsViewComponent } from './lyrics-view.component';

describe('LyricsViewComponent', () => {
  let fixture: ComponentFixture<LyricsViewComponent>;
  let component: LyricsViewComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule],
      declarations: [LyricsViewComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(LyricsViewComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
