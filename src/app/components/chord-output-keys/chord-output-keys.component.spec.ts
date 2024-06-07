import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChordOutputKeysComponent } from './chord-output-keys.component';

describe('ChordOutputKeysComponent', () => {
  let component: ChordOutputKeysComponent;
  let fixture: ComponentFixture<ChordOutputKeysComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChordOutputKeysComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ChordOutputKeysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
