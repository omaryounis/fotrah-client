/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { EconomicClassificationsService } from './economic-classifications.service';

describe('Service: EconomicClassifications', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EconomicClassificationsService]
    });
  });

  it('should ...', inject([EconomicClassificationsService], (service: EconomicClassificationsService) => {
    expect(service).toBeTruthy();
  }));
});
