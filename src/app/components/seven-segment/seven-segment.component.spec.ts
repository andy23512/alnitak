import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SevenSegmentComponent } from './seven-segment.component';

describe('SevenSegmentComponent', () => {
  let fixture: ComponentFixture<SevenSegmentComponent>;
  let component: SevenSegmentComponent;

  const spans = () =>
    Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll('span'),
    ) as HTMLElement[];
  function render(number?: number, minDigit?: number) {
    if (number !== undefined) {
      fixture.componentRef.setInput('number', number);
    }
    if (minDigit !== undefined) {
      fixture.componentRef.setInput('minDigit', minDigit);
    }
    fixture.detectChanges();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SevenSegmentComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(SevenSegmentComponent);
    component = fixture.componentInstance;
  });

  it('shows 0 padded to 3 digits by default', () => {
    render();
    expect(component.displayNumber()).toBe('  0');
    expect(component.backgroundNumber()).toBe('888');
  });

  it('pads the number on the left with spaces up to minDigit', () => {
    render(42, 5);
    expect(component.displayNumber()).toBe('   42');
  });

  it('does not pad or cut a number longer than minDigit', () => {
    render(12345, 3);
    expect(component.displayNumber()).toBe('12345');
    expect(component.backgroundNumber()).toBe('88888');
  });

  it('draws one background 8 per displayed digit, at least minDigit', () => {
    render(7, 4);
    expect(component.backgroundNumber()).toBe('8888');
    render(12345, 4);
    expect(component.backgroundNumber()).toBe('88888');
  });

  it('counts a negative sign as a character', () => {
    render(-5, 3);
    expect(component.displayNumber()).toBe(' -5');
    expect(component.backgroundNumber()).toBe('888');
  });

  it('shows the number in the front span and the 8s in the faint back span', () => {
    render(42, 3);
    expect(spans()[0].textContent).toBe(' 42');
    expect(spans()[0].classList).toContain('absolute');
    expect(spans()[1].textContent?.trim()).toBe('888');
    expect(spans()[1].classList).toContain('opacity-10');
  });

  it('is a positioned block element', () => {
    render();
    expect(fixture.nativeElement.classList).toContain('relative');
    expect(fixture.nativeElement.classList).toContain('block');
  });
});
