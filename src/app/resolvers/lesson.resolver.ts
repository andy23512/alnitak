import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, Router } from '@angular/router';
import { ResolvedLesson } from '../models/topic.models';

export const lessonResolver: ResolveFn<Promise<ResolvedLesson | null>> = async (
  route: ActivatedRouteSnapshot,
) => {
  // Injected before the first await, while the injection context still exists.
  const router = inject(Router);
  // Loaded here, not imported at the top, so the lesson data stays out of the main bundle.
  const { LESSONS } = await import('../data/topics');
  const topicId = route.paramMap.get('topicId');
  const lessonId = route.paramMap.get('lessonId');
  const lessonIndex = LESSONS.findIndex(
    (lesson) => lesson.id === lessonId && lesson.topic.id === topicId,
  );
  if (lessonIndex === -1) {
    router.navigate(['/lesson-not-found']);
    return null;
  }
  const lesson = LESSONS[lessonIndex];
  const previous = lessonIndex === 0 ? null : LESSONS[lessonIndex - 1];
  const next =
    lessonIndex === LESSONS.length - 1 ? null : LESSONS[lessonIndex + 1];
  return {
    ...lesson,
    previousLessonUrl: previous
      ? `/topic/${previous.topic.id}/lesson/${previous.id}`
      : null,
    nextLessonUrl: next ? `/topic/${next.topic.id}/lesson/${next.id}` : null,
  };
};
