import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { RealTitleCasePipe } from 'src/app/pipes/real-title-case.pipe';
import { SerialLogItemType } from '../../models/serial-log.model';
import { IconGuardPipe } from '../../pipes/icon-guard.pipe';
import { SerialLogStore } from '../../stores/serial-log.store';

@Component({
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    IconGuardPipe,
    TranslatePipe,
    RealTitleCasePipe,
  ],
  selector: 'app-serial-log-dialog',
  templateUrl: './serial-log-dialog.component.html',
  standalone: true,
})
export class SerialLogDialogComponent {
  private readonly serialLogStore = inject(SerialLogStore);
  public serialLogItems = this.serialLogStore.items;

  public SerialLogItemType = SerialLogItemType;
}
