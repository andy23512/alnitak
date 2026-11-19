import { toFirstCap, toTitleCase } from './case.utils';

describe('toFirstCap', () => {
  it('capitalizes the first letter only', () => {
    expect(toFirstCap('hello world')).toBe('Hello world');
  });

  it('keeps the rest of the string as it is', () => {
    expect(toFirstCap('hELLO')).toBe('HELLO');
  });

  it('returns an empty string for an empty string', () => {
    expect(toFirstCap('')).toBe('');
  });

  it('leaves a string that starts with a non-letter alone', () => {
    expect(toFirstCap('1abc')).toBe('1abc');
    expect(toFirstCap(' abc')).toBe(' abc');
  });
});

describe('toTitleCase', () => {
  it('capitalizes every word', () => {
    expect(toTitleCase('quick setting panel')).toBe('Quick Setting Panel');
  });

  it('keeps stop words in lower case', () => {
    expect(toTitleCase('rise of the machines')).toBe('Rise of the Machines');
    expect(toTitleCase('a tale from the deep')).toBe('A Tale from the Deep');
  });

  it('always capitalizes the first word, even a stop word', () => {
    expect(toTitleCase('the end')).toBe('The End');
    expect(toTitleCase('of mice and men')).toBe('Of Mice and Men');
  });

  it('trims the input', () => {
    expect(toTitleCase('  hello world  ')).toBe('Hello World');
  });

  it('returns an empty string for an empty string', () => {
    expect(toTitleCase('')).toBe('');
  });

  it('only matches stop words in lower case', () => {
    expect(toTitleCase('rise Of the machines')).toBe('Rise Of the Machines');
  });

  it('does not change letters other than the first of each word', () => {
    expect(toTitleCase('iPhone and USB')).toBe('IPhone and USB');
  });

  // Current behavior: words are split on single spaces only, so a doubled
  // space produces an empty word and is kept.
  it('keeps repeated spaces between words', () => {
    expect(toTitleCase('a  b')).toBe('A  B');
  });
});
