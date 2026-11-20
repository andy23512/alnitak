import { Route } from '@angular/router';
import { lessonResolver } from './resolvers/lesson.resolver';

export const APP_ROUTES: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('./pages/home-page/home-page.component').then(
        (m) => m.HomePageComponent,
      ),
  },
  {
    path: 'information',
    loadComponent: () =>
      import('./pages/information-page/information-page.component').then(
        (m) => m.InformationPageComponent,
      ),
  },
  {
    path: 'settings',
    loadComponent: () =>
      import('./pages/settings-page/settings-page.component').then(
        (m) => m.SettingsPageComponent,
      ),
  },
  {
    path: 'topic/:topicId/lesson/:lessonId',
    loadComponent: () =>
      import('./pages/lesson-page/lesson-page.component').then(
        (m) => m.LessonPageComponent,
      ),
    resolve: { lesson: lessonResolver },
  },
  {
    path: 'lesson-not-found',
    loadComponent: () =>
      import('./pages/lesson-not-found-page/lesson-not-found-page.component').then(
        (m) => m.LessonNotFoundPageComponent,
      ),
  },
  {
    path: 'statistics',
    loadComponent: () =>
      import('./pages/statistics-page/statistics-page.component').then(
        (m) => m.StatisticsPageComponent,
      ),
  },
  {
    path: 'chord',
    loadComponent: () =>
      import('./pages/chord-page/chord-page.component').then(
        (m) => m.ChordPageComponent,
      ),
  },
  {
    path: 'layout-schematic',
    loadComponent: () =>
      import('./pages/layout-schematic-page/layout-schematic-page.component').then(
        (m) => m.LayoutSchematicPageComponent,
      ),
  },
  {
    path: 'layout-viewer',
    loadComponent: () =>
      import('./pages/layout-viewer-page/layout-viewer-page.component').then(
        (m) => m.LayoutViewerPageComponent,
      ),
  },
  {
    path: 'layout-song',
    loadComponent: () =>
      import('./pages/layout-song-page/layout-song-page.component').then(
        (m) => m.LayoutSongPageComponent,
      ),
  },
];
