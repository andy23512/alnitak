import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MatTooltip } from '@angular/material/tooltip';
import { provideTranslateService } from '@ngx-translate/core';
import {
  FontLogo,
  HighlightKeyCombination,
  KeyLabel,
  KeyLabelType,
  Layer,
} from 'tangent-cc-lib';
import { KeyLabelComponent } from './key-label.component';

@Component({
  imports: [KeyLabelComponent],
  template: `
    <svg>
      <g
        appKeyLabel
        [x]="10"
        [y]="20"
        [fontSize]="fontSize()"
        [labels]="labels()"
        [highlightKeyCombination]="highlight()"
      ></g>
    </svg>
  `,
})
class HostComponent {
  fontSize = signal(100);
  labels = signal<KeyLabel[]>([]);
  highlight = signal<HighlightKeyCombination | null>(null);
}

const combo = (
  layer: Layer,
  shiftKey = false,
  altGraphKey = false,
): HighlightKeyCombination => ({
  characterKeyPositionCode: 1,
  layer,
  shiftKey,
  altGraphKey,
  positionCodes: [1],
  score: 0,
  useLayerLock: false,
});

const str = (
  c: string,
  layer: Layer | null = Layer.Primary,
  shiftKey: boolean | null = false,
  altGraphKey: boolean | null = false,
  extra: { isDeadKey?: boolean; isWindowsAltCode?: boolean } = {},
): KeyLabel => ({
  type: KeyLabelType.String,
  c,
  title: 'title.' + c,
  layer,
  shiftKey,
  altGraphKey,
  ...extra,
});

