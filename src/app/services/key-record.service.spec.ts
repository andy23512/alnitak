import { TestBed } from '@angular/core/testing';

import { KeyRecordService } from './key-record.service';

describe('KeyRecordService', () => {
  let service: KeyRecordService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KeyRecordService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
