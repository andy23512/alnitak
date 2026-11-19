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

  it('gives the name that the user agent parser finds', () => {
    (service as unknown as { uaParser: unknown }).uaParser = {
      getOS: () => ({ name: 'Windows' }),
    };
    expect(service.getOS()).toBe('Windows');
  });

  it('gives undefined when the user agent parser finds nothing', () => {
    (service as unknown as { uaParser: unknown }).uaParser = {
      getOS: () => ({ name: undefined }),
    };
    expect(service.getOS()).toBeUndefined();
  });

  it('knows the system this test is running on', () => {
    expect(service.getOS()).toEqual(jasmine.any(String));
  });
});
