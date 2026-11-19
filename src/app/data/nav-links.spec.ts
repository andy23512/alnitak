import { APP_ROUTES } from '../app.routes';
import { NAV_LINKS } from './nav-links';

describe('NAV_LINKS', () => {
  it('lists the pages in order', () => {
    expect(NAV_LINKS.map((l) => l.routerLink)).toEqual([
      '/',
      '/statistics',
      '/chord',
      '/layout-viewer',
      '/layout-song',
      '/settings',
      '/information',
    ]);
  });

  it('only links to routes that exist', () => {
    const paths = APP_ROUTES.map((r) => '/' + r.path);
    for (const l of NAV_LINKS) {
      expect(paths)
        .withContext(l.routerLink)
        .toContain(l.routerLink === '/' ? '/' : l.routerLink);
    }
  });

  it('matches only the exact path for the home link, so it is not always active', () => {
    for (const l of NAV_LINKS) {
      expect(l.routerLinkActiveOptions).toEqual({
        exact: l.routerLink === '/',
      });
    }
  });

  it('has a distinct title, label, tooltip and icon for each link, named after the page', () => {
    for (const key of [
      'title',
      'ariaLabel',
      'tooltipMessage',
      'icon',
    ] as const) {
      expect(new Set(NAV_LINKS.map((l) => l[key])).size)
        .withContext(key)
        .toBe(NAV_LINKS.length);
    }
    for (const l of NAV_LINKS) {
      const page = l.title.split('.')[2];
      expect(l.ariaLabel).toBe(`nav.page.${page}.aria-label`);
      expect(l.tooltipMessage).toBe(`nav.page.${page}.tooltip`);
    }
  });
});
