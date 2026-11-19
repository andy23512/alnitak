import { TestBed } from '@angular/core/testing';
import { patchState } from '@ngrx/signals';
import { addEntity, setAllEntities } from '@ngrx/signals/entities';
import { ChordStore } from './chord.store';

const chord = (id: string) => ({ id, input: [1], output: [2] });

describe('ChordStore', () => {
  function create() {
    TestBed.resetTestingModule();
    return TestBed.inject(ChordStore);
  }

  beforeEach(() => localStorage.clear());
  afterEach(() => localStorage.clear());

  it('starts with no chords', () => {
    expect(create().entities()).toEqual([]);
  });

  it('keeps entities by id', () => {
    const store = create();
    patchState(store, setAllEntities([chord('a'), chord('b')]));
    expect(store.ids()).toEqual(['a', 'b']);
    expect(store.entityMap()['b']).toEqual(chord('b'));
  });

  it('saves chords to local storage under "chord" and restores them', () => {
    const store = create();
    patchState(store, addEntity(chord('a')));
    TestBed.tick();
    expect(localStorage.getItem('chord')).toContain('"a"');
    expect(create().entities()).toEqual([chord('a')]);
  });
});
