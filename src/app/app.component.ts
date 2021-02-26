/**
 * Created by vadimdez on 21/06/16.
 */
import {Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import {PDFDocumentProxy, PDFProgressData, PDFSource} from './pdf-viewer/pdf-viewer.module';

import {PdfViewerComponent} from './pdf-viewer/pdf-viewer.component';
import {HttpClient} from "@angular/common/http";

declare var $: any;

@Component({
  moduleId: module.id,
  selector: 'pdf-viewer-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {


  @ViewChild('abc', {static: false}) viewer: ElementRef;
  totalPages: number;
  pdfSrc: string | PDFSource | ArrayBuffer = './assets/abc.pdf';
  @ViewChild('pdfPage') div: ElementRef;
  items = [
    'Item 0',
    'Item 1',
    'Item 2',
    'Item 3',
    'Item 4',
    'Item 5',
    'Item 6',
    'Item 7',
  ]
  pdfFieldElements: any = [];
  // or pass options as object
  // pdfSrc: any = {
  //   url: './assets/pdf-test.pdf',
  //   withCredentials: true,
  //// httpHeaders: { // cross domain
  ////   'Access-Control-Allow-Credentials': true
  //// }
  // };
  name = 'Angular';
  origin = [
    {title: 'fullName', type: 'text'},
    {title: 'permanentAddress', type: 'text'},
    {title: 'permanentProvince', type: 'text'},
    {title: 'permanentCity', type: 'text'},
    {title: 'permanentCountry', type: 'text'},
    {title: 'permanentVdcOrMunicipality', type: 'text'},
    {title: 'permanentDistrict', type: 'text'},
    {title: 'permanentWardNo', type: 'text'},
    {title: 'temporaryAddress', type: 'text'},
    {title: 'temporaryProvince', type: 'text'},
    {title: 'temporaryCity', type: 'text'},
    {title: 'temporaryCountry', type: 'text'},
    {title: 'temporaryVdcOrMunicipality', type: 'text'},
    {title: 'temporaryDistrict', type: 'text'},
    {title: 'temporaryWardNo', type: 'text'},
    {title: 'nationality', type: 'text'},
    {title: 'citizenshipCertificateNo', type: 'text'},
    {title: 'dateOfBirth', type: 'text'},
    {title: 'sex', type: 'text'},
    {title: 'bloodGroup', type: 'text'},
    {title: 'fatherName', type: 'text'},
    {title: 'phoneNo', type: 'text'},
  ];

  destination = [];

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

  constructor(private http: HttpClient, private renderer: Renderer2) {
  }

  // Load pdf
  loadPdf(event, filePath) {
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

        this.http.post('http://localhost:8080/secured/pdf/update/' + xcoordinate + '/' + ycoordinate + '/' + this.page, formdata).subscribe(data => {
          console.log("yesssssssssssssss");
        });
      }
    };

    xhr.send();
  }

  next() {
    if (this.page < this.totalPages) {
      this.page = this.page + 1;
    }
  }

  prev() {
    if (this.page > 1) {
      this.page = this.page - 1;
    }
  }

  drop(event, item, i) {
    const elementDragDiv = document.getElementById('box' + i) as HTMLElement;

    console.log(elementDragDiv.style.transform);
    let element = event.source.getRootElement();
    let boundingClientRect = element.getBoundingClientRect();
    let parentPosition = this.getPosition(document.getElementById("pdfShow"));
    console.log(document.getElementById("pdfPage").offsetHeight)
    console.log(document.getElementById("pdfPage").scrollHeight)
    const scrollTop = window.pageYOffset || (document.documentElement || document.body.parentNode || document.body)['scrollTop']
    console.log(scrollTop)
    console.log('x: ' + (boundingClientRect.x - parentPosition.left), 'y: ' + (boundingClientRect.y - document.getElementById("pdfPage").offsetHeight));
    // let element = event.source.getRootElement();
    // let boundingClientRect = element.getBoundingClientRect();
    // console.log("-------------");
    // console.log(boundingClientRect);
    // const windowX = (document.getElementById('pdfPage')['offsetWidth']);
    // const windowY = (document.getElementById('pdfPage')['offsetHeight']);
    // const xcoordinate = boundingClientRect.x;
    // const ycoordinate = (boundingClientRect.y - boundingClientRect.height);
    // const heightCoordinate = boundingClientRect.height / windowY;
    // const widthCoordinate = boundingClientRect.width / windowX;
    //
    // console.log(xcoordinate);
    // console.log(ycoordinate);
    const $element = $('<div/></div>');
    console.log(elementDragDiv)
    $element[0].style.left = boundingClientRect.x + 'px';
    $element[0].style.top = boundingClientRect.y + scrollTop - document.getElementById("pdfPage").offsetHeight + 'px';
    $element[0].style.border = "2px solid";
    $element[0].style.width = "25%";

    $element[0].textContent = item.title;

    //
    $('#pdfPage').append($element);
    $element.draggable().bind('dragstop', (e) => {
      console.log(e)
      console.log("yessssssssssssssss");
    });

    // console.log("---------------")
    // console.log(event);
    // console.log(item)
    //
    elementDragDiv.style.transform = ''
    elementDragDiv.style['touch-action'] = "";
    elementDragDiv.style['-webkit-user-drag'] = "";
    elementDragDiv.style['-webkit-tap-highlight-color'] = "";
    elementDragDiv.style['user-select'] = "";

    console.log(elementDragDiv.getBoundingClientRect());
    const windowX = (document.getElementsByClassName('textLayer')[0]['offsetWidth']);
    const windowY = (document.getElementsByClassName('textLayer')[0]['offsetHeight']);
    console.log("-------------");
    console.log(boundingClientRect);
    const xcoordinate = boundingClientRect.x / windowX;
    const ycoordinate = (boundingClientRect.y + boundingClientRect.height + scrollTop) / windowY
    const heightCoordinate = boundingClientRect.height / windowY;
    const widthCoordinate = boundingClientRect.width / windowX;
    const pdfFieldElement = {
      "xcoordinate": xcoordinate,
      "ycoordinate": ycoordinate,
      "height": heightCoordinate,
      "width": widthCoordinate,
      "pageNum": this.page,
      "fieldName": item.title
    };
    this.pdfFieldElements.push(pdfFieldElement);
    console.log('x: ' + (boundingClientRect.x / windowX), 'y: ' + (boundingClientRect.y / windowY));
  }

  onsubmit() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', './assets/abc.pdf', true);
    xhr.responseType = 'blob';

    xhr.onload = (e: any) => {
      console.log(xhr);
      if (xhr.status === 200) {
        const blob = new Blob([xhr.response], {type: 'application/pdf'});
        this.pdfSrc = URL.createObjectURL(blob);
        console.log(event);
        // this.loadPdf();
        const formdata: FormData = new FormData();

        formdata.append('file', blob);
        formdata.append("pdfFieldElementsList", JSON.stringify(this.pdfFieldElements));
        this.http.post('http://localhost:8080/api/securedid/secured/pdf/update', formdata).subscribe(data => {
          console.log("yesssssssssssssss");
        });
      }
    };

    xhr.send();
    // $( "#here" ).refresh();
  }


  onDragEnded(event) {

    console.log(event);
    const windowX = (document.getElementsByClassName('textLayer')[0]['offsetWidth']);
    const windowY = (document.getElementsByClassName('textLayer')[0]['offsetHeight']);
    let element = event.source.getRootElement();
    let boundingClientRect = element.getBoundingClientRect();
    console.log("-------------");
    console.log(boundingClientRect);
    const xcoordinate = boundingClientRect.x / windowX;
    const ycoordinate = (boundingClientRect.y + boundingClientRect.height) / windowY
    const heightCoordinate = boundingClientRect.height / windowY;
    const widthCoordinate = boundingClientRect.width / windowX;

    console.log('x: ' + (boundingClientRect.x / windowX), 'y: ' + (boundingClientRect.y / windowY));
    const xhr = new XMLHttpRequest();
    xhr.open('GET', './assets/abc.pdf', true);
    xhr.responseType = 'blob';

    xhr.onload = (e: any) => {
      console.log(xhr);
      if (xhr.status === 200) {
        const blob = new Blob([xhr.response], {type: 'application/pdf'});
        this.pdfSrc = URL.createObjectURL(blob);
        console.log('x = ' + xcoordinate, 'y = ' + ycoordinate);
        console.log(event);
        // this.loadPdf();
        const formdata: FormData = new FormData();

        formdata.append('file', blob);

        this.http.post('http://localhost:8080/secured/pdf/update/' + xcoordinate + '/' + ycoordinate + '/' + widthCoordinate + '/' + heightCoordinate + '/' + this.page, formdata).subscribe(data => {
          console.log("yesssssssssssssss");
        });
      }
    };

    xhr.send();
  }

  getPosition(el) {
    console.log("djsadjisajdisaij")
    console.log(el)
    let x = 0;
    let y = 0;
    while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
      x += el.offsetLeft - el.scrollLeft;
      y += el.offsetTop + el.scrollTop;
      el = el.offsetParent;
    }
    return {top: y, left: x};
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
    this.totalPages = pdf.numPages;
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

  check(event: any) {
    console.log(event);
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
    // this.loadPdf(event, "./assets/abc.pdf");
    // let element = event.source.getRootElement();
    // let boundingClientRect = element.getBoundingClientRect();
    console.log(event)

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
