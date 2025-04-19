export function pickRandomItem<T>(list: T[]) {
  const index = Math.floor(Math.random() * list.length);
  return list[index];
}

export function pickRandomItemNTimes<T>(list: T[], n: number) {
  return Array.from({ length: n }, () => pickRandomItem(list));
}

export function shuffle<T>(list: T[]) {
  const cloneList = [...list];
  let currentIndex = list.length;

  while (currentIndex != 0) {
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [cloneList[currentIndex], cloneList[randomIndex]] = [
      cloneList[randomIndex],
      cloneList[currentIndex],
    ];
  }
  return cloneList;
}
