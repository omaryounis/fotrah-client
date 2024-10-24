/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { RegionsService } from './regions.service';

describe('Service: Regions', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RegionsService]
    });
  });

  it('should ...', inject([RegionsService], (service: RegionsService) => {
    expect(service).toBeTruthy();
  }));
});
