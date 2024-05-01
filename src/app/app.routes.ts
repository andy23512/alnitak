import { Route } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { LessonPageComponent } from './pages/lesson-page/lesson-page.component';

export const APP_ROUTES: Route[] = [
  { path: 'topic/:topicId/lesson/:lessonId', component: LessonPageComponent },
  { path: '', pathMatch: 'full', component: HomePageComponent },
];
