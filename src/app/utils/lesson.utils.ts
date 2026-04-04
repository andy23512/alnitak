import { CHARACTER_NAME_MAP, nonNullable } from 'tangent-cc-lib';
import { RawLesson } from '../models/topic.models';

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
