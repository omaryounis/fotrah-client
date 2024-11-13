/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ObjectionService } from './objection.service';

describe('Service: Objections', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ObjectionService]
    });
  }); 

  it('should ...', inject([ObjectionService], (service: ObjectionService) => {
    expect(service).toBeTruthy();
  }));
});
