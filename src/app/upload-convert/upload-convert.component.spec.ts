import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadConvertComponent } from './upload-convert.component';

describe('UploadConvertComponent', () => {
  let component: UploadConvertComponent;
  let fixture: ComponentFixture<UploadConvertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadConvertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadConvertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
