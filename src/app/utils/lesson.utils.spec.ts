import { CHARACTER_NAME_MAP } from 'tangent-cc-lib';
import { generateCharacterLesson } from './lesson.utils';

describe('generateCharacterLesson', () => {
  it('uses the string as the id and joins its characters with spaces as the name', () => {
    const lesson = generateCharacterLesson('abc');
    expect(lesson.id).toBe('abc');
    expect(lesson.name).toBe('a b c');
  });

  it('splits the string into single-character components', () => {
    expect(generateCharacterLesson('abc').components).toEqual(['a', 'b', 'c']);
  });

  it('replaces ?, / and % in the id with words but keeps them in the components', () => {
    const lesson = generateCharacterLesson('?/%');
    expect(lesson.id).toBe('question-markslashpercent');
    expect(lesson.components).toEqual(['?', '/', '%']);
    expect(lesson.name).toBe('? / %');
  });

  it('replaces every occurrence, not just the first', () => {
    expect(generateCharacterLesson('//??%%').id).toBe(
      'slashslashquestion-markquestion-markpercentpercent',
    );
  });

  it('flattens the names of all characters that have names, in order', () => {
    const lesson = generateCharacterLesson('12');
    const expected = [
      ...(CHARACTER_NAME_MAP.get('1') ?? []),
      ...(CHARACTER_NAME_MAP.get('2') ?? []),
    ];
    expect(expected.length).toBeGreaterThan(0);
    expect(lesson.componentNames).toEqual(expected);
  });

  it('skips characters that have no name', () => {
    const unnamed = '\uE000';
    expect(CHARACTER_NAME_MAP.has(unnamed)).toBeFalse();
    const lesson = generateCharacterLesson('1' + unnamed);
    expect(lesson.componentNames).toEqual(CHARACTER_NAME_MAP.get('1') ?? []);
    expect(lesson.componentNames.length).toBeGreaterThan(0);
    expect(lesson.components.length).toBe(2);
  });

  it('gives empty fields for an empty string', () => {
    expect(generateCharacterLesson('')).toEqual({
      id: '',
      name: '',
      components: [],
      componentNames: [],
    });
  });
});
