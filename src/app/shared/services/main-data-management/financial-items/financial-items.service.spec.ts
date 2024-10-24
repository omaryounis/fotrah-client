/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { FinancialItemsService } from './financial-items.service';

describe('Service: FinancialItems', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FinancialItemsService]
    });
  });

  it('should ...', inject([FinancialItemsService], (service: FinancialItemsService) => {
    expect(service).toBeTruthy();
  }));
});
