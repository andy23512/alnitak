import { Component, input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateService, provideTranslateService } from '@ngx-translate/core';
import { VisibilitySettingStore } from 'src/app/stores/visibility-setting.store';
import { MiscSettingStore } from 'src/app/stores/misc-setting.store';
import {
  convertPositionCodeToKeyNotation,
  convertPositionCodeToText,
} from 'src/app/utils/layout.utils';
import {
  HighlightKeyCombination,
  Layer,
  POSITION_CODE_LAYOUT,
  Profile,
} from 'tangent-cc-lib';
import { SwitchComponent } from '../switch/switch.component';
import { LayoutComponent } from './layout.component';

/** One switch drawn on its own, to compare with the same switch in the layout. */
@Component({
  selector: 'app-lone-switch',
  imports: [SwitchComponent],
  template: `<svg>
    <g
      appSwitch
      [center]="center()"
      [rotationDirection]="direction()"
      [rotation]="rotation()"
      [positionCodeMap]="codes()"
    ></g>
  </svg>`,
})
class LoneSwitchComponent {
  center = input.required<{ x: number; y: number }>();
  direction = input.required<'cw' | 'ccw'>();
  rotation = input.required<number>();
  codes = input.required<any>();
}

const combo = (
  positionCodes: number[],
  layer: Layer = Layer.Primary,
  useLayerLock = false,
): HighlightKeyCombination => ({
  characterKeyPositionCode: positionCodes[0] ?? 0,
  layer,
  shiftKey: false,
  altGraphKey: false,
  positionCodes,
  score: 0,
  useLayerLock,
});

