import {
  fakeAsync,
  TestBed,
  tick,
  discardPeriodicTasks,
} from '@angular/core/testing';
import { db } from '../db';
import { KeyRecord } from '../models/key-record.models';
import { KeyRecordService } from './key-record.service';

const record = (n: number): KeyRecord => ({
  timestamp: n,
  topicId: 't',
  lessonId: 'l',
  targetKey: 'a',
  inputKey: 'a',
  isCorrect: true,
  intervalToPreviousCorrectKey: null,
  cpm: null,
  combo: n,
});

describe('KeyRecordService', () => {
  let service: KeyRecordService;
  let bulkAdd: jasmine.Spy;

  beforeEach(() => {
    bulkAdd = spyOn(db.keyRecords, 'bulkAdd').and.resolveTo(0 as never);
    TestBed.resetTestingModule();
  });

  /** bufferTime's timer must be created inside fakeAsync, so build the service lazily. */
  function createService() {
    service = TestBed.inject(KeyRecordService);
  }

  it('does not write a record right away', fakeAsync(() => {
    createService();
    service.pushIntoQueue(record(1));
    tick(1999);
    expect(bulkAdd).not.toHaveBeenCalledWith([record(1)]);
    discardPeriodicTasks();
  }));

  it('writes the records collected in a 2 second window in one batch', fakeAsync(() => {
    createService();
    service.pushIntoQueue(record(1));
    tick(500);
    service.pushIntoQueue(record(2));
    tick(1500);
    expect(bulkAdd).toHaveBeenCalledWith([record(1), record(2)]);
    discardPeriodicTasks();
  }));

  it('starts a new batch for records that arrive after the window closed', fakeAsync(() => {
    createService();
    service.pushIntoQueue(record(1));
    tick(2000);
    service.pushIntoQueue(record(2));
    tick(2000);
    expect(bulkAdd.calls.allArgs()).toEqual([[[record(1)]], [[record(2)]]]);
    discardPeriodicTasks();
  }));

  it('keeps the order of the records', fakeAsync(() => {
    createService();
    [3, 1, 2].forEach((n) => service.pushIntoQueue(record(n)));
    tick(2000);
    expect(
      bulkAdd.calls.mostRecent().args[0].map((r: KeyRecord) => r.timestamp),
    ).toEqual([3, 1, 2]);
    discardPeriodicTasks();
  }));
});
