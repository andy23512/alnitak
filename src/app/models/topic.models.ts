import { Icon } from '../types/icon.types';

export type TopicType = 'character' | 'word' | 'chord';

export interface RawLesson {
  id: string;
  name: string;
  components: string[];
  componentNames: string[];
}

export interface Topic {
  id: string;
  iconName?: Icon;
  name: string;
  type: TopicType;
  lessons: RawLesson[];
}

export interface Lesson extends RawLesson {
  topic: Topic;
}
