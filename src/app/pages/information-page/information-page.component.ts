import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { IconGuardPipe } from 'src/app/pipes/icon-guard.pipe';
import { RealTitleCasePipe } from 'src/app/pipes/real-title-case.pipe';

@Component({
  selector: 'app-information-page',
  standalone: true,
  imports: [
    RouterLink,
    MatIcon,
    IconGuardPipe,
    TranslatePipe,
    RealTitleCasePipe,
  ],
  templateUrl: './information-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InformationPageComponent {
  @HostBinding('class') classes = 'block p-5';
}
