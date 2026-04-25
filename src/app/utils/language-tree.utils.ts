import { LanguageTreeNode } from 'tangent-cc-lib';
import { LANGUAGE_TREE } from '../data/language-tree';
import { SimpleKeyboardLayout } from '../models/simple-keyboard-layout.models';

export function findKeyboardLayoutsByLanguageCode(
  languageCode: string,
): SimpleKeyboardLayout[] {
  const languageNode = LANGUAGE_TREE.find((node) => node.code === languageCode);
  if (!languageNode) {
    return [];
  }
  const keyboardLayoutMap = new Map<string, SimpleKeyboardLayout>();
  function findLayoutsFromNode(node: LanguageTreeNode) {
    node.layouts.forEach((layout) => {
      if (!keyboardLayoutMap.has(layout.id)) {
        keyboardLayoutMap.set(layout.id, { id: layout.id, name: layout.name });
      }
    });
    if (node.kind === 'group') {
      node.children.forEach(findLayoutsFromNode);
    }
  }
  findLayoutsFromNode(languageNode);
  return Array.from(keyboardLayoutMap.values());
}
