import { TestBed } from '@angular/core/testing';
import { patchState } from '@ngrx/signals';
import { removeEntity, updateEntity } from '@ngrx/signals/entities';
import {
  CC1_CC2_LEFT_HAND_ONLY_DEVICE_LAYOUT,
  CC1_CC2_RIGHT_HAND_ONLY_DEVICE_LAYOUT,
  DEFAULT_DEVICE_LAYOUT,
  DeviceLayout,
  M4G_DEFAULT_DEVICE_LAYOUT,
} from 'tangent-cc-lib';
import { DeviceLayoutStore } from './device-layout.store';

describe('DeviceLayoutStore', () => {
  const KEY = 'deviceLayout';

  function create() {
    TestBed.resetTestingModule();
    return TestBed.inject(DeviceLayoutStore);
  }
  /** Starts a store, lets it save, then restarts it with `edit` applied. */
  function restartWith(
    edit: (state: {
      entityMap: Record<string, DeviceLayout>;
      ids: string[];
      selectedId: string | null;
    }) => void,
  ) {
    create();
    TestBed.tick();
    const saved = JSON.parse(localStorage.getItem(KEY)!);
    edit(saved);
    localStorage.setItem(KEY, JSON.stringify(saved));
    return create();
  }

  beforeEach(() => localStorage.clear());
  afterEach(() => localStorage.clear());

  describe('first start', () => {
    it('loads the four built-in layouts and selects the default one', () => {
      const store = create();
      expect(store.ids()).toEqual([
        DEFAULT_DEVICE_LAYOUT.id,
        M4G_DEFAULT_DEVICE_LAYOUT.id,
        CC1_CC2_RIGHT_HAND_ONLY_DEVICE_LAYOUT.id,
        CC1_CC2_LEFT_HAND_ONLY_DEVICE_LAYOUT.id,
      ]);
      expect(store.selectedId()).toBe(DEFAULT_DEVICE_LAYOUT.id);
      expect(store.selectedEntity()).toEqual(DEFAULT_DEVICE_LAYOUT);
    });

    it('reports the number of layers of the selected layout', () => {
      const store = create();
      expect(store.selectedEntityLayerNumber()).toBe(
        DEFAULT_DEVICE_LAYOUT.layout.length,
      );
    });

    it('saves to local storage under "deviceLayout"', () => {
      create();
      TestBed.tick();
      expect(JSON.parse(localStorage.getItem(KEY)!).selectedId).toBe(
        DEFAULT_DEVICE_LAYOUT.id,
      );
    });
  });

  describe('selection', () => {
    it('setSelectedId changes the selected layout and its layer number', () => {
      const store = create();
      store.setSelectedId(M4G_DEFAULT_DEVICE_LAYOUT.id);
      expect(store.selectedEntity()).toEqual(M4G_DEFAULT_DEVICE_LAYOUT);
      expect(store.selectedEntityLayerNumber()).toBe(
        M4G_DEFAULT_DEVICE_LAYOUT.layout.length,
      );
    });

    it('has no selected layout and no layer number when the selection is cleared', () => {
      const store = create();
      store.setSelectedId(null);
      expect(store.selectedEntity()).toBeNull();
      expect(store.selectedEntityLayerNumber()).toBeNull();
    });

    it('selectedEntity is undefined for an id that does not exist', () => {
      const store = create();
      store.setSelectedId('missing');
      expect(store.selectedEntity()).toBeUndefined();
      // current behavior: the layer number reads the layout of a missing layout
      expect(store.selectedEntityLayerNumber()).toBeNull();
    });

    it('load puts the built-in layouts back and re-selects the default', () => {
      const store = create();
      patchState(store, removeEntity(M4G_DEFAULT_DEVICE_LAYOUT.id));
      store.setSelectedId(CC1_CC2_LEFT_HAND_ONLY_DEVICE_LAYOUT.id);
      store.load();
      expect(store.ids().length).toBe(4);
      expect(store.selectedId()).toBe(DEFAULT_DEVICE_LAYOUT.id);
    });

    it('load drops layouts that are not built in', () => {
      const store = create();
      patchState(store, {
        entityMap: {
          ...store.entityMap(),
          custom: { ...DEFAULT_DEVICE_LAYOUT, id: 'custom', name: 'custom' },
        },
        ids: [...store.ids(), 'custom'],
      });
      store.load();
      expect(store.ids()).not.toContain('custom');
    });
  });

  describe('restart with saved data', () => {
    it('keeps the saved selection', () => {
      const store = restartWith(
        (s) => (s.selectedId = M4G_DEFAULT_DEVICE_LAYOUT.id),
      );
      expect(store.selectedId()).toBe(M4G_DEFAULT_DEVICE_LAYOUT.id);
    });

    it('renames the old default layout to cc1-cc2-default', () => {
      const store = restartWith((s) => (s.entityMap['default'].name = 'old'));
      expect(store.entityMap()['default'].name).toBe('cc1-cc2-default');
    });

    it('leaves the default layout alone when it is already named right', () => {
      const store = restartWith(() => {});
      expect(store.entityMap()['default']).toEqual(DEFAULT_DEVICE_LAYOUT);
    });

    it('adds the M4G layout when it is missing', () => {
      const store = restartWith((s) => {
        delete s.entityMap[M4G_DEFAULT_DEVICE_LAYOUT.id];
        s.ids = s.ids.filter((i) => i !== M4G_DEFAULT_DEVICE_LAYOUT.id);
      });
      expect(store.entityMap()[M4G_DEFAULT_DEVICE_LAYOUT.id]).toEqual(
        M4G_DEFAULT_DEVICE_LAYOUT,
      );
    });

    it('renames the M4G layout but keeps its content when only the name is wrong', () => {
      const store = restartWith(
        (s) => (s.entityMap[M4G_DEFAULT_DEVICE_LAYOUT.id].name = 'old'),
      );
      expect(store.entityMap()[M4G_DEFAULT_DEVICE_LAYOUT.id].name).toBe(
        'm4g-default',
      );
    });

    it('adds the right-hand-only and left-hand-only layouts when missing', () => {
      const store = restartWith((s) => {
        for (const layout of [
          CC1_CC2_RIGHT_HAND_ONLY_DEVICE_LAYOUT,
          CC1_CC2_LEFT_HAND_ONLY_DEVICE_LAYOUT,
        ]) {
          delete s.entityMap[layout.id];
          s.ids = s.ids.filter((i) => i !== layout.id);
        }
      });
      expect(
        store.entityMap()[CC1_CC2_RIGHT_HAND_ONLY_DEVICE_LAYOUT.id],
      ).toEqual(CC1_CC2_RIGHT_HAND_ONLY_DEVICE_LAYOUT);
      expect(
        store.entityMap()[CC1_CC2_LEFT_HAND_ONLY_DEVICE_LAYOUT.id],
      ).toEqual(CC1_CC2_LEFT_HAND_ONLY_DEVICE_LAYOUT);
    });

    it('overwrites the hand-only layouts with the built-in version', () => {
      const store = restartWith((s) => {
        s.entityMap[CC1_CC2_RIGHT_HAND_ONLY_DEVICE_LAYOUT.id].name = 'edited';
        s.entityMap[CC1_CC2_LEFT_HAND_ONLY_DEVICE_LAYOUT.id].name = 'edited';
      });
      expect(
        store.entityMap()[CC1_CC2_RIGHT_HAND_ONLY_DEVICE_LAYOUT.id],
      ).toEqual(CC1_CC2_RIGHT_HAND_ONLY_DEVICE_LAYOUT);
      expect(
        store.entityMap()[CC1_CC2_LEFT_HAND_ONLY_DEVICE_LAYOUT.id],
      ).toEqual(CC1_CC2_LEFT_HAND_ONLY_DEVICE_LAYOUT);
    });

    it('keeps layouts the user added', () => {
      const store = restartWith((s) => {
        s.entityMap['custom'] = {
          ...DEFAULT_DEVICE_LAYOUT,
          id: 'custom',
          name: 'mine',
        };
        s.ids.push('custom');
      });
      expect(store.entityMap()['custom'].name).toBe('mine');
    });

    it('loads the built-in layouts when nothing is selected in the saved data', () => {
      const store = restartWith((s) => {
        s.selectedId = null;
        s.ids = [];
        s.entityMap = {};
      });
      expect(store.ids().length).toBe(4);
      expect(store.selectedId()).toBe(DEFAULT_DEVICE_LAYOUT.id);
    });

    it('does not write over the saved layouts when a layout is edited in memory only', () => {
      const store = create();
      patchState(
        store,
        updateEntity({ id: 'default', changes: { name: 'temp' } }),
      );
      expect(store.entityMap()['default'].name).toBe('temp');
    });
  });
});
