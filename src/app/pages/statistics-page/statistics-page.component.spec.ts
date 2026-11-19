import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { TOPICS } from 'src/app/data/topics';
import { db } from 'src/app/db';
import { KeyRecord } from 'src/app/models/key-record.models';
import { StatisticsPageComponent } from './statistics-page.component';

const record = (
  topicId: string,
  timestamp: number,
  cpm: number | null,
  combo: number,
): KeyRecord => ({
  timestamp,
  topicId,
  lessonId: 'l',
  targetKey: 'a',
  inputKey: 'a',
  isCorrect: true,
  intervalToPreviousCorrectKey: null,
  cpm,
  combo,
});

describe('StatisticsPageComponent', () => {
  let fixture: ComponentFixture<StatisticsPageComponent>;
  let component: StatisticsPageComponent;

  async function settle() {
    for (let i = 0; i < 3; i++) {
      await new Promise((r) => setTimeout(r, 20));
      fixture.detectChanges();
    }
  }
  async function create(records: KeyRecord[] = []) {
    await db.keyRecords.clear();
    await db.keyRecords.bulkAdd(records);
    fixture = TestBed.createComponent(StatisticsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await settle();
  }
  const el = () => fixture.nativeElement as HTMLElement;
  const options = () => component.chartOptions()!;
  const series = () =>
    options().series as { name: string; data: [number, number][] }[];

  beforeEach(() => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({ providers: [provideTranslateService()] });
  });

  afterEach(() => db.keyRecords.clear());

  it('is a full height column', async () => {
    await create();
    expect(el().classList).toContain('flex');
    expect(el().classList).toContain('flex-col');
    expect(el().classList).toContain('h-full');
  });

  describe('metric toggle', () => {
    it('has a speed and a combo choice, and starts with the speed', async () => {
      await create();
      expect(component.currentMetric()).toBe('CPM');
      const toggles = Array.from(el().querySelectorAll('mat-button-toggle'));
      expect(toggles.map((t) => t.textContent?.trim().toLowerCase())).toEqual([
        'general.character-entry-speed-unit',
        'general.combo-unit',
      ]);
      expect(
        toggles.map((t) => t.classList.contains('mat-button-toggle-checked')),
      ).toEqual([true, false]);
      expect(el().textContent?.toLowerCase()).toContain(
        'statistics-page.metric',
      );
    });

    it('switches the metric when the other choice is clicked', async () => {
      await create();
      (
        el().querySelectorAll(
          'mat-button-toggle button',
        )[1] as HTMLButtonElement
      ).click();
      fixture.detectChanges();
      expect(component.currentMetric()).toBe('Combo');
    });
  });

  describe('while the records are loading', () => {
    it('has no chart options and shows no chart', async () => {
      fixture = TestBed.createComponent(StatisticsPageComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      expect(component.chartOptions()).toBeNull();
      expect(el().querySelector('highcharts-chart')).toBeNull();
      await settle();
      expect(el().querySelector('highcharts-chart')).not.toBeNull();
    });
  });

  describe('without records', () => {
    it('has no series, but still shows a chart', async () => {
      await create();
      expect(series()).toEqual([]);
      expect(el().querySelector('highcharts-chart')).not.toBeNull();
    });
  });

  describe('speed chart', () => {
    const records = [
      record('number', 1000, 300, 1),
      record('number', 2000, 400, 2),
      record('letter', 3000, 250, 3),
      record('letter', 4000, null, 4),
      record('letter', 5000, 0, 5),
    ];
    beforeEach(() => create(records));

    it('has one line per topic that has speeds, named after the topic', () => {
      expect(series().map((s) => s.name)).toEqual([
        'topic.numbers',
        'topic.letters',
      ]);
      expect(
        series().every((s) => (s as { type?: string }).type === 'line'),
      ).toBeTrue();
    });

    it('has timestamp and speed pairs, without records that have no speed', () => {
      expect(series()[0].data).toEqual([
        [1000, 300],
        [2000, 400],
      ]);
      expect(series()[1].data).toEqual([[3000, 250]]);
    });

    it('leaves out topics without data', async () => {
      await create([record('symbol', 1, 100, 1)]);
      expect(series().map((s) => s.name)).toEqual(['topic.symbols']);
    });

    it('labels the axis with the unit and shows the time in local time', () => {
      expect((options().yAxis as { title: { text: string } }).title.text).toBe(
        'general.character-entry-speed-unit',
      );
      expect(options().time).toEqual({ useUTC: false });
      expect((options().xAxis as { type: string }).type).toBe('datetime');
    });

    it('groups points in 20 pixel wide ranges', () => {
      expect(
        (
          series()[0] as unknown as {
            dataGrouping: { groupPixelWidth: number };
          }
        ).dataGrouping.groupPixelWidth,
      ).toBe(20);
    });

    it('formats the tooltip with one decimal and the unit', () => {
      const text = (options().tooltip!.formatter as Function).call({
        series: { name: 'topic.numbers' },
        y: 312.345,
      });
      expect(text).toBe(
        'topic.numbers: 312.3 general.character-entry-speed-unit',
      );
    });
  });

  describe('combo chart', () => {
    const records = [
      record('number', 1000, 300, 5),
      record('number', 2000, 400, 0),
      record('letter', 3000, 250, 7),
    ];
    beforeEach(async () => {
      await create(records);
      component.currentMetric.set('Combo' as never);
    });

    it('has one line per topic with combos, leaving out records without a combo', () => {
      expect(series().map((s) => s.name)).toEqual([
        'topic.numbers',
        'topic.letters',
      ]);
      expect(series()[0].data).toEqual([[1000, 5]]);
      expect(series()[1].data).toEqual([[3000, 7]]);
    });

    it('groups points in 20 pixel wide ranges and shows local time', () => {
      expect(
        (
          series()[0] as unknown as {
            dataGrouping: { groupPixelWidth: number };
          }
        ).dataGrouping.groupPixelWidth,
      ).toBe(20);
      expect(options().time).toEqual({ useUTC: false });
    });

    it('labels the axis with the title-cased unit', () => {
      expect((options().yAxis as { title: { text: string } }).title.text).toBe(
        'General.combo-unit',
      );
    });

    it('uses the singular unit for 1 and the plural for the rest in the tooltip', () => {
      const f = options().tooltip!.formatter as Function;
      const at = (y: number) => f.call({ series: { name: 'n' }, y });
      expect(at(1)).toBe('n: 1 General.combo-unit');
      expect(at(2)).toBe('n: 2 General.combo-unit-plural');
      expect(at(1.4)).toBe('n: 1 General.combo-unit');
      expect(at(1.6)).toBe('n: 2 General.combo-unit-plural');
    });

    it('groups the points of a pixel range by their highest combo', () => {
      const approximation = (
        series()[0] as unknown as {
          dataGrouping: {
            approximation: (this: unknown) => number;
          };
        }
      ).dataGrouping.approximation;
      const result = approximation.call({
        dataGroupInfo: { start: 1, length: 3 },
        options: {
          data: [
            [0, 9],
            [1, 2],
            [2, 6],
            [3, 4],
            [4, 8],
          ],
        },
      });
      expect(result).toBe(6);
    });

    it('uses the same topic order as the lessons', () => {
      expect(TOPICS.map((t) => t.name)).toEqual([
        'topic.numbers',
        'topic.letters',
        'topic.symbols',
      ]);
    });
  });

  it('follows new records while the page is open', async () => {
    await create([record('number', 1, 100, 1)]);
    expect(series()[0].data.length).toBe(1);
    await db.keyRecords.add(record('number', 2, 200, 2));
    await settle();
    expect(series()[0].data.length).toBe(2);
  });
});
