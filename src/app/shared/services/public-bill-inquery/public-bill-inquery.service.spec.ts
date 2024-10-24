import { TestBed } from '@angular/core/testing';

import { PublicBillInqueryService } from './public-bill-inquery.service';

describe('PublicBillInqueryService', () => {
  let service: PublicBillInqueryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PublicBillInqueryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
