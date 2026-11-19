import { TestBed } from '@angular/core/testing';
import { SerialLogItemType } from '../models/serial-log.model';
import { SerialLogStore } from './serial-log.store';

describe('SerialLogStore', () => {
  let store: InstanceType<typeof SerialLogStore>;

  beforeEach(() => {
    TestBed.resetTestingModule();
    store = TestBed.inject(SerialLogStore);
  });

  it('starts empty', () => {
    expect(store.items()).toEqual([]);
  });

  it('push appends an item with type, data and the current time', () => {
    const before = Date.now();
    store.push(SerialLogItemType.Send, 'VERSION');
    const [item] = store.items();
    expect(item.type).toBe(SerialLogItemType.Send);
    expect(item.data).toBe('VERSION');
    expect(item.time instanceof Date).toBeTrue();
    expect(item.time.getTime()).toBeGreaterThanOrEqual(before);
    expect(item.time.getTime()).toBeLessThanOrEqual(Date.now());
  });

  it('keeps items in the order they were pushed', () => {
    store.push(SerialLogItemType.Send, 'a');
    store.push(SerialLogItemType.Receive, 'b');
    store.push(SerialLogItemType.Send, 'c');
    expect(store.items().map((i) => [i.type, i.data])).toEqual([
      [SerialLogItemType.Send, 'a'],
      [SerialLogItemType.Receive, 'b'],
      [SerialLogItemType.Send, 'c'],
    ]);
  });

  it('push gives a new array each time (no in-place mutation)', () => {
    const first = store.items();
    store.push(SerialLogItemType.Send, 'a');
    expect(store.items()).not.toBe(first);
    expect(first).toEqual([]);
  });

  it('clear removes all items', () => {
    store.push(SerialLogItemType.Send, 'a');
    store.push(SerialLogItemType.Receive, 'b');
    store.clear();
    expect(store.items()).toEqual([]);
  });

  it('can be used again after clear', () => {
    store.push(SerialLogItemType.Send, 'a');
    store.clear();
    store.push(SerialLogItemType.Receive, 'z');
    expect(store.items().map((i) => i.data)).toEqual(['z']);
  });

  it('does not save to local storage', () => {
    localStorage.clear();
    store.push(SerialLogItemType.Send, 'a');
    TestBed.tick();
    expect(localStorage.length).toBe(0);
  });
});
