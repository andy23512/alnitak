import {
  ChangeDetectionStrategy,
  Component,
  computed,
  HostBinding,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { liveQuery } from 'dexie';
import { HighchartsChartModule } from 'highcharts-angular';
import * as Highcharts from 'highcharts/highstock';
import theme from 'highcharts/themes/high-contrast-dark';
import { Observable } from 'rxjs';
import { TOPICS } from 'src/app/data/topics';
import { db } from 'src/app/db';
import { KeyRecord } from 'src/app/models/key-record.models';
import { RealTitleCasePipe } from 'src/app/pipes/real-title-case.pipe';
import { toTitleCase } from 'src/app/utils/case.utils';
import { computedAsync } from 'src/app/utils/computed-async.utils';
theme(Highcharts);

enum Metric {
  CPM = 'CPM',
  Combo = 'Combo',
}

@Component({
  selector: 'app-statistics-page',
  standalone: true,
  imports: [
    HighchartsChartModule,
    MatButtonToggleModule,
    FormsModule,
    TranslatePipe,
    RealTitleCasePipe,
  ],
  templateUrl: './statistics-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatisticsPageComponent {
  @HostBinding('class') classes = 'flex flex-col gap-2 h-full';
  private translateService = inject(TranslateService);

  Highcharts: typeof Highcharts = Highcharts;
  Metric = Metric;
  currentMetric = signal(Metric.CPM);
  chartConstructor: string = 'stockChart';
  updateFlag = false;

  keyRecords = computedAsync(() => {
    return liveQuery(() => db.keyRecords.toArray()) as any as Observable<
      KeyRecord[]
    >;
  });
  chartOptions = computed<Highcharts.Options | null>(() => {
    const keyRecords = this.keyRecords();
    if (!keyRecords) {
      return null;
    }
    const currentMetric = this.currentMetric();
    switch (currentMetric) {
      case Metric.CPM:
        const cpmSeries: Highcharts.SeriesOptionsType[] = TOPICS.map((t) => ({
          type: 'line' as const,
          data: keyRecords
            .filter((k) => k.cpm && k.topicId === t.id)
            .map((k) => [k.timestamp, k.cpm]),
          name: this.translateService.instant(t.name),
          dataGrouping: {
            groupPixelWidth: 20,
          },
          marker: {
            enabled: true,
            radius: 5,
          },
        })).filter((s) => s.data.length > 0);
        const unit = this.translateService.instant(
          'general.character-entry-speed-unit',
        );
        return {
          legend: { enabled: true },
          scrollbar: { enabled: false },
          series: cpmSeries,
          time: {
            useUTC: false,
          },
          tooltip: {
            formatter: function () {
              return `${this.series.name}: ${this.y?.toFixed(1)} ` + unit;
            },
          },
          yAxis: {
            title: {
              text: unit,
            },
          },
          xAxis: {
            type: 'datetime',
            ordinal: false,
            breaks: undefined,
          },
        };
      case Metric.Combo:
        const comboSeries: Highcharts.SeriesOptionsType[] = TOPICS.map((t) => ({
          type: 'line' as const,
          data: keyRecords
            .filter((k) => k.combo && k.topicId === t.id)
            .map((k) => [k.timestamp, k.combo]),
          name: this.translateService.instant(t.name),
          dataGrouping: {
            groupPixelWidth: 20,
            approximation: function (this: {
              dataGroupInfo: { start: number; length: number };
              options: { data: [number, number][] };
            }): number {
              const start = this.dataGroupInfo.start;
              return Math.max(
                ...this.options.data
                  .slice(start, start + this.dataGroupInfo.length)
                  .map(([_, combo]) => combo),
              );
            },
          },
          marker: {
            enabled: true,
            radius: 5,
          },
        })).filter((s) => s.data.length > 0);
        const comboUnit = this.translateService.instant('general.combo-unit');
        const comboUnitPlural = this.translateService.instant(
          'general.combo-unit-plural',
        );
        return {
          legend: { enabled: true },
          scrollbar: { enabled: false },
          series: comboSeries,
          time: {
            useUTC: false,
          },
          tooltip: {
            formatter: function () {
              return (
                `${this.series.name}: ${Math.round(this.y as number)} ` +
                toTitleCase(
                  Math.round(this.y as number) === 1
                    ? comboUnit
                    : comboUnitPlural,
                )
              );
            },
          },
          yAxis: {
            title: {
              text: toTitleCase(comboUnit),
            },
          },
          xAxis: {
            type: 'datetime',
            ordinal: false,
            breaks: undefined,
          },
        };
      default:
        const _: never = currentMetric;
        throw new Error(`Unhandled metric case: ${currentMetric}`);
    }
  });
}
