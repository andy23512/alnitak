import { TestBed } from '@angular/core/testing';

import { OperatingSystemService } from './operating-system.service';

describe('OperatingSystemService', () => {
  let service: OperatingSystemService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OperatingSystemService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
