export type TopicType = 'character' | 'word' | 'chord';

export interface Lesson {
  id: string;
  name: string;
  components: string[];
  componentNames: string[];
}

export interface Topic {
  id: string;
  iconName?: string;
  name: string;
  type: TopicType;
  lessons: Lesson[];
}

export interface LessonWithTopic extends Lesson {
  topic: Topic;
}
