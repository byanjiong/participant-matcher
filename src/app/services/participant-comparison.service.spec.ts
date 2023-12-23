import { TestBed } from '@angular/core/testing';

import { ParticipantComparisonService } from './participant-comparison.service';

describe('ParticipantComparisonService', () => {
  let service: ParticipantComparisonService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParticipantComparisonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
