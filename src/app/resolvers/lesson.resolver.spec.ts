import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  ResolveFn,
  Router,
  convertToParamMap,
} from '@angular/router';
import { APP_ROUTES } from '../app.routes';
import { LESSONS } from '../data/topics';
import { ResolvedLesson } from '../models/topic.models';
import { lessonResolver } from './lesson.resolver';

type Resolver = ResolveFn<Promise<ResolvedLesson | null>>;

[['lessonResolver', lessonResolver]].forEach(([name, resolver]) => {
  describe(name as string, () => {
    let navigate: jasmine.Spy;

    const resolve = async (topicId: string | null, lessonId: string | null) => {
      const route = {
        paramMap: convertToParamMap({
          ...(topicId === null ? {} : { topicId }),
          ...(lessonId === null ? {} : { lessonId }),
        }),
      } as ActivatedRouteSnapshot;
      return (await TestBed.runInInjectionContext(() =>
        (resolver as Resolver)(route, {} as never),
      )) as ResolvedLesson | null;
    };
    const url = (i: number) =>
      `/topic/${LESSONS[i].topic.id}/lesson/${LESSONS[i].id}`;

    beforeEach(() => {
      TestBed.resetTestingModule();
      navigate = jasmine.createSpy('navigate');
      TestBed.configureTestingModule({
        providers: [{ provide: Router, useValue: { navigate } }],
      });
    });

    it('returns the lesson of the topic and id', async () => {
      const index = Math.floor(LESSONS.length / 2);
      const lesson = (await resolve(
        LESSONS[index].topic.id,
        LESSONS[index].id,
      ))!;
      expect(lesson.id).toBe(LESSONS[index].id);
      expect(lesson.topic).toBe(LESSONS[index].topic);
      expect(lesson.components).toEqual(LESSONS[index].components);
      expect(navigate).not.toHaveBeenCalled();
    });

    it('links to the lessons before and after it, across topics', async () => {
      const index = Math.floor(LESSONS.length / 2);
      const lesson = (await resolve(
        LESSONS[index].topic.id,
        LESSONS[index].id,
      ))!;
      expect(lesson.previousLessonUrl).toBe(url(index - 1));
      expect(lesson.nextLessonUrl).toBe(url(index + 1));
    });

    it('has no previous lesson for the first one', async () => {
      const lesson = (await resolve(LESSONS[0].topic.id, LESSONS[0].id))!;
      expect(lesson.previousLessonUrl).toBeNull();
      expect(lesson.nextLessonUrl).toBe(url(1));
    });

    it('links the second lesson back to the first one', async () => {
      const lesson = (await resolve(LESSONS[1].topic.id, LESSONS[1].id))!;
      expect(lesson.previousLessonUrl).toBe(url(0));
    });

    it('has no next lesson for the last one', async () => {
      const last = LESSONS.length - 1;
      const lesson = (await resolve(LESSONS[last].topic.id, LESSONS[last].id))!;
      expect(lesson.nextLessonUrl).toBeNull();
      expect(lesson.previousLessonUrl).toBe(url(last - 1));
    });

    it('finds every lesson', async () => {
      for (const l of LESSONS) {
        const r = await resolve(l.topic.id, l.id);
        expect(r?.id).withContext(`${l.topic.id}/${l.id}`).toBe(l.id);
      }
    });

    it('goes to the not found page for an unknown lesson', async () => {
      expect(await resolve(LESSONS[0].topic.id, 'nope')).toBeNull();
      expect(navigate).toHaveBeenCalledOnceWith(['/lesson-not-found']);
    });

    it('goes to the not found page for an unknown topic', async () => {
      expect(await resolve('nope', LESSONS[0].id)).toBeNull();
      expect(navigate).toHaveBeenCalledOnceWith(['/lesson-not-found']);
    });

    it('needs the lesson to belong to the topic', async () => {
      const other = LESSONS.find((l) => l.topic.id !== LESSONS[0].topic.id)!;
      expect(await resolve(LESSONS[0].topic.id, other.id)).toBeNull();
    });

    it('goes to the not found page when a parameter is missing', async () => {
      expect(await resolve(null, null)).toBeNull();
      expect(navigate).toHaveBeenCalledOnceWith(['/lesson-not-found']);
    });
  });
});

describe('the lesson route', () => {
  it('uses lessonResolver, not a copy of it', () => {
    const route = APP_ROUTES.find(
      (r) => r.path === 'topic/:topicId/lesson/:lessonId',
    )!;
    expect(route.resolve!['lesson']).toBe(lessonResolver);
  });
});
