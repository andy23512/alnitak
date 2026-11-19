import { TestBed } from '@angular/core/testing';
import {
  CHARACHORDER_3D_INPUT_DEVICE_PORTS,
  SerialPortHandler,
} from 'tangent-cc-lib';
import { SerialPortHandlerService } from './serial-port-handler.service';

describe('SerialPortHandlerService', () => {
  let service: SerialPortHandlerService;
  const field = (name: string) =>
    (service as unknown as Record<string, unknown>)[name];

  beforeEach(() => {
    TestBed.resetTestingModule();
    service = TestBed.inject(SerialPortHandlerService);
  });

  it('is a serial port handler', () => {
    expect(service).toBeInstanceOf(SerialPortHandler);
  });

  it('is shared by everyone that injects it', () => {
    expect(TestBed.inject(SerialPortHandlerService)).toBe(service);
  });

  it('is set up with the CharaChorder 3D input device ports', () => {
    expect(Object.values(service)).toContain(
      CHARACHORDER_3D_INPUT_DEVICE_PORTS,
    );
  });

  it('does not run in a fake (test) mode', () => {
    expect(Object.values(service)).not.toContain(true);
    expect(Object.keys(service).length).toBeGreaterThan(0);
    expect(field('isTest') ?? false).toBeFalse();
  });
});
