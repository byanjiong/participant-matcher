import { TestBed } from '@angular/core/testing';

import { ParticipantMapService } from './participant-map.service';

describe('ParticipantMapService', () => {
  let service: ParticipantMapService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParticipantMapService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
