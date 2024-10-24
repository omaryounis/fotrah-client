/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { Vote_reasonsService } from './vote_reasons.service';

describe('Service: Vote_reasons', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Vote_reasonsService]
    });
  });

  it('should ...', inject([Vote_reasonsService], (service: Vote_reasonsService) => {
    expect(service).toBeTruthy();
  }));
});
