import {Component} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {OrganizationService} from "../organization/service/organization.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {PdfDownloadService} from "./service/pdf-download.service";

@Component({
  selector: 'app-upload-convert',
  templateUrl: './pdf-download.component.html',
  styleUrls: ['./pdf-download.component.scss']
})

export class PdfDownloadComponent {

  private hasFormErrors = false;
  pdfDownloadForm: FormGroup;
  processing = false;
  organizationFields: { id: number, name: string, selected: boolean }[];
  // previewPdfSource = ""

  constructor(private http: HttpClient, private organizationService: OrganizationService, private pdfDownloadService: PdfDownloadService,
              private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.buildPdfDownloadForm();
    this.organizationService.getOrganizations().subscribe(data => {
        data["selected"] = false;
        this.organizationFields = data;
      }
    );
  }

  buildPdfDownloadForm() {
    this.pdfDownloadForm = this.formBuilder.group({
      "organizationId": ["", Validators.required],
      "documentType": ["", Validators.required],
      "securedUserId": ["", Validators.required]
    });
  }

  downloadPdf() {
    this.checkFormErrors();
    if(!this.hasFormErrors){
      this.processing = true;
      this.pdfDownloadService.downloadPdf(this.pdfDownloadForm.value).subscribe(data => {
        window.location.reload();
      },error => {
        if(error["status"] == 404){
          alert(error["error"]);
          window.location.reload();
        }
      });
    }else{
      alert("Please fill up the form properly!")
    }
  }

  checkFormErrors(){
    Object.values(this.pdfDownloadForm.controls).forEach(key=> {
      if(key.errors){
        this.hasFormErrors = true;
      }
    });
  }

  // preview(){
  //   this.checkFormErrors()
  // }

}
