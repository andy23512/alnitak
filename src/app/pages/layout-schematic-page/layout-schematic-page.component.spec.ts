import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LayoutSchematicPageComponent } from './layout-schematic-page.component';

describe('LayoutSchematicPageComponent', () => {
  let component: LayoutSchematicPageComponent;
  let fixture: ComponentFixture<LayoutSchematicPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LayoutSchematicPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LayoutSchematicPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
