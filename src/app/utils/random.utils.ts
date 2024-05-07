export function pickRandomItem<T>(list: T[]) {
  const index = Math.floor(Math.random() * list.length);
  return list[index];
}

export function pickRandomItemNTimes<T>(list: T[], n: number) {
  return Array.from({ length: n }, () => pickRandomItem(list));
}
