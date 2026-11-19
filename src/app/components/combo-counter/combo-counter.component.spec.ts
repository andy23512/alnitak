import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { PARAMETER } from 'src/app/data/parameters';
import { temperatureToColor } from 'src/app/utils/color.utils';
import { SevenSegmentComponent } from '../seven-segment/seven-segment.component';
import { ComboCounterComponent } from './combo-counter.component';

describe('ComboCounterComponent', () => {
  let fixture: ComponentFixture<ComboCounterComponent>;

  const el = () => fixture.nativeElement as HTMLElement;
  function render(combo: number) {
    fixture.componentRef.setInput('combo', combo);
    fixture.detectChanges();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComboCounterComponent],
      providers: [provideTranslateService()],
    }).compileComponents();
    fixture = TestBed.createComponent(ComboCounterComponent);
  });

  it('shows the combo unit in upper case', () => {
    render(0);
    expect(el().textContent).toContain('GENERAL.COMBO-UNIT');
  });

  it('passes the combo to the seven segment display', () => {
    render(27);
    const seven = fixture.debugElement.children.find(
      (c) => c.componentInstance instanceof SevenSegmentComponent,
    )!;
    expect(seven.componentInstance.number()).toBe(27);
    expect(el().textContent).toContain('27');
  });

  it('is left aligned', () => {
    render(0);
    expect(el().classList).toContain('text-left');
  });

  it('colors the text by combo through the color temperature', () => {
    render(0);
    expect(el().style.color).not.toBe('');
    const expected = (combo: number) => {
      const probe = document.createElement('span');
      probe.style.color = temperatureToColor(
        combo / PARAMETER.ComboHeatCapacity,
      );
      return probe.style.color;
    };
    expect(el().style.color).toBe(expected(0));
    render(50);
    expect(el().style.color).toBe(expected(50));
    render(150);
    expect(el().style.color).toBe(expected(150));
  });

  it('changes color as the combo grows', () => {
    render(0);
    const cold = el().style.color;
    render(150);
    expect(el().style.color).not.toBe(cold);
  });
});
