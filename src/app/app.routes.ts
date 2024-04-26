import { Route } from '@angular/router';
import { LessonPageComponent } from './pages/lesson-page/lesson-page.component';

export const APP_ROUTES: Route[] = [
  { path: 'lesson/:id', component: LessonPageComponent },
];
