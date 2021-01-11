import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {PdfDownloadComponent} from "./pdf-download.component";


describe('UploadConvertComponent', () => {
  let component: PdfDownloadComponent;
  let fixture: ComponentFixture<PdfDownloadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PdfDownloadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PdfDownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
