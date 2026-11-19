import { TestBed } from '@angular/core/testing';
import { SerialHandler } from 'tangent-cc-lib';
import { SerialLogItemType } from '../models/serial-log.model';
import { SerialLogStore } from '../stores/serial-log.store';
import { SerialHandlerService } from './serial-handler.service';
import { SerialPortHandlerService } from './serial-port-handler.service';

describe('SerialHandlerService', () => {
  let service: SerialHandlerService;
  let store: InstanceType<typeof SerialLogStore>;

  beforeEach(() => {
    TestBed.resetTestingModule();
    service = TestBed.inject(SerialHandlerService);
    store = TestBed.inject(SerialLogStore);
  });

  const items = () => store.items().map((i) => [i.type, i.data]);

  it('is a serial handler that works through the port handler service', () => {
    expect(service).toBeInstanceOf(SerialHandler);
    expect(TestBed.inject(SerialPortHandlerService)).toBe(
      (service as unknown as { serialPortHandler: SerialPortHandlerService })
        .serialPortHandler,
    );
  });

  it('starts with an empty log', () => {
    expect(store.items().length).toBe(0);
  });

  it('logs data that is sent', () => {
    service.emit('sendSerialData', 'VERSION');
    expect(items()).toEqual([[SerialLogItemType.Send, 'VERSION']]);
  });

  it('logs data that is received', () => {
    service.emit('receiveSerialData', 'VERSION CC1 1.0');
    expect(items()).toEqual([[SerialLogItemType.Receive, 'VERSION CC1 1.0']]);
  });

  it('keeps the order of what happened', () => {
    service.emit('sendSerialData', 'a');
    service.emit('receiveSerialData', 'b');
    service.emit('sendSerialData', 'c');
    expect(items()).toEqual([
      [SerialLogItemType.Send, 'a'],
      [SerialLogItemType.Receive, 'b'],
      [SerialLogItemType.Send, 'c'],
    ]);
  });

  it('logs each event once', () => {
    service.emit('sendSerialData', 'x');
    expect(store.items().length).toBe(1);
  });

  it('is shared by everyone that injects it', () => {
    expect(TestBed.inject(SerialHandlerService)).toBe(service);
  });
});
