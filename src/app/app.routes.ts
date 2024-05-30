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
];
