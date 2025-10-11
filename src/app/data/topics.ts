import { CharacterTopic, Lesson, TrigramTopic } from '../models/topic.models';
import {
  generateCharacterLesson,
  generateTrigramLesson,
} from '../utils/lesson.utils';

export const LETTER_TOPIC: CharacterTopic = {
  id: 'letter',
  iconName: 'abc',
  name: 'Letters',
  type: 'character',
  lessons: [
    ...['reat', 'ioln'].map(generateCharacterLesson),
    {
      ...generateCharacterLesson('reatioln'),
      id: 'review1',
      name: 'Review 1',
    },
    ...['ujys', 'kcfd'].map(generateCharacterLesson),
    {
      ...generateCharacterLesson('ujyskcfd'),
      id: 'review2',
      name: 'Review 2',
    },
    ...['mvhp', 'wgz', 'bqx'].map(generateCharacterLesson),
    {
      ...generateCharacterLesson('mvhpwgzbqx'),
      id: 'review3',
      name: 'Review 3',
    },
    {
      ...generateCharacterLesson('abcdefghijklmnopqrstuvwxyz'),
      id: 'all',
      name: 'All Letters',
    },
  ],
};

export const NUMBER_TOPIC: CharacterTopic = {
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

export const SYMBOL_TOPIC: CharacterTopic = {
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

export const TRIGRAM_TOPIC: TrigramTopic = {
  id: 'trigram',
  name: 'Trigrams',
  iconName: 'password_2',
  type: 'trigram',
  lessons: [
    ['the', 'and', 'ing'],
    ['ent', 'ion', 'her'],
    ['for', 'tha', 'nth'],
    ['int', 'ere', 'tio'],
    ['ter', 'est', 'ers'],
    ['ati', 'hat', 'ate'],
    ['all', 'eth', 'hes'],
    ['ver', 'his', 'oft'],
    ['ith', 'fth', 'sth'],
    ['oth', 'res', 'ont'],
  ].map(generateTrigramLesson),
};

export const TOPICS = [NUMBER_TOPIC, LETTER_TOPIC, SYMBOL_TOPIC, TRIGRAM_TOPIC];
export const LESSONS: Lesson[] = TOPICS.map((topic) =>
  topic.lessons.map((l) => ({ ...l, topic, topicType: topic.type }) as Lesson),
).flat();
export const LESSON_DATA_FOR_SEARCH = LESSONS.map((lesson) =>
  [{ key: lesson.name, lesson }]
    .concat(lesson.components.map((c) => ({ key: c, lesson })))
    .concat(lesson.componentNames.map((n) => ({ key: n, lesson }))),
).flat();
