import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import {
  ProgressSnackBarComponent,
  ProgressSnackBarData,
} from './progress-snack-bar.component';

describe('ProgressSnackBarComponent', () => {
  let fixture: ComponentFixture<ProgressSnackBarComponent>;
  let component: ProgressSnackBarComponent;

  const el = () => fixture.nativeElement as HTMLElement;
  const bar = () => el().querySelector('mat-progress-bar') as HTMLElement;
  async function create(data: ProgressSnackBarData) {
    await TestBed.configureTestingModule({
      imports: [ProgressSnackBarComponent],
      providers: [{ provide: MAT_SNACK_BAR_DATA, useValue: data }],
    }).compileComponents();
    fixture = TestBed.createComponent(ProgressSnackBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  it('shows the message and a determinate bar at the given progress', async () => {
    await create({ message: 'Loading', progress: 30 });
    expect(el().textContent).toContain('Loading');
    expect(bar().getAttribute('aria-valuenow')).toBe('30');
    expect(bar().getAttribute('mode')).toBe('determinate');
  });

  it('updateProgress changes the bar value even though it is OnPush', async () => {
    await create({ message: 'Loading', progress: 10 });
    component.updateProgress(75);
    fixture.detectChanges();
    expect(component.data.progress).toBe(75);
    expect(bar().getAttribute('aria-valuenow')).toBe('75');
  });
});
