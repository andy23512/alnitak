import { LESSONS, LESSON_DATA_FOR_SEARCH, TOPICS } from './topics';

describe('topics', () => {
  it('has the number, letter and symbol topics, in order', () => {
    expect(TOPICS.map((t) => t.id)).toEqual(['number', 'letter', 'symbol']);
  });

  it('has unique topic ids', () => {
    expect(new Set(TOPICS.map((t) => t.id)).size).toBe(TOPICS.length);
  });

  it('has unique lesson ids inside each topic, since the url uses both', () => {
    for (const t of TOPICS) {
      const ids = t.lessons.map((l) => l.id);
      expect(new Set(ids).size).withContext(t.id).toBe(ids.length);
    }
  });

  it('gives every lesson characters, and names for the number and symbol ones', () => {
    for (const l of LESSONS) {
      expect(l.components.length).withContext(l.id).toBeGreaterThan(0);
      if (l.topic.id !== 'letter') {
        expect(l.componentNames.length)
          .withContext(l.id)
          .toBeGreaterThanOrEqual(l.components.length);
      }
      expect(l.name).withContext(l.id).not.toBe('');
    }
  });

  it('teaches all 26 letters, each once, in the last letter lesson', () => {
    const letters = TOPICS.find((t) => t.id === 'letter')!.lessons.find(
      (l) => l.id === 'all',
    )!;
    expect([...letters.components].sort().join('')).toBe(
      'abcdefghijklmnopqrstuvwxyz',
    );
  });

  it('builds a review lesson from the lessons before it', () => {
    const lessons = TOPICS.find((t) => t.id === 'letter')!.lessons;
    const reviewIndex = lessons.findIndex((l) => l.id === 'review1');
    const before = lessons
      .slice(reviewIndex - 2, reviewIndex)
      .flatMap((l) => l.components);
    expect([...lessons[reviewIndex].components].sort()).toEqual(
      [...before].sort(),
    );
  });

  it('lists every lesson of every topic, in topic order, with its topic', () => {
    expect(LESSONS.length).toBe(
      TOPICS.reduce((n, t) => n + t.lessons.length, 0),
    );
    let i = 0;
    for (const t of TOPICS) {
      for (const l of t.lessons) {
        expect(LESSONS[i].id).toBe(l.id);
        expect(LESSONS[i].topic).toBe(t);
        i++;
      }
    }
  });

  it('has an icon name for each topic', () => {
    for (const t of TOPICS) {
      expect(t.iconName).withContext(t.id).toBeTruthy();
    }
  });

  describe('search data', () => {
    it('has an entry for every character and character name of every lesson', () => {
      const expected = LESSONS.reduce(
        (n, l) => n + l.components.length + l.componentNames.length,
        0,
      );
      expect(LESSON_DATA_FOR_SEARCH.length).toBe(expected);
    });

    it('points each entry at the lesson it came from', () => {
      for (const entry of LESSON_DATA_FOR_SEARCH) {
        const all = [
          ...entry.lesson.components,
          ...entry.lesson.componentNames,
        ];
        expect(all).toContain(entry.key);
      }
    });
  });
});
