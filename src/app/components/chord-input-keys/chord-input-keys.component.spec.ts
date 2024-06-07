import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChordInputKeysComponent } from './chord-input-keys.component';

describe('ChordInputKeysComponent', () => {
  let component: ChordInputKeysComponent;
  let fixture: ComponentFixture<ChordInputKeysComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChordInputKeysComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ChordInputKeysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
