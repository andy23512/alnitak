import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { VisibilitySetting } from '../models/visibility-setting.models';
import { VisibilitySettingStore } from '../stores/visibility-setting.store';
import { VisibleDirective } from './visible.directive';

@Component({
  imports: [VisibleDirective],
  template: `<p *appVisible="key()" id="content">shown</p>`,
})
class HostComponent {
  key = signal<keyof VisibilitySetting | null>('speedometer');
}

describe('VisibleDirective', () => {
  let store: InstanceType<typeof VisibilitySettingStore>;

  function create() {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const shown = () =>
      fixture.nativeElement.querySelector('#content') !== null;
    return { fixture, shown };
  }

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    store = TestBed.inject(VisibilitySettingStore);
  });

  it('shows the content when the setting is on', () => {
    store.set('speedometer', true);
    expect(create().shown()).toBe(true);
  });

  it('hides the content when the setting is off', () => {
    store.set('speedometer', false);
    expect(create().shown()).toBe(false);
  });

  it('always shows the content when there is no setting key', () => {
    store.set('speedometer', false);
    const { fixture, shown } = create();
    fixture.componentInstance.key.set(null);
    fixture.detectChanges();
    expect(shown()).toBe(true);
  });

  it('follows the setting that its key names', () => {
    store.set('speedometer', true);
    store.set('layout', false);
    const { fixture, shown } = create();
    expect(shown()).toBe(true);
    fixture.componentInstance.key.set('layout');
    fixture.detectChanges();
    expect(shown()).toBe(false);
  });

  it('shows and hides the content as the key changes', () => {
    store.set('speedometer', true);
    store.set('layout', false);
    const { fixture, shown } = create();
    const toggle = (key: keyof VisibilitySetting | null) => {
      fixture.componentInstance.key.set(key);
      fixture.detectChanges();
      return shown();
    };
    expect([toggle('layout'), toggle('speedometer'), toggle('layout')]).toEqual(
      [false, true, false],
    );
  });

  it('creates the content only once while it stays visible', () => {
    store.set('speedometer', true);
    const { fixture } = create();
    const first = fixture.nativeElement.querySelector('#content');
    fixture.componentInstance.key.set('speedometer');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('#content')).toBe(first);
  });

  describe('while the content is on screen', () => {
    it('hides the content when the setting is turned off, and shows it again when turned on', () => {
      store.set('speedometer', true);
      const { fixture, shown } = create();
      expect(shown()).toBe(true);
      store.set('speedometer', false);
      fixture.detectChanges();
      expect(shown()).toBe(false);
      store.set('speedometer', true);
      fixture.detectChanges();
      expect(shown()).toBe(true);
    });

    it('shows the content when the setting is turned on after it was hidden at the start', () => {
      store.set('speedometer', false);
      const { fixture, shown } = create();
      expect(shown()).toBe(false);
      store.set('speedometer', true);
      fixture.detectChanges();
      expect(shown()).toBe(true);
    });

    it('follows the setting of the current key only', () => {
      store.set('speedometer', true);
      store.set('layout', true);
      const { fixture, shown } = create();
      store.set('layout', false);
      fixture.detectChanges();
      expect(shown()).toBe(true);
      fixture.componentInstance.key.set('layout');
      fixture.detectChanges();
      expect(shown()).toBe(false);
      store.set('speedometer', false);
      fixture.detectChanges();
      expect(shown()).toBe(false);
      store.set('layout', true);
      fixture.detectChanges();
      expect(shown()).toBe(true);
    });

    it('keeps showing the content when there is no key, whatever the settings do', () => {
      store.set('speedometer', true);
      const { fixture, shown } = create();
      fixture.componentInstance.key.set(null);
      fixture.detectChanges();
      store.set('speedometer', false);
      fixture.detectChanges();
      expect(shown()).toBe(true);
    });

    it('does not create the content again when an unrelated setting changes', () => {
      store.set('speedometer', true);
      const { fixture } = create();
      const first = fixture.nativeElement.querySelector('#content');
      store.set('layout', false);
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('#content')).toBe(first);
    });
  });
});
