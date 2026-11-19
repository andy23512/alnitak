import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChordKey } from 'src/app/models/chord.models';
import { ChordInputKeysComponent } from './chord-input-keys.component';

describe('ChordInputKeysComponent', () => {
  let fixture: ComponentFixture<ChordInputKeysComponent>;

  const el = () => fixture.nativeElement as HTMLElement;
  const text = () => (el().textContent ?? '').replace(/\s+/g, ' ').trim();
  function render(keys: ChordKey[]) {
    fixture.componentRef.setInput('keys', keys);
    fixture.detectChanges();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChordInputKeysComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(ChordInputKeysComponent);
  });

  it('shows nothing for no keys', () => {
    render([]);
    expect(text()).toBe('');
  });

  it('shows a single character key without a plus', () => {
    render([{ type: 'character', value: 'a' }]);
    expect(text()).toBe('a');
  });

  it('joins keys with a plus, but not after the last key', () => {
    render([
      { type: 'character', value: 'a' },
      { type: 'character', value: 'b' },
      { type: 'character', value: 'c' },
    ]);
    expect(text()).toBe('a + b + c');
    expect(el().querySelectorAll('span').length).toBe(2);
  });

  it('shows an icon key as a mat-icon with the icon name', () => {
    render([{ type: 'icon', value: 'keyboard' }]);
    expect(el().querySelector('mat-icon')?.textContent?.trim()).toBe(
      'keyboard',
    );
  });

  it('mixes character and icon keys in order', () => {
    render([
      { type: 'character', value: 'x' },
      { type: 'icon', value: 'keyboard' },
    ]);
    expect(text()).toBe('x + keyboard');
    expect(el().querySelectorAll('mat-icon').length).toBe(1);
  });

  it('updates when the keys change', () => {
    render([{ type: 'character', value: 'a' }]);
    render([{ type: 'character', value: 'z' }]);
    expect(text()).toBe('z');
  });
});
