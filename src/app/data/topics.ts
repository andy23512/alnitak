import { Topic } from '../models/topic.models';
import { generateCharacterLesson } from '../utils/lesson.utils';

export const LETTER_TOPIC: Topic = {
  id: 'letter',
  iconName: 'abc',
  name: 'Letter',
  type: 'character',
  lessons: ['eto', 'nus', 'cda', 'rhm', 'ilw', 'fgy', 'pbvk', 'jxqz'].map(
    generateCharacterLesson,
  ),
};

export const NUMBER_TOPIC: Topic = {
  id: 'number',
  iconName: '123',
  name: 'Number',
  type: 'character',
  lessons: ['123', '456', '7890'].map(generateCharacterLesson).concat([
    {
      id: 'all',
      name: 'All',
      components: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
    },
  ]),
};

export const TOPICS = [NUMBER_TOPIC, LETTER_TOPIC];
