import { Injectable } from '@angular/core';
import { Subject, bufferTime } from 'rxjs';
import { db } from '../db';
import { KeyRecord } from '../models/key-record.models';

@Injectable({
  providedIn: 'root',
})
export class KeyRecordService {
  private queueSubject = new Subject<KeyRecord>();

  constructor() {
    this.queueSubject
      .asObservable()
      .pipe(bufferTime(2000))
      .subscribe((keyRecords) => {
        db.keyRecords.bulkAdd(keyRecords);
      });
  }

  public pushIntoQueue(keyRecord: KeyRecord) {
    this.queueSubject.next(keyRecord);
  }
}
