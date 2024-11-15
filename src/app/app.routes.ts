import { Route } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { LessonPageComponent } from './pages/lesson-page/lesson-page.component';
import { SettingsPageComponent } from './pages/settings-page/settings-page.component';

export const APP_ROUTES: Route[] = [
  { path: '', pathMatch: 'full', component: HomePageComponent },
  { path: 'settings', component: SettingsPageComponent },
  { path: 'topic/:topicId/lesson/:lessonId', component: LessonPageComponent },
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
      import(
        './pages/layout-schematic-page/layout-schematic-page.component'
      ).then((m) => m.LayoutSchematicPageComponent),
  },
  {
    path: 'layout-viewer',
    loadComponent: () =>
      import('./pages/layout-viewer-page/layout-viewer-page.component').then(
        (m) => m.LayoutViewerPageComponent,
      ),
  },
  {
    path: 'keyboard-layout-viewer',
    loadComponent: () =>
      import('./pages/keyboard-layout-viewer-page/keyboard-layout-viewer-page.component').then(
        (m) => m.KeyboardLayoutViewerPageComponent,
      ),
  }
];
