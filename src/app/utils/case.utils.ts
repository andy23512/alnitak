/**
 * Capitalize first word in input string
 *
 * @export
 * @param {string} input
 * @returns {string}
 */
export function toFirstCap(input: string): string {
  return input ? input[0].toUpperCase() + input.slice(1) : '';
}

const KEEP_LOWERCASE_WORD_SET = new Set([
  'a',
  'an',
  'the',
  'and',
  'or',
  'but',
  'so',
  'as',
  'if',
  'yet',
  'nor',
  'although',
  'because',
  'since',
  'unless',
  'until',
  'whereas',
  'while',
  'by',
  'at',
  'on',
  'in',
  'to',
  'onto',
  'into',
  'of',
  'for',
  'from',
  'off',
  'with',
  'within',
  'without',
  'via',
  'through',
  'about',
  'above',
  'over',
  'up',
  'down',
  'upon',
  'like',
  'before',
  'after',
  'beneath',
  'across',
  'among',
  'beyond',
  'between',
  'around',
  'toward',
  'past',
  'along',
]);

/**
 * Real title case transformation (ignoring some stop words)
 *
 * @export
 * @param {string} input
 * @returns {string}
 */
export function toTitleCase(input: string): string {
  return input
    ? input
        .trim()
        .split(' ')
        .map((w, i) =>
          i !== 0 && KEEP_LOWERCASE_WORD_SET.has(w) ? w : toFirstCap(w),
        )
        .join(' ')
    : '';
}
