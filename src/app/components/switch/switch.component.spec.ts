import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import {
  DirectionMap,
  HighlightKeyCombination,
  KeyLabel,
  KeyLabelType,
  Layer,
} from 'tangent-cc-lib';
import { SwitchComponent } from './switch.component';

const POSITION_CODES: DirectionMap<number> = { n: 1, e: 2, s: 3, w: 4, c: 5 };

const combo = (positionCodes: number[]): HighlightKeyCombination => ({
  characterKeyPositionCode: 1,
  layer: Layer.Primary,
  shiftKey: false,
  altGraphKey: false,
  positionCodes,
  score: 0,
  useLayerLock: false,
});

const label = (c: string): KeyLabel => ({
  type: KeyLabelType.String,
  c,
  title: 't.' + c,
  layer: Layer.Primary,
  shiftKey: false,
  altGraphKey: false,
});

@Component({
  imports: [SwitchComponent],
  template: `
    <svg>
      <g
        appSwitch
        [center]="{ x: 100, y: 200 }"
        [rotationDirection]="direction()"
        [rotation]="rotation()"
        [positionCodeMap]="positionCodes"
        [highlightKeyCombination]="highlight()"
        [secondaryHighlightPositions]="secondary()"
        [keyLabelMap]="labels()"
        [highlightOpacity]="0.6"
      ></g>
    </svg>
  `,
})
class HostComponent {
  direction = signal<'cw' | 'ccw'>('cw');
  rotation = signal(0);
  highlight = signal<HighlightKeyCombination | null>(null);
  secondary = signal<number[]>([]);
  labels = signal<Record<number, KeyLabel[]>>({});
  positionCodes = POSITION_CODES;
}

describe('SwitchComponent', () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;

  const sectors = (): SVGGElement[] =>
    Array.from(fixture.nativeElement.querySelectorAll('g[appswitchsector]'));
  /** The two circles at the centre: primary highlight, then secondary. */
  const circles = (): SVGCircleElement[] =>
    Array.from(
      fixture.nativeElement.querySelectorAll(':scope svg > g > circle'),
    );
  const sectorOpacities = (index: number) =>
    sectors().map((g) =>
      g.querySelectorAll(':scope > path')[index].getAttribute('opacity'),
    );
  const component = (): SwitchComponent =>
    fixture.debugElement.children[0].children[0].injector.get(SwitchComponent);
  const texts = () =>
    Array.from(fixture.nativeElement.querySelectorAll('text')).map((t) =>
      ((t as SVGTextElement).textContent ?? '').trim(),
    );

  beforeEach(() => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({ providers: [provideTranslateService()] });
    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('draws four sectors and two center circles', () => {
    expect(sectors().length).toBe(4);
    expect(circles().length).toBe(2);
  });

  it('places the sectors north, east, south and west at 270, 0, 90 and 180 degrees', () => {
    expect(component().sectors).toEqual([
      { direction: 'n', degree: 270 },
      { direction: 'e', degree: 0 },
      { direction: 's', degree: 90 },
      { direction: 'w', degree: 180 },
    ]);
  });

  it('draws the center circles at the given center', () => {
    for (const c of circles()) {
      expect(c.getAttribute('cx')).toBe('100');
      expect(c.getAttribute('cy')).toBe('200');
    }
    expect(circles()[1].classList).toContain('fill-red-500');
  });

  describe('rotation', () => {
    it('rotates clockwise switches by the given angle', () => {
      host.rotation.set(30);
      fixture.detectChanges();
      expect(component().r()).toBe(30);
    });

    it('rotates counter-clockwise switches the other way', () => {
      host.direction.set('ccw');
      host.rotation.set(30);
      fixture.detectChanges();
      expect(component().r()).toBe(-30);
    });

    it('does not rotate by default', () => {
      expect(component().r()).toBe(0);
    });

    it('changes the drawn sectors when rotated', () => {
      const d = () =>
        sectors().map((g) => g.querySelector('path')!.getAttribute('d'));
      const before = d();
      host.rotation.set(45);
      fixture.detectChanges();
      expect(d()).not.toEqual(before);
    });
  });

  describe('highlight', () => {
    it('highlights only the sector whose position code is in the combination', () => {
      host.highlight.set(combo([3])); // south
      fixture.detectChanges();
      expect(sectorOpacities(1)).toEqual(['0', '0', '0.6', '0']);
      expect(circles()[0].getAttribute('opacity')).toBe('0');
    });

    it('highlights the center circle for the center position code', () => {
      host.highlight.set(combo([5]));
      fixture.detectChanges();
      expect(circles()[0].getAttribute('opacity')).toBe('0.6');
      expect(sectorOpacities(1)).toEqual(['0', '0', '0', '0']);
    });

    it('can highlight several position codes at once', () => {
      host.highlight.set(combo([1, 4, 5]));
      fixture.detectChanges();
      expect(sectorOpacities(1)).toEqual(['0.6', '0', '0', '0.6']);
      expect(circles()[0].getAttribute('opacity')).toBe('0.6');
    });

    it('highlights nothing by default', () => {
      expect(sectorOpacities(1)).toEqual(['0', '0', '0', '0']);
      expect(sectorOpacities(2)).toEqual(['0', '0', '0', '0']);
      expect(circles().map((c) => c.getAttribute('opacity'))).toEqual([
        '0',
        '0',
      ]);
    });
  });

  describe('secondary highlight', () => {
    it('lights the secondary layer of the listed sectors', () => {
      host.secondary.set([2, 4]);
      fixture.detectChanges();
      expect(sectorOpacities(2)).toEqual(['0', '0.6', '0', '0.6']);
      expect(sectorOpacities(1)).toEqual(['0', '0', '0', '0']);
    });

    it('lights the secondary center circle only', () => {
      host.secondary.set([5]);
      fixture.detectChanges();
      expect(circles()[1].getAttribute('opacity')).toBe('0.6');
      expect(circles()[0].getAttribute('opacity')).toBe('0');
    });
  });

  describe('key labels', () => {
    it('shows the label of each position code, when highlighted', () => {
      host.labels.set({
        1: [label('n')],
        2: [label('e')],
        3: [label('s')],
        4: [label('w')],
        5: [label('c')],
      });
      host.highlight.set(combo([]));
      fixture.detectChanges();
      expect(texts().sort()).toEqual(['c', 'e', 'n', 's', 'w']);
    });

    it('shows no label without a highlighted combination', () => {
      host.labels.set({ 1: [label('n')], 5: [label('c')] });
      fixture.detectChanges();
      expect(texts()).toEqual([]);
    });

    it('shows the center label at the center', () => {
      host.labels.set({ 5: [label('c')] });
      host.highlight.set(combo([]));
      fixture.detectChanges();
      const t = fixture.nativeElement.querySelector('text') as SVGTextElement;
      expect(t.getAttribute('x')).toBe('100');
      expect(t.getAttribute('y')).toBe('200');
    });
  });
});
