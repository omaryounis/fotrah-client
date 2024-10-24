/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { FinancialsPermitsService } from './financials-permits.service';

describe('Service: FinancialsPermits', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FinancialsPermitsService]
    });
  });

  it('should ...', inject([FinancialsPermitsService], (service: FinancialsPermitsService) => {
    expect(service).toBeTruthy();
  }));
});
