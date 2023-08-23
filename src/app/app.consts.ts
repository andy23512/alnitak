import { Program } from './app.models';

export const LANGUAGES: Program[] = [
  {
    name: 'English',
    courses: [
      {
        type: 'char',
        name: 'Characters',
        modules: [
          {
            name: 'Letters',
            lessons: [
              {
                name: 'e, a, r',
                components: ['e', 'a', 'r'],
              },
            ],
          },
        ],
      },
    ],
  },
];
