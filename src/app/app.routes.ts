import { Route } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { InformationPageComponent } from './pages/information-page/information-page.component';
import { LessonPageComponent } from './pages/lesson-page/lesson-page.component';
import { SettingsPageComponent } from './pages/settings-page/settings-page.component';

export const APP_ROUTES: Route[] = [
  { path: '', pathMatch: 'full', component: HomePageComponent },
  { path: 'information', component: InformationPageComponent },
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
    children: [
      {
        path: 'practice',
        loadComponent: () =>
          import(
            './pages/chord-practice-sub-page/chord-practice-sub-page.component'
          ).then((m) => m.ChordPracticeSubPageComponent),
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'practice',
      },
    ],
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
];
