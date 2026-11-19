import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { RealTitleCasePipe } from './real-title-case.pipe';

@Component({
  selector: 'app-title-case-host',
  imports: [RealTitleCasePipe],
  template: `<span>{{ text | realTitleCase }}</span>`,
})
class HostComponent {
  text = 'go to the settings page';
}

describe('RealTitleCasePipe', () => {
  const pipe = new RealTitleCasePipe();

  it('capitalizes the words but keeps small words in lower case', () => {
    expect(pipe.transform('go to the settings page')).toBe(
      'Go to the Settings Page',
    );
  });

  it('always capitalizes the first word, even a small one', () => {
    expect(pipe.transform('the end of the road')).toBe('The End of the Road');
  });

  it('gives an empty text for an empty text', () => {
    expect(pipe.transform('')).toBe('');
  });

  it('trims the text', () => {
    expect(pipe.transform('  load chords  ')).toBe('Load Chords');
  });

  it('leaves text that has no letters to change as it is', () => {
    expect(pipe.transform('123')).toBe('123');
  });

  it('is used in a template under the name realTitleCase', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('span').textContent).toBe(
      'Go to the Settings Page',
    );
  });

  it('follows the text when it changes', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    fixture.componentInstance.text = 'delete all chords';
    fixture.changeDetectorRef.markForCheck();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('span').textContent).toBe(
      'Delete All Chords',
    );
  });
});
