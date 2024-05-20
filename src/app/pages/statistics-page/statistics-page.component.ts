import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HighchartsChartModule } from 'highcharts-angular';
import * as Highcharts from 'highcharts/highstock';
import theme from 'highcharts/themes/high-contrast-dark';
theme(Highcharts);

@Component({
  selector: 'app-statistics-page',
  standalone: true,
  imports: [HighchartsChartModule],
  templateUrl: './statistics-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatisticsPageComponent {
  Highcharts: typeof Highcharts = Highcharts; // required
  chartConstructor: string = 'stockChart'; // optional string, defaults to 'chart'
  chartOptions: Highcharts.Options = {
    series: [{ type: 'line', data: [1, 2] }],
  }; // required
}
