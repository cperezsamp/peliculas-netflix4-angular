import { TestBed } from '@angular/core/testing';

import { ActoresService } from './actores.service';

describe('ActoresService', () => {
  let service: ActoresService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActoresService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
