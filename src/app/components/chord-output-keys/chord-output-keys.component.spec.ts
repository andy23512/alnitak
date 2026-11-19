import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChordKey } from 'src/app/models/chord.models';
import { ChordOutputKeysComponent } from './chord-output-keys.component';

describe('ChordOutputKeysComponent', () => {
  let fixture: ComponentFixture<ChordOutputKeysComponent>;

  const el = () => fixture.nativeElement as HTMLElement;
  function render(keys: ChordKey[]) {
    fixture.componentRef.setInput('keys', keys);
    fixture.detectChanges();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChordOutputKeysComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(ChordOutputKeysComponent);
  });

  it('is an inline flex row', () => {
    render([]);
    expect(el().classList).toContain('inline-flex');
    expect(el().classList).toContain('align-center');
  });

  it('shows nothing for no keys', () => {
    render([]);
    expect(el().children.length).toBe(0);
  });

  it('shows each character key in its own span, with no separator', () => {
    render([
      { type: 'character', value: 'h' },
      { type: 'character', value: 'i' },
    ]);
    const spans = Array.from(el().querySelectorAll('span'));
    expect(spans.map((s) => s.textContent)).toEqual(['h', 'i']);
    expect(el().textContent).toBe('hi');
  });

  it('shows an icon key as an inline mat-icon', () => {
    render([{ type: 'icon', value: 'keyboard' }]);
    const icon = el().querySelector('mat-icon') as HTMLElement;
    expect(icon.textContent).toBe('keyboard');
    expect(icon.classList).toContain('mat-icon-inline');
    expect(el().querySelector('span')).toBeNull();
  });

  it('keeps character and icon keys in order', () => {
    render([
      { type: 'character', value: 'a' },
      { type: 'icon', value: 'keyboard' },
      { type: 'character', value: 'b' },
    ]);
    expect(
      Array.from(el().children).map((c) => c.tagName.toLowerCase()),
    ).toEqual(['span', 'mat-icon', 'span']);
  });
});