describe('KeyLabelComponent', () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;

  const el = () => fixture.nativeElement as HTMLElement;
  const texts = () =>
    Array.from(el().querySelectorAll('text')) as SVGTextElement[];
  const label = () =>
    fixture.debugElement.children[0].children[0].injector.get(
      KeyLabelComponent,
    );
  function show(labels: KeyLabel[], h: HighlightKeyCombination | null) {
    host.labels.set(labels);
    host.highlight.set(h);
    fixture.detectChanges();
  }

  beforeEach(() => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({ providers: [provideTranslateService()] });
    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('which labels are shown', () => {
    it('shows nothing when no key combination is highlighted', () => {
      show([str('a')], null);
      expect(texts().length).toBe(0);
    });

    it('shows a label of the highlighted layer, shift and alt graph', () => {
      show([str('a')], combo(Layer.Primary));
      expect(texts().map((t) => t.textContent?.trim())).toEqual(['a']);
    });

    it('hides a label of another layer', () => {
      show([str('a', Layer.Secondary)], combo(Layer.Primary));
      expect(texts().length).toBe(0);
    });

    it('hides a label that needs shift when shift is not held', () => {
      show([str('A', Layer.Primary, true)], combo(Layer.Primary, false));
      expect(texts().length).toBe(0);
      show([str('A', Layer.Primary, true)], combo(Layer.Primary, true));
      expect(texts().length).toBe(1);
    });

    it('hides a label that needs alt graph when it is not held', () => {
      show([str('é', Layer.Primary, false, true)], combo(Layer.Primary));
      expect(texts().length).toBe(0);
      show(
        [str('é', Layer.Primary, false, true)],
        combo(Layer.Primary, false, true),
      );
      expect(texts().length).toBe(1);
    });

    it('shows a label with no layer on any layer', () => {
      show([str('x', null, null, null)], combo(Layer.Tertiary, true, true));
      expect(texts().length).toBe(1);
    });

    it('shows a label of this layer that ignores shift and alt graph', () => {
      show(
        [str('y', Layer.Secondary, null, null)],
        combo(Layer.Secondary, true, true),
      );
      expect(texts().length).toBe(1);
      show(
        [str('y', Layer.Secondary, null, null)],
        combo(Layer.Primary, true, true),
      );
      expect(texts().length).toBe(0);
    });

    it('shows several matching labels in order', () => {
      show(
        [str('a'), str('b'), str('c', Layer.Secondary)],
        combo(Layer.Primary),
      );
      expect(texts().map((t) => t.textContent?.trim())).toEqual(['a', 'b']);
    });
  });

  describe('drawing a label', () => {
    it('is centered on x and y', () => {
      show([str('a')], combo(Layer.Primary));
      const t = texts()[0];
      expect(t.getAttribute('x')).toBe('10');
      expect(t.getAttribute('y')).toBe('20');
      expect(t.getAttribute('text-anchor')).toBe('middle');
      expect(t.getAttribute('dominant-baseline')).toBe('central');
    });

    it('has the translated title as tooltip', () => {
      show([str('a')], combo(Layer.Primary));
      const tip = fixture.debugElement
        .query(By.directive(MatTooltip))
        .injector.get(MatTooltip);
      expect(tip.message).toBe('title.a');
    });

    it('draws an action code in red, in parentheses', () => {
      show(
        [
          {
            type: KeyLabelType.ActionCode,
            c: 512,
            title: 't',
            layer: null,
            shiftKey: null,
            altGraphKey: null,
          },
        ],
        combo(Layer.Primary),
      );
      const t = texts()[0];
      expect(t.textContent?.replace(/\s+/g, '')).toBe('(512)');
      expect(t.classList).toContain('fill-red-500');
      expect(t.classList).not.toContain('fill-current');
    });

    it('draws other labels in the current color', () => {
      show([str('a')], combo(Layer.Primary));
      expect(texts()[0].classList).toContain('fill-current');
      expect(texts()[0].classList).not.toContain('fill-red-500');
    });

    it('draws an icon with the icon font', () => {
      show(
        [
          {
            type: KeyLabelType.Icon,
            c: 'backspace',
            title: 't',
            layer: null,
            shiftKey: null,
            altGraphKey: null,
          },
        ],
        combo(Layer.Primary),
      );
      expect(texts()[0].classList).toContain('material-icons');
      expect(texts()[0].classList).not.toContain('font-logos');
      expect(texts()[0].textContent?.trim()).toBe('backspace');
    });

    it('draws a logo with the logo font and the logo class', () => {
      show(
        [
          {
            type: KeyLabelType.Logo,
            c: FontLogo.Ubuntu,
            title: 't',
            layer: null,
            shiftKey: null,
            altGraphKey: null,
          },
        ],
        combo(Layer.Primary),
      );
      expect(texts()[0].classList).toContain('font-logos');
      expect(texts()[0].classList).toContain(FontLogo.Ubuntu);
      expect(texts()[0].classList).not.toContain('material-icons');
    });
  });

  describe('marks', () => {
    const lines = () => Array.from(el().querySelectorAll('line'));

    it('draws a bar behind a dead key', () => {
      show(
        [str('^', Layer.Primary, false, false, { isDeadKey: true })],
        combo(Layer.Primary),
      );
      expect(lines().length).toBe(1);
      expect(lines()[0].classList).toContain('stroke-alnitak-900');
      expect(lines()[0].getAttribute('y1')).toBe('-20');
      expect(lines()[0].getAttribute('y2')).toBe('60');
    });

    it('draws a yellow bar behind a Windows alt code', () => {
      show(
        [str('€', Layer.Primary, false, false, { isWindowsAltCode: true })],
        combo(Layer.Primary),
      );
      expect(lines().length).toBe(1);
      expect(lines()[0].classList).toContain('stroke-yellow-900');
    });

    it('draws no bar for an ordinary label', () => {
      show([str('a')], combo(Layer.Primary));
      expect(lines().length).toBe(0);
    });
  });

  describe('font size', () => {
    const size = (l: KeyLabel) => label().getFontSize(l);

    it('is the full size for a single character', () => {
      expect(size(str('a'))).toBe(100);
    });

    it('is 80% for two characters and 60% for more', () => {
      expect(size(str('ab'))).toBe(80);
      expect(size(str('abc'))).toBe(60);
      expect(size(str('abcd'))).toBe(60);
    });

    it('is 60% for an action code and 80% for an icon or logo', () => {
      const base = {
        title: 't',
        layer: null,
        shiftKey: null,
        altGraphKey: null,
      };
      expect(size({ ...base, type: KeyLabelType.ActionCode, c: 1 })).toBe(60);
      expect(size({ ...base, type: KeyLabelType.Icon, c: 'backspace' })).toBe(
        80,
      );
      expect(
        size({ ...base, type: KeyLabelType.Logo, c: FontLogo.Ubuntu }),
      ).toBe(80);
    });

    it('follows the fontSize input', () => {
      host.fontSize.set(50);
      fixture.detectChanges();
      expect(size(str('a'))).toBe(50);
      show([str('a')], combo(Layer.Primary));
      expect(texts()[0].style.fontSize).toBe('50px');
    });
  });
});
