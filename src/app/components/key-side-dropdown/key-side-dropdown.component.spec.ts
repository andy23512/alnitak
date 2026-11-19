import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSelect } from '@angular/material/select';
import { By } from '@angular/platform-browser';
import { provideTranslateService } from '@ngx-translate/core';
import { KeySideDropdownComponent } from './key-side-dropdown.component';

describe('KeySideDropdownComponent', () => {
  let fixture: ComponentFixture<KeySideDropdownComponent>;
  let selected: unknown[];

  const trigger = () =>
    fixture.nativeElement.querySelector(
      '.mat-mdc-select-trigger',
    ) as HTMLElement;
  const select = () =>
    fixture.debugElement.query(By.directive(MatSelect))
      .componentInstance as MatSelect;
  const options = () => select().options.toArray();
  async function settle() {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  }
  async function create(value: string) {
    fixture = TestBed.createComponent(KeySideDropdownComponent);
    fixture.componentRef.setInput('value', value);
    selected = [];
    fixture.componentInstance.select.subscribe((v: unknown) =>
      selected.push(v),
    );
    await settle();
  }

  beforeEach(async () => {
    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [KeySideDropdownComponent],
      providers: [provideTranslateService()],
    }).compileComponents();
  });

  it('shows the label of the current value', async () => {
    await create('left');
    expect(trigger().textContent).toContain('general.left-side');
    await create('right');
    expect(trigger().textContent).toContain('general.right-side');
  });

  it('has the two choices in order, with the values and labels', async () => {
    await create('left');
    expect(options().map((o) => o.value)).toEqual(['left', 'right']);
    expect(options().map((o) => o.viewValue.trim())).toEqual([
      'general.left-side',
      'general.right-side',
    ]);
  });

  it('marks the current value as selected', async () => {
    await create('right');
    expect(options().map((o) => o.selected)).toEqual([false, true]);
  });

  it('follows the value input when it changes', async () => {
    await create('left');
    fixture.componentRef.setInput('value', 'right');
    await settle();
    expect(select().value).toBe('right');
    expect(options().map((o) => o.selected)).toEqual([false, true]);
  });

  it('emits the chosen value through select', async () => {
    await create('left');
    options()[1]._selectViaInteraction();
    await settle();
    expect(selected).toEqual(['right']);
  });

  it('does not emit just because the input value changes', async () => {
    await create('left');
    fixture.componentRef.setInput('value', 'right');
    await settle();
    expect(selected).toEqual([]);
  });

  it('does not use a fixed panel width', async () => {
    await create('left');
    expect(select().panelWidth).toBeNull();
  });
});
