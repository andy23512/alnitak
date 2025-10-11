import { Icon } from '../types/icon.types';

export type TopicType = 'character' | 'trigram';

export interface RawLesson {
  id: string;
  name: string;
  components: string[];
  componentNames: string[];
}

export interface BaseTopic {
  id: string;
  iconName?: Icon;
  name: string;
  lessons: RawLesson[];
  type: TopicType;
}

export interface CharacterTopic extends BaseTopic {
  type: 'character';
}

export interface TrigramTopic extends BaseTopic {
  type: 'trigram';
}

export type Topic = CharacterTopic | TrigramTopic;

export interface CharacterLesson extends RawLesson {
  topic: CharacterTopic;
  topicType: CharacterTopic['type'];
}

export interface TrigramLesson extends RawLesson {
  topic: TrigramTopic;
  topicType: TrigramTopic['type'];
}

export type Lesson = CharacterLesson | TrigramLesson;

interface LessonUrlMixin {
  previousLessonUrl: string | null;
  nextLessonUrl: string | null;
}

export type CharacterLessonWithPreviousAndNextLessonUrl = CharacterLesson &
  LessonUrlMixin;

export type TrigramLessonWithPreviousAndNextLessonUrl = TrigramLesson &
  LessonUrlMixin;

export type LessonWithPreviousAndNextLessonUrl =
  | CharacterLessonWithPreviousAndNextLessonUrl
  | TrigramLessonWithPreviousAndNextLessonUrl;
