import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
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
import { addEntity } from '@ngrx/signals/entities';
import { TranslatePipe } from '@ngx-translate/core';
import { RealTitleCasePipe } from 'src/app/pipes/real-title-case.pipe';
import { DeviceLayoutStore } from 'src/app/stores/device-layout.store';

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
  ],
})
export class DeviceLayoutImportDialogComponent {
  data: { fileName: string; layout: any } = inject(MAT_DIALOG_DATA);

  matDialogRef = inject(MatDialogRef);
  deviceLayoutStore = inject(DeviceLayoutStore);
  formBuilder = inject(FormBuilder);

  form!: FormGroup;

  public ngOnInit() {
    this.form = this.formBuilder.group({
      name: [this.data.fileName, [Validators.required]],
    });
  }

  public onSubmit() {
    if (this.form.valid) {
      const id = this.data.fileName + '-' + Date.now();
      patchState(
        this.deviceLayoutStore,
        addEntity({
          id,
          name: this.form.value.name,
          layout: this.data.layout,
        }),
      );
      this.deviceLayoutStore.setSelectedId(id);
      this.matDialogRef.close();
    }
  }
}
