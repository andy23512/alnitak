import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSelect } from '@angular/material/select';
import { By } from '@angular/platform-browser';
import { provideTranslateService } from '@ngx-translate/core';
import { SidesDropdownComponent } from './sides-dropdown.component';

describe('SidesDropdownComponent', () => {
  let fixture: ComponentFixture<SidesDropdownComponent>;
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
    fixture = TestBed.createComponent(SidesDropdownComponent);
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
      imports: [SidesDropdownComponent],
      providers: [provideTranslateService()],
    }).compileComponents();
  });

  it('shows the label of the current value', async () => {
    await create('both');
    expect(trigger().textContent).toContain('general.both-sides');
    await create('same');
    expect(trigger().textContent).toContain('general.same-side');
  });

  it('has the two choices in order, with the values and labels', async () => {
    await create('both');
    expect(options().map((o) => o.value)).toEqual(['both', 'same']);
    expect(options().map((o) => o.viewValue.trim())).toEqual([
      'general.both-sides',
      'general.same-side',
    ]);
  });

  it('marks the current value as selected', async () => {
    await create('same');
    expect(options().map((o) => o.selected)).toEqual([false, true]);
  });

  it('follows the value input when it changes', async () => {
    await create('both');
    fixture.componentRef.setInput('value', 'same');
    await settle();
    expect(select().value).toBe('same');
    expect(options().map((o) => o.selected)).toEqual([false, true]);
  });

  it('emits the chosen value through select', async () => {
    await create('both');
    options()[1]._selectViaInteraction();
    await settle();
    expect(selected).toEqual(['same']);
  });

  it('does not emit just because the input value changes', async () => {
    await create('both');
    fixture.componentRef.setInput('value', 'same');
    await settle();
    expect(selected).toEqual([]);
  });

  it('does not use a fixed panel width', async () => {
    await create('both');
    expect(select().panelWidth).toBeNull();
  });
});
