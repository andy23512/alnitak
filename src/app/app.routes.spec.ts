import { APP_ROUTES } from './app.routes';

describe('APP_ROUTES', () => {
  const paths = APP_ROUTES.map((r) => r.path);

  it('has the home page at the empty path, matched in full', () => {
    expect(APP_ROUTES[0].path).toBe('');
    expect(APP_ROUTES[0].pathMatch).toBe('full');
  });

  it('has a route for each page', () => {
    expect(paths).toEqual([
      '',
      'information',
      'settings',
      'topic/:topicId/lesson/:lessonId',
      'lesson-not-found',
      'statistics',
      'chord',
      'layout-schematic',
      'layout-viewer',
      'layout-song',
    ]);
  });

  it('has no duplicate path', () => {
    expect(new Set(paths).size).toBe(paths.length);
  });

  it('loads a standalone component for every route', async () => {
    for (const route of APP_ROUTES) {
      const component = await (route.loadComponent as () => Promise<unknown>)();
      expect(typeof component)
        .withContext(String(route.path))
        .toBe('function');
    }
  });

  it('loads the components that the paths promise', async () => {
    const names: Record<string, string> = {};
    for (const route of APP_ROUTES) {
      const c = (await (
        route.loadComponent as () => Promise<{ name: string }>
      )()) as {
        name: string;
      };
      names[route.path!] = c.name;
    }
    expect(names).toEqual({
      '': 'HomePageComponent',
      information: 'InformationPageComponent',
      settings: 'SettingsPageComponent',
      'topic/:topicId/lesson/:lessonId': 'LessonPageComponent',
      'lesson-not-found': 'LessonNotFoundPageComponent',
      statistics: 'StatisticsPageComponent',
      chord: 'ChordPageComponent',
      'layout-schematic': 'LayoutSchematicPageComponent',
      'layout-viewer': 'LayoutViewerPageComponent',
      'layout-song': 'LayoutSongPageComponent',
    });
  });

  it('resolves a lesson only for the lesson route', () => {
    for (const route of APP_ROUTES) {
      expect(!!route.resolve)
        .withContext(String(route.path))
        .toBe(route.path === 'topic/:topicId/lesson/:lessonId');
    }
  });
});
