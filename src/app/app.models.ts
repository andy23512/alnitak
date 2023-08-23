export type CourseType = 'char' | 'word' | 'chord';

export interface Lesson {
  name: string;
  components: { input: string; output: string }[] | string[];
}

export interface Module {
  name: string;
  description?: string;
  lessons: Lesson[];
}

export interface Course {
  type: CourseType;
  name: string;
  modules: Module[];
}

export interface Program {
  name: string;
  courses: Course[];
}
