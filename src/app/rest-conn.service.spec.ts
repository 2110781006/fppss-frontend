import { TestBed } from '@angular/core/testing';

import { RestConnService } from './rest-conn.service';

describe('RestConnService', () => {
  let service: RestConnService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RestConnService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
