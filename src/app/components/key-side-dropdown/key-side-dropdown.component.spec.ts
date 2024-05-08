import { ComponentFixture, TestBed } from '@angular/core/testing';
import { keySideDropdownComponent } from './key-side-dropdown.component';

describe('KeySideDropdownComponent', () => {
  let component: keySideDropdownComponent;
  let fixture: ComponentFixture<keySideDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [keySideDropdownComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(keySideDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
