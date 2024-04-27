import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SwitchSectorComponent } from './switch-sector.component';

describe('SwitchSectorComponent', () => {
  let component: SwitchSectorComponent;
  let fixture: ComponentFixture<SwitchSectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SwitchSectorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SwitchSectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
