import { Topic } from '../models/topic.models';

export const LETTER_TOPIC: Topic = {
  id: 'letter',
  name: 'Letter',
  type: 'character',
  lessons: [
    { id: 'eta', name: 'e, t, a', components: ['e', 't', 'a'] },
    { id: 'oin', name: 'o, i, n', components: ['o', 'i', 'n'] },
    { id: 'shr', name: 's, h, r', components: ['s', 'h', 'r'] },
    { id: 'dlc', name: 'd, l, c', components: ['d', 'l', 'c'] },
    { id: 'umw', name: 'u, m, w', components: ['u', 'm', 'w'] },
    { id: 'fgy', name: 'f, g, y', components: ['f', 'g', 'y'] },
    { id: 'pbvk', name: 'p, b, v, k', components: ['p', 'b', 'v', 'k'] },
    { id: 'jxqz', name: 'j, x, q, z', components: ['j', 'x', 'q', 'z'] },
  ],
};

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
    {
      id: 'all',
      name: 'All',
      components: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
    },
  ],
};

export const TOPICS = [NUMBER_TOPIC, LETTER_TOPIC];
