import { Topic } from '../models/topic.models';

export const NUMBER_TOPIC: Topic = {
  id: 'number',
  name: 'Number',
  type: 'character',
  lessons: [
    {
      id: '123',
      name: '1, 2, 3',
      components: ['1', '2', '3'],
    },
    {
      id: '456',
      name: '4, 5, 6',
      components: ['4', '5', '6'],
    },
    {
      id: '7890',
      name: '7, 8, 9, 0',
      components: ['7', '8', '9', '0'],
    },
  ],
};

export const TOPICS = [NUMBER_TOPIC];
