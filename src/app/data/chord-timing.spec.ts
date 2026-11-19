import { CHORDING_TIMING } from './chord-timing';

describe('CHORDING_TIMING', () => {
  const entries = Object.entries(CHORDING_TIMING);

  it('has an animation for each device', () => {
    expect(Object.keys(CHORDING_TIMING)).toEqual(['cc1', 'cc2', 'm4g', 'ctd']);
  });

  it('has times that never go backwards, starting at 0', () => {
    for (const [name, events] of entries) {
      expect(events[0].t).withContext(name).toBe(0);
      events.forEach((e, i) => {
        if (i > 0) {
          expect(e.t)
            .withContext(`${name}[${i}]`)
            .toBeGreaterThanOrEqual(events[i - 1].t);
        }
      });
    }
  });

  it('types characters with + and clears them with -, one character per +', () => {
    for (const [name, events] of entries) {
      for (const e of events) {
        if (e.type === '+') {
          expect(e.c.length).withContext(name).toBe(1);
        } else {
          expect(e.type).toBe('-');
        }
      }
    }
  });

  it('never clears more characters than were typed', () => {
    for (const [name, events] of entries) {
      let typed = 0;
      for (const e of events) {
        typed += e.type === '+' ? 1 : -1;
        expect(typed).withContext(name).toBeGreaterThanOrEqual(0);
      }
    }
  });

  it('types the device name first, clears it, then types more text', () => {
    for (const [name, events] of entries) {
      const firstClear = events.findIndex((e) => e.type === '-');
      const typedName = events
        .slice(0, firstClear)
        .map((e) => (e.type === '+' ? e.c : ''))
        .join('');
      expect(typedName.toLowerCase()).withContext(name).toBe(name);
      const afterClear = events
        .slice(firstClear)
        .map((e) => (e.type === '+' ? e.c : ''))
        .join('');
      expect(afterClear.length).withContext(name).toBeGreaterThan(5);
    }
  });
});
