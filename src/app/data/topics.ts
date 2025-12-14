import { Lesson, Topic } from '../models/topic.models';
import { generateCharacterLesson } from '../utils/lesson.utils';

export const LETTER_TOPIC: Topic = {
  id: 'letter',
  iconName: 'abc',
  name: 'topic.letters',
  type: 'character',
  lessons: [
    ...['reat', 'ioln'].map(generateCharacterLesson),
    {
      ...generateCharacterLesson('reatioln'),
      id: 'review1',
      name: 'lesson.review-1',
    },
    ...['ujys', 'kcfd'].map(generateCharacterLesson),
    {
      ...generateCharacterLesson('ujyskcfd'),
      id: 'review2',
      name: 'lesson.review-2',
    },
    ...['mvhp', 'wgz', 'bqx'].map(generateCharacterLesson),
    {
      ...generateCharacterLesson('mvhpwgzbqx'),
      id: 'review3',
      name: 'lesson.review-3',
    },
    {
      ...generateCharacterLesson('abcdefghijklmnopqrstuvwxyz'),
      id: 'all',
      name: 'lesson.all-letters',
    },
  ],
};

export const NUMBER_TOPIC: Topic = {
  id: 'number',
  iconName: '123',
  name: 'topic.numbers',
  type: 'character',
  lessons: ['123', '456', '7890'].map(generateCharacterLesson).concat([
    {
      ...generateCharacterLesson('1234567890'),
      id: 'all',
      name: 'lesson.all-numbers',
    },
  ]),
};

export const SYMBOL_TOPIC: Topic = {
  id: 'symbol',
  name: 'topic.symbols',
  iconName: 'question_mark',
  type: 'character',
  lessons: [
    '`~!@',
    '#$%^',
    '&*()',
    '-_=+',
    '[]{}',
    ';:\'"',
    ',<.>',
    '/?\\|',
  ].map(generateCharacterLesson),
};

export const TOPICS = [NUMBER_TOPIC, LETTER_TOPIC, SYMBOL_TOPIC];
export const LESSONS: Lesson[] = TOPICS.map((topic) =>
  topic.lessons.map((l) => ({ ...l, topic })),
).flat();
export const LESSON_DATA_FOR_SEARCH = LESSONS.map((lesson) =>
  lesson.components
    .map((c) => ({ key: c, lesson }))
    .concat(lesson.componentNames.map((n) => ({ key: n, lesson }))),
).flat();
