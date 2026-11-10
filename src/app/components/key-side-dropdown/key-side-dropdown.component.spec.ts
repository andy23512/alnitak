import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KeySideDropdownComponent } from './key-side-dropdown.component';

describe('KeySideDropdownComponent', () => {
  let component: KeySideDropdownComponent;
  let fixture: ComponentFixture<KeySideDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KeySideDropdownComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(KeySideDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
