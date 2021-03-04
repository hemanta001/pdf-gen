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
  isDocumentTypeSelected = false;
  idType = "Secured ID";
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
      "userId": ["", Validators.required]
    });
  }

  downloadPdf() {
    this.processing = true;
    this.hasFormErrors = false;
    this.checkFormErrors();
    if(!this.hasFormErrors){
      this.pdfDownloadService.downloadPdf(this.pdfDownloadForm.value).subscribe(data => {
        window.location.href = data["fileName"];
        this.processing = false;
      },error => {
        if(error["status"] == 404){
          alert(error["error"]);
          this.processing = false;
        }
      });
    }else{
      alert("Please fill up the form properly!")
      this.processing = false;
    }
  }

  checkFormErrors(){
    Object.values(this.pdfDownloadForm.controls).forEach(value=> {
      if(value.errors){
        this.hasFormErrors = true;
      }
    });
  }

  onDocumentTypeChange(){
    var documentType = this.pdfDownloadForm.value.documentType;
    switch (documentType) {
      case "KYC":
        this.isDocumentTypeSelected = true;
        this.idType = "Secured ID";
        break;

      case "IDCARD":
        this.isDocumentTypeSelected = true;
        this.idType = "Card ID";
        break;

      default:
        this.isDocumentTypeSelected = false;
        break;
    }

  }

  // preview(){
  //   this.checkFormErrors()
  // }

}
