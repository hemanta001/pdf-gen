import {Component} from "@angular/core";
import {HttpClient} from "@angular/common/http";

declare var $: any;

@Component({
  selector: 'app-upload-convert',
  templateUrl: './pdf-download.component.html',
  styleUrls: ['./pdf-download.component.scss']
})


export class PdfDownloadComponent {
  processing=false;
  constructor(private http: HttpClient) {
  }

  downloadPdf() {
    this.processing=true;
    const organizationName = $("#bankName").val();
    const securedIdUserId = $("#securedId").val();
    location.href=`http://localhost:8080/downloadPdfOfSecuredIdUser/${organizationName}/${securedIdUserId}`
  }

}
