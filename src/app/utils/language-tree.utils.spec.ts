import { LANGUAGE_TREE } from '../data/language-tree';
import { findKeyboardLayoutsByLanguageCode } from './language-tree.utils';

describe('findKeyboardLayoutsByLanguageCode', () => {
  it('returns an empty list for an unknown language code', () => {
    expect(findKeyboardLayoutsByLanguageCode('no-such-language')).toEqual([]);
  });

  it('returns an empty list for the empty code', () => {
    expect(findKeyboardLayoutsByLanguageCode('')).toEqual([]);
  });

  it('returns only id and name for each layout', () => {
    const node = LANGUAGE_TREE.find((n) => n.layouts.length > 0)!;
    const result = findKeyboardLayoutsByLanguageCode(node.code);
    expect(result.length).toBeGreaterThan(0);
    result.forEach((layout) =>
      expect(Object.keys(layout).sort()).toEqual(['id', 'name']),
    );
  });

  it('includes the layouts of the node itself', () => {
    const node = LANGUAGE_TREE.find((n) => n.layouts.length > 0)!;
    const ids = findKeyboardLayoutsByLanguageCode(node.code).map((l) => l.id);
    node.layouts.forEach((l) => expect(ids).toContain(l.id));
  });

  it('includes the layouts of all descendants of a group node', () => {
    const group = LANGUAGE_TREE.find(
      (n) => n.kind === 'group' && n.children.some((c) => c.layouts.length),
    );
    expect(group).toBeDefined();
    if (group?.kind !== 'group') return;
    const ids = findKeyboardLayoutsByLanguageCode(group.code).map((l) => l.id);
    group.children.forEach((child) =>
      child.layouts.forEach((l) => expect(ids).toContain(l.id)),
    );
  });

  it('lists each layout id only once', () => {
    LANGUAGE_TREE.slice(0, 60).forEach((node) => {
      const ids = findKeyboardLayoutsByLanguageCode(node.code).map((l) => l.id);
      expect(new Set(ids).size).toBe(ids.length);
    });
  });

  it('puts the layouts of the node before those of its children', () => {
    const group = LANGUAGE_TREE.find(
      (n) => n.kind === 'group' && n.layouts.length > 0,
    );
    if (group?.kind !== 'group') return;
    const ids = findKeyboardLayoutsByLanguageCode(group.code).map((l) => l.id);
    expect(ids[0]).toBe(group.layouts[0].id);
  });
});
