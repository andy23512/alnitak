import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SidesDropdownComponent } from './sides-dropdown.component';

describe('SidesDropdownComponent', () => {
  let component: SidesDropdownComponent;
  let fixture: ComponentFixture<SidesDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidesDropdownComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SidesDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