describe('LayoutComponent', () => {
  let component: LayoutComponent;
  let fixture: ComponentFixture<LayoutComponent>;

  // Sizes the component uses: 350 per cell and 35 between cells, in 10 columns.
  const WIDTH = 350 * 10 + 35 * 9;

  const svg = () => fixture.nativeElement.querySelector('svg') as SVGElement;
  const switches = () =>
    Array.from(
      fixture.nativeElement.querySelectorAll('g[appswitch]'),
    ) as SVGGElement[];
  /** Text elements drawn directly by the layout (not by its switches). */
  const guides = () =>
    Array.from(
      fixture.nativeElement.querySelectorAll('svg > text'),
    ) as SVGTextElement[];
  const guideText = (el: SVGTextElement) =>
    (el.textContent ?? '').replace(/\s+/g, ' ').trim();
  /** The centre circle of a switch is the last circle in it. */
  const circleOf = (el: SVGGElement) => {
    const circles = el.querySelectorAll(':scope > circle');
    return circles[circles.length - 1] as SVGCircleElement;
  };
  const centerOf = (el: SVGGElement) => ({
    x: +circleOf(el).getAttribute('cx')!,
    y: +circleOf(el).getAttribute('cy')!,
  });
  async function setInput(name: string, value: unknown) {
    fixture.componentRef.setInput(name, value);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  }

  /** appVisible reads the setting once when its input is set, so create the layout after changing it. */
  function recreate(visibility: Record<string, boolean>) {
    fixture.destroy();
    const store = TestBed.inject(VisibilitySettingStore);
    for (const [key, value] of Object.entries(visibility)) {
      store.set(key as never, value);
    }
    fixture = TestBed.createComponent(LayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  beforeEach(async () => {
    TestBed.resetTestingModule();
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [LayoutComponent],
      providers: [provideTranslateService()],
    }).compileComponents();

    fixture = TestBed.createComponent(LayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => localStorage.clear());

  describe('with the third thumb switch (the default)', () => {
    it('draws 9 switches for each hand', () => {
      expect(switches().length).toBe(18);
    });

    it('lists the switches from the thumb to the little finger', () => {
      expect(component.switches()).toEqual([
        'thumbEnd',
        'thumbMid',
        'thumbTip',
        'index',
        'middle',
        'middleMid',
        'ring',
        'ringMid',
        'little',
      ]);
    });

    it('has 5 rows', () => {
      expect(component.gridRows()).toBe(5);
      expect(component.viewBoxHeight()).toBe(350 * 5 + 35 * 4);
    });

    it('sets the view box to the full size', () => {
      expect(svg().getAttribute('viewBox')).toBe(
        `0 0 ${WIDTH} ${350 * 5 + 35 * 4}`,
      );
    });
  });

  describe('without the third thumb switch', () => {
    beforeEach(() => setInput('showThumb3Switch', false));

    it('draws 8 switches for each hand, leaving out the thumb end', () => {
      expect(switches().length).toBe(16);
      expect(component.switches()).not.toContain('thumbEnd' as never);
      expect(component.switches()[0]).toBe('thumbMid');
    });

    it('has 4 rows, so the view box is shorter', () => {
      expect(component.gridRows()).toBe(4);
      expect(svg().getAttribute('viewBox')).toBe(
        `0 0 ${WIDTH} ${350 * 4 + 35 * 3}`,
      );
    });

    it('comes back when the switch is shown again', async () => {
      await setInput('showThumb3Switch', true);
      expect(switches().length).toBe(18);
    });
  });

  describe('switch places', () => {
    const cell = (n: number) => n * (350 + 35) + 175;
    const row = (n: number) => n * (350 + 35) + 175;
    const left = (sw: string) => component.switchCenter(sw as never, 'left');
    const right = (sw: string) => component.switchCenter(sw as never, 'right');

    it('puts the fingers of the left hand in four columns, little finger outermost', () => {
      expect(left('little')).toEqual({ x: cell(0), y: row(0.5) });
      expect(left('ring')).toEqual({ x: cell(1), y: row(0) });
      expect(left('ringMid')).toEqual({ x: cell(1), y: row(1) });
      expect(left('middle')).toEqual({ x: cell(2), y: row(0) });
      expect(left('middleMid')).toEqual({ x: cell(2), y: row(1) });
      expect(left('index')).toEqual({ x: cell(3), y: row(0.5) });
    });

    it('steps the thumb switches down and out, one row each', () => {
      expect(left('thumbTip')).toEqual({ x: cell(4) - 350 / 4, y: row(2) });
      expect(left('thumbMid')).toEqual({ x: cell(4) - 350 / 2, y: row(3) });
      expect(left('thumbEnd')).toEqual({
        x: cell(4) - (350 * 3) / 4,
        y: row(4),
      });
    });

    it('mirrors every switch of the right hand across the middle', () => {
      for (const sw of component.switches()) {
        expect(right(sw).y).toBe(left(sw).y);
        expect(right(sw).x).toBe(WIDTH - left(sw).x);
      }
    });

    it('keeps the two hands apart and the thumbs near the middle', () => {
      expect(left('thumbTip').x).toBeLessThan(WIDTH / 2);
      expect(right('thumbTip').x).toBeGreaterThan(WIDTH / 2);
      expect(left('little').x).toBeLessThan(left('thumbTip').x);
    });

    it('does not move a switch by asking twice (the result is a fresh object)', () => {
      const first = left('index');
      first.x = -1;
      expect(left('index').x).toBe(cell(3));
    });

    it('puts every switch inside the view box, with no two on the same spot', () => {
      const spots = new Set<string>();
      for (const side of ['left', 'right'] as const) {
        for (const sw of component.switches()) {
          const p = component.switchCenter(sw, side);
          expect(p.x).toBeGreaterThan(0);
          expect(p.x).toBeLessThan(WIDTH);
          expect(p.y).toBeGreaterThan(0);
          expect(p.y).toBeLessThan(component.viewBoxHeight());
          spots.add(`${p.x},${p.y}`);
        }
      }
      expect(spots.size).toBe(18);
    });
  });

  describe('drawing', () => {
    it('draws every switch at its place', () => {
      const drawn = switches().map(centerOf);
      const expected: { x: number; y: number }[] = [];
      for (const side of component.sides) {
        for (const sw of component.switches()) {
          expected.push(component.switchCenter(sw, side));
        }
      }
      expect(drawn).toEqual(expected);
    });

    it('turns the thumb switches by the thumb angle and the others by the negated finger angle', () => {
      const store = TestBed.inject(MiscSettingStore);
      expect(component.thumbRotationAngle()).toBe(store.thumbRotationAngle());
      expect(component.nonThumbRotationAngle()).toBe(
        store.nonThumbRotationAngle(),
      );
      expect(component.thumbRotationAngle()).toBe(10);
      expect(component.nonThumbRotationAngle()).toBe(0);
    });

    const outlinesInLayout = (sw: string, side: 'left' | 'right') => {
      const center = component.switchCenter(sw as never, side);
      const el = switches().find((s) => {
        const c = centerOf(s);
        return c.x === center.x && c.y === center.y;
      })!;
      return Array.from(el.querySelectorAll('path')).map((p) =>
        p.getAttribute('d'),
      );
    };
    const outlinesAlone = (
      sw: keyof typeof POSITION_CODE_LAYOUT.left,
      side: 'left' | 'right',
      direction: 'cw' | 'ccw',
      rotation: number,
    ) => {
      const lone = TestBed.createComponent(LoneSwitchComponent);
      lone.componentRef.setInput('center', component.switchCenter(sw, side));
      lone.componentRef.setInput('direction', direction);
      lone.componentRef.setInput('rotation', rotation);
      lone.componentRef.setInput('codes', POSITION_CODE_LAYOUT[side][sw]);
      lone.detectChanges();
      return Array.from(lone.nativeElement.querySelectorAll('path')).map((p) =>
        (p as SVGPathElement).getAttribute('d'),
      );
    };

    it('turns the left thumb clockwise and the right thumb counter-clockwise', () => {
      expect(outlinesInLayout('thumbTip', 'left')).toEqual(
        outlinesAlone('thumbTip', 'left', 'cw', 10),
      );
      expect(outlinesInLayout('thumbTip', 'right')).toEqual(
        outlinesAlone('thumbTip', 'right', 'ccw', 10),
      );
    });

    it('does not turn the fingers by default', () => {
      expect(outlinesInLayout('index', 'left')).toEqual(
        outlinesAlone('index', 'left', 'cw', 0),
      );
      expect(outlinesInLayout('index', 'right')).toEqual(
        outlinesAlone('index', 'right', 'ccw', 0),
      );
    });

    it('turns the fingers the opposite way of the finger angle setting', async () => {
      const store = TestBed.inject(MiscSettingStore);
      store.set('nonThumbRotationAngle', 15);
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();
      expect(outlinesInLayout('index', 'left')).toEqual(
        outlinesAlone('index', 'left', 'cw', -15),
      );
    });

    it('draws the two hands differently, so the checks above are not empty', () => {
      expect(outlinesAlone('thumbTip', 'left', 'cw', 10)).not.toEqual(
        outlinesAlone('thumbTip', 'left', 'ccw', 10),
      );
      expect(outlinesAlone('thumbTip', 'left', 'cw', 10)).not.toEqual(
        outlinesAlone('thumbTip', 'left', 'cw', 0),
      );
    });

    it('passes the stroke width to the switches', async () => {
      await setInput('strokeWidth', 4);
      const outline = switches()[0].querySelector('path')!;
      expect(outline.getAttribute('stroke-width')).toBe('4');
    });
  });

  describe('highlight', () => {
    const highlightOf = (el: SVGGElement) =>
      el.querySelectorAll(':scope > circle')[0].getAttribute('opacity');
    const secondaryOf = (el: SVGGElement) =>
      el.querySelectorAll(':scope > circle')[1].getAttribute('opacity');

    it('highlights nothing by default', () => {
      expect(switches().every((s) => highlightOf(s) === '0')).toBe(true);
    });

    it('lights the centre of the switch whose centre key is in the combination', async () => {
      const code = POSITION_CODE_LAYOUT.left.index.c;
      await setInput('highlightKeyCombination', combo([code]));
      const lit = switches().filter((s) => highlightOf(s) !== '0');
      expect(lit.length).toBe(1);
      expect(centerOf(lit[0])).toEqual(component.switchCenter('index', 'left'));
    });

    it('lights nothing for a key that is not on this keyboard', async () => {
      await setInput('highlightKeyCombination', combo([9999]));
      expect(switches().every((s) => highlightOf(s) === '0')).toBe(true);
    });

    it('lights the secondary highlight of the listed keys', async () => {
      const code = POSITION_CODE_LAYOUT.right.thumbTip.c;
      await setInput('secondaryHighlightPositions', [code]);
      const lit = switches().filter((s) => secondaryOf(s) !== '0');
      expect(lit.length).toBe(1);
      expect(centerOf(lit[0])).toEqual(
        component.switchCenter('thumbTip', 'right'),
      );
      expect(switches().every((s) => highlightOf(s) === '0')).toBe(true);
    });
  });

  describe('guides', () => {
    const left = POSITION_CODE_LAYOUT.left;
    const codes = [left.index.n, left.middle.c];

    it('shows the text guide for the highlighted keys, last key first', async () => {
      await setInput('highlightKeyCombination', combo(codes));
      const translate = TestBed.inject(TranslateService);
      const expected = [...codes]
        .reverse()
        .map((c) => convertPositionCodeToText(c, translate))
        .join(' + ');
      expect(component.highlightKeyCombinationInText()).toBe(expected);
      expect(guideText(guides()[0])).toBe(expected);
    });

    it('does not show the key notation guide by default', async () => {
      await setInput('highlightKeyCombination', combo(codes));
      expect(guides().length).toBe(1);
    });

    it('shows the key notation guide when it is turned on', async () => {
      recreate({ layoutKeyNotationGuide: true });
      await setInput('highlightKeyCombination', combo(codes));
      const expected = [...codes]
        .reverse()
        .map(convertPositionCodeToKeyNotation)
        .join(' ');
      expect(component.highlightKeyCombinationInKeyNotation()).toBe(expected);
      expect(guides().map(guideText)).toContain(expected);
    });

    it('hides the text guide when it is turned off', async () => {
      recreate({ layoutTextGuide: false });
      await setInput('highlightKeyCombination', combo(codes));
      expect(guides().length).toBe(0);
    });

    it('hides all guides when alwaysHideLayoutGuides is set', async () => {
      recreate({ layoutKeyNotationGuide: true });
      await setInput('alwaysHideLayoutGuides', true);
      expect(guides().length).toBe(0);
    });

    it('shows empty guides without a highlighted combination', () => {
      expect(component.highlightKeyCombinationInText()).toBe('');
      expect(component.highlightKeyCombinationInKeyNotation()).toBe('');
    });

    it('does not reorder the position codes it was given', async () => {
      const list = [...codes];
      await setInput('highlightKeyCombination', combo(list));
      expect(list).toEqual(codes);
      expect(component.highlightKeyCombination()!.positionCodes).toEqual(codes);
    });
  });

  describe('layer guide', () => {
    const layerText = () =>
      guides().find((t) => guideText(t).includes('layout.layer-hint.0'));

    it('is hidden unless showLayerGuides is set', async () => {
      await setInput(
        'highlightKeyCombination',
        combo([1], Layer.Secondary, true),
      );
      expect(layerText()).toBeUndefined();
    });

    it('names the layer with the profile when the layer is locked', async () => {
      await setInput('showLayerGuides', true);
      await setInput(
        'highlightKeyCombination',
        combo([1], Layer.Secondary, true),
      );
      expect(component.highlightLayerText()).toBe('A2');
      expect(guideText(layerText()!)).toContain('A2');
    });

    it('uses the profile that was given', async () => {
      await setInput('profile', Profile.B);
      await setInput(
        'highlightKeyCombination',
        combo([1], Layer.Tertiary, true),
      );
      expect(component.highlightLayerText()).toBe('B3');
    });

    it('is empty for the primary layer, without layer lock, or with no combination', async () => {
      expect(component.highlightLayerText()).toBeNull();
      await setInput(
        'highlightKeyCombination',
        combo([1], Layer.Primary, true),
      );
      expect(component.highlightLayerText()).toBeNull();
      await setInput(
        'highlightKeyCombination',
        combo([1], Layer.Secondary, false),
      );
      expect(component.highlightLayerText()).toBeNull();
    });
  });

  describe('layout visibility', () => {
    it('hides the switches when the layout is turned off', async () => {
      recreate({ layout: false });
      expect(switches().length).toBe(0);
    });

    it('shows the switches anyway when alwaysShowLayout is set', async () => {
      recreate({ layout: false });
      await setInput('alwaysShowLayout', true);
      expect(switches().length).toBe(18);
    });
  });
});
