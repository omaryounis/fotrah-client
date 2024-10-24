/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PermitTypesService } from './permit-types.service';

describe('Service: PermitTypes', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PermitTypesService]
    });
  });

  it('should ...', inject([PermitTypesService], (service: PermitTypesService) => {
    expect(service).toBeTruthy();
  }));
});
