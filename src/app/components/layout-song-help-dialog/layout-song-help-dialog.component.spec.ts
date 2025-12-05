import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LayoutSongHelpDialogComponent } from './layout-song-help-dialog.component';

describe('LayoutSongHelpDialogComponent', () => {
  let fixture: ComponentFixture<LayoutSongHelpDialogComponent>;
  let component: LayoutSongHelpDialogComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule],
      declarations: [LayoutSongHelpDialogComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(LayoutSongHelpDialogComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
