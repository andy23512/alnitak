import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { IconGuardPipe } from './icon-guard.pipe';

@Component({
  selector: 'app-icon-guard-host',
  imports: [IconGuardPipe],
  template: `<span>{{ 'delete' | iconGuard }}</span>`,
})
class HostComponent {}

describe('IconGuardPipe', () => {
  const pipe = new IconGuardPipe();

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('gives back the same icon name, unchanged', () => {
    expect(pipe.transform('delete')).toBe('delete');
    expect(pipe.transform('keyboard')).toBe('keyboard');
  });

  it('is used in a template under the name iconGuard', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('span').textContent).toBe(
      'delete',
    );
  });
});
