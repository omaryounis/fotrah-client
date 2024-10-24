/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ClassificationLevelsService } from './classification-levels.service';

describe('Service: ClassificationLevels', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ClassificationLevelsService]
    });
  });

  it('should ...', inject([ClassificationLevelsService], (service: ClassificationLevelsService) => {
    expect(service).toBeTruthy();
  }));
});
