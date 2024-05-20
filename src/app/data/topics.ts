import { Lesson, Topic } from '../models/topic.models';
import { generateCharacterLesson } from '../utils/lesson.utils';

export const LETTER_TOPIC: Topic = {
  id: 'letter',
  iconName: 'abc',
  name: 'Letters',
  type: 'character',
  lessons: ['reat', 'ioln', 'ujys', 'kcfd', 'mvhp', 'wgz', 'bqx'].map(
    generateCharacterLesson,
  ),
};

export const NUMBER_TOPIC: Topic = {
  id: 'number',
  iconName: '123',
  name: 'Numbers',
  type: 'character',
  lessons: ['123', '456', '7890'].map(generateCharacterLesson).concat([
    {
      ...generateCharacterLesson('1234567890'),
      id: 'all',
      name: 'All Numbers',
    },
  ]),
};

export const SYMBOL_TOPIC: Topic = {
  id: 'symbol',
  name: 'Symbols',
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
  [{ key: lesson.name, lesson }]
    .concat(lesson.components.map((c) => ({ key: c, lesson })))
    .concat(lesson.componentNames.map((n) => ({ key: n, lesson }))),
).flat();
