import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  HighlightKeyCombination,
  KeyLabel,
  KeyLabelType,
  Layer,
} from 'tangent-cc-lib';
import { provideTranslateService } from '@ngx-translate/core';
import { SwitchSectorComponent } from './switch-sector.component';

@Component({
  imports: [SwitchSectorComponent],
  template: `
    <svg>
      <g
        appSwitchSector
        [center]="{ x: 100, y: 200 }"
        [direction]="direction()"
        [degree]="degree()"
        [positionCode]="positionCode()"
        [strokeWidth]="strokeWidth()"
        [highlightKeyCombination]="highlight()"
        [secondaryHighlightPositions]="secondary()"
        [keyLabel]="labels()"
        [highlightOpacity]="0.7"
      ></g>
    </svg>
  `,
})
class HostComponent {
  direction = signal<'cw' | 'ccw'>('cw');
  degree = signal(270);
  positionCode = signal(5);
  strokeWidth = signal(1);
  highlight = signal<HighlightKeyCombination | null>(null);
  secondary = signal<number[]>([]);
  labels = signal<KeyLabel[]>([]);
}

describe('SwitchSectorComponent', () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;

  const paths = (): SVGPathElement[] =>
    Array.from(fixture.nativeElement.querySelectorAll('path'));
  const outline = () => paths()[0];
  const highlightPath = () => paths()[1];
  const sector = (): SwitchSectorComponent =>
    fixture.debugElement.children[0].children[0].injector.get(
      SwitchSectorComponent,
    );

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideTranslateService()] });
    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(sector()).toBeTruthy();
  });

  it('draws a transparent outline first', () => {
    expect(outline().getAttribute('fill')).toBe('transparent');
  });

  it('closes the highlight path but not the outline', () => {
    expect(outline().getAttribute('d')?.trim().endsWith('Z')).toBe(false);
    expect(highlightPath().getAttribute('d')?.trim().endsWith('Z')).toBe(true);
  });

  it('draws two arcs and a line for each sector', () => {
    const d = outline().getAttribute('d') ?? '';
    expect((d.match(/\bA\b/g) ?? []).length).toBe(2);
    expect((d.match(/\bL\b/g) ?? []).length).toBe(1);
    expect(d.trim().startsWith('M ')).toBe(true);
  });

  it('draws clockwise and counter-clockwise sectors with opposite arc sweeps', () => {
    const cw = outline().getAttribute('d');
    host.direction.set('ccw');
    fixture.detectChanges();
    const ccw = outline().getAttribute('d');
    expect(cw).not.toBe(ccw);
    expect(cw).toContain('0 0 1');
    expect(ccw).toContain('0 0 0');
  });

  it('is drawn around the center it is given', () => {
    const coordinates = (outline().getAttribute('d') ?? '')
      .match(/-?\d+(\.\d+)?(e-?\d+)?/g)!
      .map(Number);
    // the first M point is at radius 65 from (100, 200)
    const [x, y] = coordinates;
    expect(Math.hypot(x - 100, y - 200)).toBeCloseTo(65, 5);
  });

  it('spans a quarter turn minus the gap between neighbours, centered on its degree', () => {
    const nums = (outline().getAttribute('d') ?? '')
      .match(/-?\d+(\.\d+)?(e-?\d+)?/g)!
      .map(Number);
    // M x y, then A r r 0 0 1 x y: the outer arc runs from the first point to the second
    const angle = (x: number, y: number) =>
      (Math.atan2(y - 200, x - 100) * 180) / Math.PI;
    const start = angle(nums[0], nums[1]);
    const end = angle(nums[7], nums[8]);
    const alpha = (Math.asin((4 * Math.SQRT2) / 65) * 180) / Math.PI;
    expect(end - start).toBeCloseTo(90 - 2 * alpha, 3);
    expect((start + end) / 2).toBeCloseTo(-90, 3);
  });

  it('moves the sector when the degree changes', () => {
    const before = outline().getAttribute('d');
    host.degree.set(0);
    fixture.detectChanges();
    expect(outline().getAttribute('d')).not.toBe(before);
  });

  it('shrinks the outer radius by the stroke width', () => {
    expect(sector().r2()).toBe(174);
    host.strokeWidth.set(5);
    fixture.detectChanges();
    expect(sector().r2()).toBe(170);
  });

  it('passes the stroke width to the outline', () => {
    host.strokeWidth.set(3);
    fixture.detectChanges();
    expect(outline().getAttribute('stroke-width')).toBe('3');
  });

  const combo = (positionCodes: number[]): HighlightKeyCombination => ({
    characterKeyPositionCode: 1,
    layer: Layer.Primary,
    shiftKey: false,
    altGraphKey: false,
    positionCodes,
    score: 0,
    useLayerLock: false,
  });

  describe('highlight', () => {
    const secondaryPath = () => paths()[2];

    it('draws an outline, a primary and a secondary highlight path', () => {
      expect(paths().length).toBe(3);
    });

    it('is invisible when the position code is not highlighted', () => {
      host.highlight.set(combo([1, 2]));
      fixture.detectChanges();
      expect(highlightPath().getAttribute('opacity')).toBe('0');
    });

    it('uses the highlight opacity when the position code is highlighted', () => {
      host.highlight.set(combo([1, 5]));
      fixture.detectChanges();
      expect(highlightPath().getAttribute('opacity')).toBe('0.7');
    });

    it('is invisible when nothing is highlighted', () => {
      expect(highlightPath().getAttribute('opacity')).toBe('0');
      expect(secondaryPath().getAttribute('opacity')).toBe('0');
    });

    it('lights the secondary path in red for a secondary position', () => {
      host.secondary.set([5]);
      fixture.detectChanges();
      expect(secondaryPath().getAttribute('opacity')).toBe('0.7');
      expect(secondaryPath().classList).toContain('fill-red-500');
      expect(highlightPath().getAttribute('opacity')).toBe('0');
    });

    it('keeps the secondary path dark for other positions', () => {
      host.secondary.set([1, 2]);
      fixture.detectChanges();
      expect(secondaryPath().getAttribute('opacity')).toBe('0');
    });

    it('gives the same shape to every path', () => {
      const d = outline().getAttribute('d')!;
      expect(highlightPath().getAttribute('d')).toBe(d + ' Z');
      expect(secondaryPath().getAttribute('d')).toBe(d + ' Z');
    });
  });

  describe('key label', () => {
    it('draws the label where the text position is', () => {
      host.highlight.set(combo([5]));
      host.labels.set([
        {
          type: KeyLabelType.String,
          c: 'q',
          title: 't',
          layer: Layer.Primary,
          shiftKey: false,
          altGraphKey: false,
        },
      ]);
      fixture.detectChanges();
      const t = fixture.nativeElement.querySelector('text') as SVGTextElement;
      expect(t.textContent?.trim()).toBe('q');
      expect(+t.getAttribute('x')!).toBeCloseTo(sector().textX(), 5);
      expect(+t.getAttribute('y')!).toBeCloseTo(sector().textY(), 5);
    });
  });

  describe('label position', () => {
    it('sits between the inner and outer radius, in the direction of the sector', () => {
      host.degree.set(0);
      fixture.detectChanges();
      const mid = (65 + 174) / 2;
      expect(sector().textX()).toBeCloseTo(100 + mid, 5);
      expect(sector().textY()).toBeCloseTo(200, 5);
    });
  });
});
