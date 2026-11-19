import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { InformationPageComponent } from './information-page.component';

describe('InformationPageComponent', () => {
  let el: HTMLElement;

  beforeEach(() => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [provideRouter([]), provideTranslateService()],
    });
    const fixture = TestBed.createComponent(InformationPageComponent);
    fixture.detectChanges();
    el = fixture.nativeElement;
  });

  // the title case pipe capitalizes the first letter, so compare in lower case
  const text = (e: Element | null) =>
    e?.textContent?.replace(/\s+/g, ' ').trim().toLowerCase();

  it('is a padded block', () => {
    expect(el.classList).toContain('block');
    expect(el.classList).toContain('p-5');
  });

  it('starts with the description', () => {
    expect(text(el.querySelector('p'))).toBe('information-page.description');
  });

  it('has the page introductions and the disclaimers as sections, in that order', () => {
    expect(Array.from(el.querySelectorAll('h2')).map((h) => text(h))).toEqual([
      'information-page.page-introductions-title',
      'information-page.disclaimers.title',
    ]);
  });

  it('introduces each page with a link to it, in the order of the navigation', () => {
    const links = Array.from(el.querySelectorAll('h3 a'));
    expect(links.map((a) => a.getAttribute('href'))).toEqual([
      '/topic/number/lesson/123',
      '/statistics',
      '/chord',
      '/layout-viewer',
      '/layout-song',
      '/settings',
    ]);
    expect(links.map((a) => text(a))).toEqual([
      '123 information-page.key-lesson-page.title',
      'trending_up information-page.statistics-page.title',
      'piano information-page.chord-page.title',
      'map information-page.layout-viewer-page.title',
      'music_note_2 information-page.layout-song-page.title',
      'settings information-page.settings-page.title',
    ]);
  });

  it('describes each page', () => {
    const body = text(el)!;
    for (const page of [
      'statistics',
      'chord',
      'layout-viewer',
      'layout-song',
      'settings',
    ]) {
      expect(body).toContain(`information-page.${page}-page.description`);
    }
    expect(body).toContain('information-page.key-lesson-page.description.0');
    expect(body).toContain('information-page.key-lesson-page.description.1.2');
  });

  it('opens outside links in a new tab without giving them access to this page', () => {
    const external = Array.from(el.querySelectorAll('a[href^="http"]'));
    expect(external.length).toBe(3);
    for (const a of external) {
      expect(a.getAttribute('target')).toBe('_blank');
      expect(a.getAttribute('rel')).toContain('noopener');
    }
  });

  it('links to the CharaChorder site and the browser storage documentation in the disclaimers', () => {
    const hrefs = Array.from(el.querySelectorAll('ol a')).map((a) =>
      a.getAttribute('href'),
    );
    expect(hrefs).toEqual([
      'https://www.charachorder.com/',
      'https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API',
      'https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage',
    ]);
    expect(el.querySelectorAll('ol > li').length).toBe(2);
  });

  it('links the lesson description to the url given by the translation', () => {
    const a = el.querySelector(
      'a[href="information-page.key-lesson-page.description.1.1.url"]',
    );
    expect(a).not.toBeNull();
    expect(text(a)).toBe(
      'information-page.key-lesson-page.description.1.1.text',
    );
  });
});
