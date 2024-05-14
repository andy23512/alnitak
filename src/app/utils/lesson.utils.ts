import { CHARACTER_NAME_MAP } from '../data/character-name-map';
import { Lesson } from '../models/topic.models';
import { nonNullable } from './non-nullable.utils';

export function generateCharacterLesson(str: string): Lesson {
  const components = str.split('');
  return {
    id: encodeURIComponent(str),
    name: components.join(' '),
    components,
    componentNames: components
      .map((c) => CHARACTER_NAME_MAP.get(c))
      .filter(nonNullable)
      .flat(),
  };
}
