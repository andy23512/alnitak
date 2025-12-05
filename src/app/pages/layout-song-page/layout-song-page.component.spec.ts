import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LayoutSongPageComponent } from './layout-song-page.component';

describe('LayoutSongPageComponent', () => {
  let fixture: ComponentFixture<LayoutSongPageComponent>;
  let component: LayoutSongPageComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule],
      declarations: [LayoutSongPageComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(LayoutSongPageComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
