/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { MunicipalsService } from './municipals.service';

describe('Service: Municipals', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MunicipalsService]
    });
  });

  it('should ...', inject([MunicipalsService], (service: MunicipalsService) => {
    expect(service).toBeTruthy();
  }));
});
