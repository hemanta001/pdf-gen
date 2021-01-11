import { TestBed } from '@angular/core/testing';

import { UploadConvertService } from './upload-convert.service';

describe('UploadConvertService', () => {
  let service: UploadConvertService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UploadConvertService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
