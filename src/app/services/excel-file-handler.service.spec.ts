import { TestBed } from '@angular/core/testing';

import { ExcelFileHandlerService } from './excel-file-handler.service';

describe('ExcelFileHandlerService', () => {
  let service: ExcelFileHandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExcelFileHandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
