import { CHARACTER_NAME_MAP } from '../data/character-name-map';
import { RawLesson } from '../models/topic.models';
import { nonNullable } from './non-nullable.utils';

export function generateCharacterLesson(str: string): RawLesson {
  const components = str.split('');
  return {
    id: str
      .replace(/\?/g, 'question-mark')
      .replace(/\//g, 'slash')
      .replace(/%/g, 'percent'),
    name: components.join(' '),
    components,
    componentNames: components
      .map((c) => CHARACTER_NAME_MAP.get(c))
      .filter(nonNullable)
      .flat(),
  };
}

export function generateTrigramLesson(trigrams: string[]): RawLesson {
  return {
    id: trigrams.join(','),
    name: trigrams.join(' '),
    components: trigrams,
    componentNames: trigrams,
  };
}
