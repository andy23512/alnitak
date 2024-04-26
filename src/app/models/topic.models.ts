export type TopicType = 'character' | 'word' | 'chord';

export interface Lesson {
  id: string;
  name: string;
  components: { input: string; output: string }[] | string[];
}

export interface Topic {
  id: string;
  name: string;
  type: TopicType;
  lessons: Lesson[];
}
