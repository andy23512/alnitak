import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-information-page',
  standalone: true,
  imports: [RouterLink, MatIcon],
  templateUrl: './information-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InformationPageComponent {
  @HostBinding('class') classes = 'block p-5';
}
