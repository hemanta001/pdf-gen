/**
 * Created by vadimdez on 21/06/16.
 */
import {Component, ViewChild} from '@angular/core';
import jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import {
  PDFProgressData,
  PDFDocumentProxy,
  PDFSource
} from './pdf-viewer/pdf-viewer.module';

import {PdfViewerComponent} from './pdf-viewer/pdf-viewer.component';
import {HttpClient} from "@angular/common/http";

@Component({
  moduleId: module.id,
  selector: 'pdf-viewer-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  pdfSrc: string | PDFSource | ArrayBuffer = './assets/abc.pdf';

  // or pass options as object
  // pdfSrc: any = {
  //   url: './assets/pdf-test.pdf',
  //   withCredentials: true,
  //// httpHeaders: { // cross domain
  ////   'Access-Control-Allow-Credentials': true
  //// }
  // };

  error: any;
  page = 1;
  rotation = 0;
  zoom = 1.0;
  zoomScale = 'page-width';
  originalSize = false;
  pdf: any;
  renderText = true;
  progressData: PDFProgressData;
  isLoaded = false;
  stickToPage = false;
  showAll = true;
  autoresize = true;
  fitToPage = false;
  outline: any[];
  isOutlineShown = false;
  pdfQuery = '';

  @ViewChild(PdfViewerComponent)
  private pdfComponent: PdfViewerComponent;

  constructor(private http: HttpClient) {
  }

  // Load pdf
  loadPdf(event,filePath) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', './assets/abc.pdf', true);
    xhr.responseType = 'blob';

    xhr.onload = (e: any) => {
      console.log(xhr);
      if (xhr.status === 200) {
        const blob = new Blob([xhr.response], {type: 'application/pdf'});
        this.pdfSrc = URL.createObjectURL(blob);
        const windowX = (document.getElementsByClassName('textLayer')[0]['offsetWidth']);
        const windowY = (document.getElementsByClassName('textLayer')[0]['offsetHeight']);
        let imageX = (event.layerX);
        let imageY = (event.layerY);
        const xcoordinate = imageX / windowX;
        const ycoordinate = imageY / windowY;
        console.log('x = ' + xcoordinate, 'y = ' + ycoordinate);
        console.log(event);
        // this.loadPdf();
        const formdata: FormData = new FormData();

        formdata.append('file', blob);

        this.http.post('http://localhost:8080/secured/pdf/update/' + xcoordinate + '/' + ycoordinate, formdata).subscribe(data => {
          console.log("yesssssssssssssss");
        });
      }
    };

    xhr.send();
  }

  /**
   * Set custom path to pdf worker
   */
  setCustomWorkerPath() {
    (window as any).pdfWorkerSrc = '/lib/pdfjs-dist/build/pdf.worker.js';
  }

  incrementPage(amount: number) {
    this.page += amount;
  }

  incrementZoom(amount: number) {
    this.zoom += amount;
  }

  rotate(angle: number) {
    this.rotation += angle;
  }

  /**
   * Render PDF preview on selecting file
   */
  onFileSelected() {
    const $pdf: any = document.querySelector('#file');

    if (typeof FileReader !== 'undefined') {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        this.pdfSrc = e.target.result;
      };

      reader.readAsArrayBuffer($pdf.files[0]);
    }
  }

  /**
   * Get pdf information after it's loaded
   * @param pdf pdf document proxy
   */
  afterLoadComplete(pdf: PDFDocumentProxy) {
    this.pdf = pdf;

    this.loadOutline();
  }

  /**
   * Get outline
   */
  loadOutline() {
    this.pdf.getOutline().then((outline: any[]) => {
      this.outline = outline;
    });
  }

  /**
   * Handle error callback
   *
   * @param error error message
   */
  onError(error: any) {
    this.error = error; // set error

    if (error.name === 'PasswordException') {
      const password = prompt(
        'This document is password protected. Enter the password:'
      );

      if (password) {
        this.error = null;
        this.setPassword(password);
      }
    }
  }

  setPassword(password: string) {
    let newSrc;

    if (this.pdfSrc instanceof ArrayBuffer) {
      newSrc = {data: this.pdfSrc};
    } else if (typeof this.pdfSrc === 'string') {
      newSrc = {url: this.pdfSrc};
    } else {
      newSrc = {...this.pdfSrc};
    }

    newSrc.password = password;

    this.pdfSrc = newSrc;
  }

  /**
   * Pdf loading progress callback
   * @param progressData pdf progress data
   */
  onProgress(progressData: PDFProgressData) {
    console.log(progressData);
    this.progressData = progressData;

    this.isLoaded = progressData.loaded >= progressData.total;
    this.error = null; // clear error
  }

  getInt(value: number): number {
    return Math.round(value);
  }

  /**
   * Navigate to destination
   * @param destination pdf navigate to
   */
  navigateTo(destination: any) {
    this.pdfComponent.pdfLinkService.navigateTo(destination);
  }

  /**
   * Scroll view
   */
  scrollToPage() {
    this.pdfComponent.pdfViewer.scrollPageIntoView({
      pageNumber: 3
    });
  }

  /**
   * Page rendered callback, which is called when a page is rendered (called multiple times)
   *
   * @param e custom event
   */
  pageRendered(e: CustomEvent) {
    console.log('(page-rendered)', e);
  }

  okay(event: any) {
    var data = document.getElementById('textLayer');  //Id of the table
    // html2canvas(data).then(canvas => {
    //   // Few necessary setting options
    //   let imgWidth = 208;
    //   let pageHeight = 295;
    //   let imgHeight = canvas.height * imgWidth / canvas.width;
    //   let heightLeft = imgHeight;
    //
    //   const contentDataURL = canvas.toDataURL('image/png')
    //   let pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF
    //   let position = 0;
    //   pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)
    //   pdf.save('./assets/abc.pdf'); // Generated PDF
    // });
    this.loadPdf(event, "./assets/abc.pdf");

  }

  searchQueryChanged(newQuery: string) {
    if (newQuery !== this.pdfQuery) {
      this.pdfQuery = newQuery;
      this.pdfComponent.pdfFindController.executeCommand('find', {
        query: this.pdfQuery,
        highlightAll: true
      });
    } else {
      this.pdfComponent.pdfFindController.executeCommand('findagain', {
        query: this.pdfQuery,
        highlightAll: true
      });
    }
  }
}
