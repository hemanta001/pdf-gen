import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {FormGroup} from "@angular/forms";

@Injectable({
  providedIn: 'root'
})
export class PdfDownloadService {

  constructor(private http: HttpClient) { }

  downloadPdf(downloadForm: FormGroup){
    return this.http.post("http://localhost:8080/downloadPdfOfSecuredIdUser", downloadForm);
  }
}
