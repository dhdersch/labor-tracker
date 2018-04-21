import { TestBed, inject } from '@angular/core/testing';

import { PartogramService } from './partogram.service';

describe('PartogramService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PartogramService]
    });
  });

  it('should be created', inject([PartogramService], (service: PartogramService) => {
    expect(service).toBeTruthy();
  }));
});
