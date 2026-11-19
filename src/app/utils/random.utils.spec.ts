import { pickRandomItem, pickRandomItemNTimes, shuffle } from './random.utils';

describe('random utils', () => {
  describe('pickRandomItem', () => {
    const list = ['a', 'b', 'c', 'd'];

    it('picks the item at floor(random * length)', () => {
      const random = spyOn(Math, 'random');
      random.and.returnValue(0);
      expect(pickRandomItem(list)).toBe('a');
      random.and.returnValue(0.26);
      expect(pickRandomItem(list)).toBe('b');
      random.and.returnValue(0.999);
      expect(pickRandomItem(list)).toBe('d');
    });

    it('returns undefined for an empty list', () => {
      expect(pickRandomItem([])).toBeUndefined();
    });

    it('can pick every item', () => {
      const seen = new Set(
        Array.from({ length: 300 }, () => pickRandomItem(list)),
      );
      expect(seen.size).toBe(list.length);
    });
  });

  describe('pickRandomItemNTimes', () => {
    const list = ['a', 'b', 'c'];

    it('returns n items from the list', () => {
      const picks = pickRandomItemNTimes(list, 20);
      expect(picks.length).toBe(20);
      expect(picks.every((p) => list.includes(p))).toBeTrue();
    });

    it('returns an empty list when n is 0', () => {
      expect(pickRandomItemNTimes(list, 0)).toEqual([]);
    });

    it('may repeat the same item in a row', () => {
      spyOn(Math, 'random').and.returnValue(0);
      expect(pickRandomItemNTimes(list, 3)).toEqual(['a', 'a', 'a']);
    });

    it('uses one random draw per pick', () => {
      const random = spyOn(Math, 'random').and.returnValues(0, 0.5, 0.99);
      expect(pickRandomItemNTimes(list, 3)).toEqual(['a', 'b', 'c']);
      expect(random).toHaveBeenCalledTimes(3);
    });
  });

  describe('shuffle', () => {
    it('keeps all the items', () => {
      const list = [1, 2, 3, 4, 5, 6, 7, 8];
      expect([...shuffle(list)].sort()).toEqual(list);
    });

    it('does not change the input list', () => {
      const list = [1, 2, 3, 4, 5];
      shuffle(list);
      expect(list).toEqual([1, 2, 3, 4, 5]);
    });

    it('returns a new list', () => {
      const list = [1, 2, 3];
      expect(shuffle(list)).not.toBe(list);
    });

    it('handles empty and single item lists', () => {
      expect(shuffle([])).toEqual([]);
      expect(shuffle([7])).toEqual([7]);
    });

    it('can produce an order other than the original', () => {
      const list = Array.from({ length: 20 }, (_, i) => i);
      const moved = Array.from({ length: 10 }, () => shuffle(list)).some(
        (s) => s.join() !== list.join(),
      );
      expect(moved).toBeTrue();
    });

    it('is driven by Math.random (swaps the last remaining item with the first when it returns 0)', () => {
      spyOn(Math, 'random').and.returnValue(0);
      expect(shuffle([1, 2, 3, 4])).toEqual([2, 3, 4, 1]);
    });
  });
});
