import { Lesson } from '../models/topic.models';

export function generateCharacterLesson(str: string): Lesson {
  const components = str.split('');
  return {
    id: encodeURIComponent(str),
    name: components.join(' '),
    components,
  };
}
