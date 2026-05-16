import { KeyValuePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { patchState } from '@ngrx/signals';
import { addEntities } from '@ngrx/signals/entities';
import { TranslatePipe } from '@ngx-translate/core';
import { RealTitleCasePipe } from 'src/app/pipes/real-title-case.pipe';
import { DeviceLayoutStore } from 'src/app/stores/device-layout.store';
import { dateToString } from 'src/app/utils/date.utils';
import { DeviceLayout, Profile } from 'tangent-cc-lib';

@Component({
  selector: 'app-device-layout-import-dialog',
  templateUrl: 'device-layout-import-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    TranslatePipe,
    RealTitleCasePipe,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    KeyValuePipe,
  ],
})
export class DeviceLayoutImportDialogComponent implements OnInit {
  data: {
    device: string;
    date: Date;
    layoutMap: Partial<Record<Profile, DeviceLayout['layout']>>;
  } = inject(MAT_DIALOG_DATA);

  matDialogRef = inject(MatDialogRef);
  deviceLayoutStore = inject(DeviceLayoutStore);
  formBuilder = inject(FormBuilder);

  form!: FormGroup;

  public ngOnInit() {
    const formConfig = Object.fromEntries(
      Object.keys(this.data.layoutMap).map((profile) => [
        profile,
        `${this.data.device}_${profile}_${dateToString(this.data.date)}`,
      ]),
    );
    this.form = this.formBuilder.group(formConfig);
  }

  public onSubmit() {
    if (this.form.valid) {
      const entities = (
        Object.entries(this.form.value) as [Profile, string][]
      ).map(([profile, name]) => ({
        id: name + '-' + Date.now(),
        name,
        layout: this.data.layoutMap[profile] as DeviceLayout['layout'],
        profile: profile,
      })) as DeviceLayout[];
      patchState(this.deviceLayoutStore, addEntities(entities));
      this.deviceLayoutStore.setSelectedId(entities[0].id);
      this.matDialogRef.close();
    }
  }
}
