import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { LESSONS } from '../data/topics';
import { LessonWithPreviousAndNextLessonUrl } from '../models/topic.models';

export const lessonResolver: ResolveFn<LessonWithPreviousAndNextLessonUrl> = (
  route: ActivatedRouteSnapshot,
) => {
  const topicId = route.paramMap.get('topicId');
  const lessonId = route.paramMap.get('lessonId');
  const lessonIndex = LESSONS.findIndex(
    (lesson) => lesson.id === lessonId && lesson.topic.id === topicId,
  );
  if (lessonIndex === -1) {
    throw Error('Lesson not found.');
  }
  const lesson = LESSONS[lessonIndex];
  const previous = lessonIndex !== 0 ? LESSONS[lessonIndex - 1] : null;
  const next =
    lessonIndex !== LESSONS.length - 1 ? LESSONS[lessonIndex + 1] : null;
  return {
    ...lesson,
    previousLessonUrl: previous
      ? `/topic/${previous.topic.id}/lesson/${previous.id}`
      : null,
    nextLessonUrl: next ? `/topic/${next.topic.id}/lesson/${next.id}` : null,
  };
};
