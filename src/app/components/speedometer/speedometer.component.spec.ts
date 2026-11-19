import {
  ComponentFixture,
  discardPeriodicTasks,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { temperatureToColor } from 'src/app/utils/color.utils';
import { SpeedometerComponent } from './speedometer.component';

// The component moves the displayed speed towards the real speed by at most 2
// per frame, at 10 frames per second, and draws 45 sectors.
const FRAME_MS = 100;

describe('SpeedometerComponent', () => {
  let fixture: ComponentFixture<SpeedometerComponent>;
  let component: SpeedometerComponent;

  function create(speed: number, maxSpeed = 45) {
    fixture = TestBed.createComponent(SpeedometerComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('speed', speed);
    fixture.componentRef.setInput('speedUnit', 'CPM');
    fixture.componentRef.setInput('maxSpeed', maxSpeed);
    fixture.detectChanges();
  }

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [SpeedometerComponent] });
  });

  it('should create', fakeAsync(() => {
    create(0);
    expect(component).toBeTruthy();
    discardPeriodicTasks();
  }));

  it('draws 45 sectors and shows the unit', fakeAsync(() => {
    create(0);
    expect(fixture.nativeElement.querySelectorAll('svg path').length).toBe(45);
    expect(fixture.nativeElement.textContent).toContain('CPM');
    discardPeriodicTasks();
  }));

  // Current behavior, probably a leak: the interval is never unsubscribed
  // (chara stops it with takeUntilDestroyed), so it keeps ticking after destroy.
  it('keeps its timer running after it is destroyed', fakeAsync(() => {
    create(30);
    tick(FRAME_MS);
    expect(component.displaySpeed()).toBe(2);
    fixture.destroy();
    tick(FRAME_MS * 5);
    expect(component.displaySpeed()).toBe(12);
    discardPeriodicTasks();
  }));

  describe('displayed speed', () => {
    it('starts at 0', fakeAsync(() => {
      create(30);
      expect(component.displaySpeed()).toBe(0);
      discardPeriodicTasks();
    }));

    it('moves towards the speed by at most 2 per frame', fakeAsync(() => {
      create(30);
      tick(FRAME_MS);
      expect(component.displaySpeed()).toBe(2);
      tick(FRAME_MS * 2);
      expect(component.displaySpeed()).toBe(6);
      discardPeriodicTasks();
    }));

    it('does not overshoot the speed', fakeAsync(() => {
      create(3);
      tick(FRAME_MS * 2);
      expect(component.displaySpeed()).toBe(3);
      tick(FRAME_MS * 5);
      expect(component.displaySpeed()).toBe(3);
      discardPeriodicTasks();
    }));

    it('moves down again when the speed drops', fakeAsync(() => {
      create(10);
      tick(FRAME_MS * 10);
      expect(component.displaySpeed()).toBe(10);
      fixture.componentRef.setInput('speed', 4);
      tick(FRAME_MS);
      expect(component.displaySpeed()).toBe(8);
      tick(FRAME_MS * 5);
      expect(component.displaySpeed()).toBe(4);
      discardPeriodicTasks();
    }));
  });

  describe('sector opacity', () => {
    it('shows no sector while the display speed is 0', fakeAsync(() => {
      create(30);
      expect(component.opacity(0)).toBe(0);
      discardPeriodicTasks();
    }));

    it('shows the sectors that the display speed has passed', fakeAsync(() => {
      create(30); // maxSpeed 45 -> one sector per unit of speed
      tick(FRAME_MS); // display speed 2
      expect(component.opacity(0)).toBe(1);
      expect(component.opacity(1)).toBe(0); // 2 / 45 is not more than 2 / 45
      expect(component.opacity(2)).toBe(0);
      tick(FRAME_MS); // display speed 4
      expect(component.opacity(2)).toBe(1);
      expect(component.opacity(4)).toBe(0);
      discardPeriodicTasks();
    }));

    it('scales with the maximum speed', fakeAsync(() => {
      create(10, 90); // two units of speed per sector
      tick(FRAME_MS * 3); // display speed 6
      expect(component.opacity(1)).toBe(1); // 6/90 > 2/45
      expect(component.opacity(3)).toBe(0); // 6/90 is not more than 4/45
      discardPeriodicTasks();
      // with maxSpeed 45 the same display speed lights more sectors
      create(10, 45);
      tick(FRAME_MS * 3);
      expect(component.opacity(3)).toBe(1); // 6/45 > 4/45
      discardPeriodicTasks();
    }));
  });

  describe('colors', () => {
    it('colors each sector by the speed it stands for, from cold to hot', fakeAsync(() => {
      create(0);
      const first = component.fill(0);
      const last = component.fill(44);
      expect(first).toEqual(jasmine.any(String));
      expect(last).toEqual(jasmine.any(String));
      expect(first).not.toBe(last);
      discardPeriodicTasks();
    }));

    it('uses the color temperature scaled over 20000K for sector index', fakeAsync(() => {
      create(0, 45);
      [0, 10, 44].forEach((i) =>
        expect(component.fill(i)).toBe(temperatureToColor((20000 / 45) * i)),
      );
      discardPeriodicTasks();
    }));

    it('colors the whole meter by the display speed', fakeAsync(() => {
      create(45);
      const cold = component.color;
      tick(FRAME_MS * 30);
      expect(component.displaySpeed()).toBe(45);
      expect(component.color).not.toBe(cold);
      // display speed 45 of max 45 is the full 20000K
      expect(component.color).toBe(temperatureToColor(20000));
      discardPeriodicTasks();
    }));
  });

  describe('sector shape', () => {
    it('draws a closed arc path', fakeAsync(() => {
      create(0);
      const d = component.d({ degFrom: 0, degTo: 1 }).trim();
      expect(d.startsWith('M ')).toBe(true);
      expect(d.endsWith('Z')).toBe(true);
      expect((d.match(/\bA\b/g) ?? []).length).toBe(2);
      discardPeriodicTasks();
    }));
  });
});
