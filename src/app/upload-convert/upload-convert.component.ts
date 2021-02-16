import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {UploadConvertService} from './upload-convert.service';
import jsPDF from 'jspdf';
import {PDFDocumentProxy, PDFProgressData, PDFSource} from '../pdf-viewer/pdf-viewer.module';
import {PdfViewerComponent} from '../pdf-viewer/pdf-viewer.component';

declare var $: any;

@Component({
  selector: 'app-upload-convert',
  templateUrl: './upload-convert.component.html',
  styleUrls: ['./upload-convert.component.scss']
})


export class UploadConvertComponent implements OnInit {
  @ViewChild('abc', {static: false}) viewer: ElementRef;
  totalPages: number;
  rtime: any;
  timeout = false;
  delta = 200;
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
  ];
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
  processing = false;
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

  images = [];
  docFile = File;
  currentFileUpload: File;
  fileToUpload: any;
  corsString = 'https://cors-anywhere.herokuapp.com/';
  pdfSource: string;
  finalPdfSource: string;
  myForm = new FormGroup({
    file: new FormControl('', [Validators.required]),
    fileSource: new FormControl('', [Validators.required])
  });

  constructor(private http: HttpClient, private _uploadFileService: UploadConvertService) {
  }

  get f() {
    return this.myForm.controls;
  }

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
          console.log('yesssssssssssssss');
        });
      }
    };

    xhr.send();
  }

  // @HostListener('window:resize', ['$event'])
  // onResize(event) {
  //   event.preventDefault();
  //   this.reload();
  //   event.stopPropagation();
  //   // event.stopImmediatePropagation();
  // }


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

    let element = event.source.getRootElement();
    let boundingClientRect = element.getBoundingClientRect();
    const scrollTop = window.pageYOffset || (document.documentElement || document.body.parentNode || document.body)['scrollTop'];
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
    $element[0].classList.add('page' + this.page);
    $element[0].style.position = 'relative';
    $element[0].style.left = boundingClientRect.x + 'px';
    $element[0].style.top = boundingClientRect.y + scrollTop - document.getElementById('pdfPage').offsetHeight + 'px';
    $element[0].style.border = '2px solid';
    $element[0].style.width = '25%';

    $element[0].textContent = item.title;

    //
    $('#pdfPage').append($element);
    $element.draggable().bind('dragstop', (e) => {
      console.log(e);
      console.log('yessssssssssssssss');
    });

    // console.log("---------------")
    // console.log(event);
    // console.log(item)
    //
    elementDragDiv.style.transform = '';
    elementDragDiv.style['touch-action'] = '';
    elementDragDiv.style['-webkit-user-drag'] = '';
    elementDragDiv.style['-webkit-tap-highlight-color'] = '';
    elementDragDiv.style['user-select'] = '';

    const windowX = (document.getElementsByClassName('textLayer')[0]['offsetWidth']);
    const windowY = (document.getElementsByClassName('textLayer')[0]['offsetHeight']);
    console.log('-------------');
    console.log(boundingClientRect);
    const xcoordinate = boundingClientRect.x / windowX;
    const ycoordinate = (boundingClientRect.y + boundingClientRect.height + scrollTop) / windowY;
    const heightCoordinate = boundingClientRect.height / windowY;
    const widthCoordinate = boundingClientRect.width / windowX;
    const pdfFieldElement = {
      'xcoordinate': xcoordinate,
      'ycoordinate': ycoordinate,
      'height': heightCoordinate,
      'width': widthCoordinate,
      'pageNum': this.page,
      'fieldName': item.title
    };
    this.pdfFieldElements.push(pdfFieldElement);
    console.log('x: ' + (boundingClientRect.x / windowX), 'y: ' + (boundingClientRect.y / windowY));
  }

  patchValues() {
    for (const pdfFieldElement of this.pdfFieldElements) {
      if (pdfFieldElement.pageNum === this.page) {
        const windowX = (document.getElementsByClassName('textLayer')[0]['offsetWidth']);
        const windowY = (document.getElementsByClassName('textLayer')[0]['offsetHeight']);
        console.log(windowX, windowY);
        const $element = $('<div/></div>');
        $element[0].classList.add('page' + this.page);
        $element[0].style.left = (pdfFieldElement.xcoordinate * windowX) + 'px';
        $element[0].style.top = ((pdfFieldElement.ycoordinate - pdfFieldElement.height) * windowY) - document.getElementById('pdfPage').offsetHeight + 'px';
        $element[0].style.border = '2px solid';
        $element[0].style.width = '25%';

        $element[0].textContent = pdfFieldElement.fieldName;

        $('#pdfPage').append($element);
        $element.draggable().resizable();
      }
    }
  }

  // reload() {
  //   this.patchValues();
  // }


  onsubmit() {
    this.processing = true;
    // const xhr = new XMLHttpRequest();
    // xhr.open('GET', './assets/abc.pdf', true);
    // xhr.responseType = 'blob';
    //
    // xhr.onload = (e: any) => {
    //   console.log(xhr);
    //   if (xhr.status === 200) {
    //     const blob = new Blob([xhr.response], {type: 'application/pdf'});
    //     this.pdfSrc = URL.createObjectURL(blob);
    //     console.log(event);
    //     // this.loadPdf();
    //     const formdata: FormData = new FormData();
    //
    //     formdata.append('file', this.fileToUpload);
    //     formdata.append("pdfFieldElementsList", JSON.stringify(this.pdfFieldElements));
    //     this.http.post('http://localhost:8080/api/securedid/secured/pdf/update', formdata).subscribe(data => {
    //       console.log("yesssssssssssssss");
    //     });
    //   }
    // };
    //
    // xhr.send();
    // // $( "#here" ).refresh();
    const formdata: FormData = new FormData();

    formdata.append('file', this.fileToUpload);
    formdata.append('pdfFieldElementsList', JSON.stringify(this.pdfFieldElements));
    this.http.post('http://localhost:8080/api/securedid/secured/pdf/update/' + $('#orgName').val(), formdata).subscribe(data => {
      this.processing = false;
      alert('file submitted successfully');
      location.reload();
      console.log('yesssssssssssssss');
    });
  }

  reload() {

    this.rtime = new Date();
    if (this.timeout === false) {
      this.timeout = true;
      setTimeout(()=>{                           //<<<---using ()=> syntax
        this.resizeend();
      }, this.delta);
      // setTimeout(this.resizeend, this.delta);
    }
  }

  resizeend() {
    $('.page' + this.page).remove();
    const date:any = new Date();
    if ((date - this.rtime) < this.delta) {
      setTimeout(()=>{                           //<<<---using ()=> syntax
        this.resizeend();
      }, this.delta);
    } else {
      this.timeout = false;
    }
    this.patchValues();

  }


  onDragEnded(event) {

    console.log(event);
    const windowX = (document.getElementsByClassName('textLayer')[0]['offsetWidth']);
    const windowY = (document.getElementsByClassName('textLayer')[0]['offsetHeight']);
    let element = event.source.getRootElement();
    let boundingClientRect = element.getBoundingClientRect();
    console.log('-------------');
    console.log(boundingClientRect);
    const xcoordinate = boundingClientRect.x / windowX;
    const ycoordinate = (boundingClientRect.y + boundingClientRect.height) / windowY;
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
          console.log('yesssssssssssssss');
        });
      }
    };

    xhr.send();
  }

  getPosition(el) {
    console.log('djsadjisajdisaij');
    console.log(el);
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
    console.log(event);

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

  onFileChange(event) {
    const target = event.target as HTMLInputElement;
    this.currentFileUpload = (target.files as FileList)[0];
    if (this.currentFileUpload.type.match(/image\/*/) != null) {
      if (event.target.files && event.target.files[0]) {
        var filesAmount = event.target.files.length;
        for (let i = 0; i < filesAmount; i++) {
          var reader = new FileReader();

          reader.onload = (event: any) => {
            this.images.push(event.target.result);

            this.myForm.patchValue({
              fileSource: this.images
            });
          };

          reader.readAsDataURL(event.target.files[i]);
        }
      }
    } else {
      this.docFile = event.target.files[0];
      if (event.target.files[0].type === 'application/pdf') {
        this.fileToUpload = event.target.files[0];
      } else {
        console.log('aru ta paidaina');
      }
      console.log(this.docFile);
    }
  }

  submit() {
    if (this.images.length > 0) {
      let doc = new jsPDF('p', 'mm', 'a4', true);
      for (var i = 0; i < this.images.length; i++) {
        let imageData = this.getBase64Image(document.getElementById('img' + i));
        doc.addImage(imageData, 'JPEG', 10, 10, 190, 270, undefined, 'FAST');
        if (i !== this.images.length - 1) {
          doc.addPage();
        }
      }
      this.fileToUpload = doc.output('blob');
      // doc.save('Test.pdf');
    }
    if (this.fileToUpload !== null) {
      this._uploadFileService
        .pushFileToStorage(this.fileToUpload)
        .subscribe(event => {
          console.log(event);
          if (event instanceof HttpResponse) {
            this.pdfSource = (event.body as string);
            this.finalPdfSource = this.corsString + this.pdfSource;
            console.log(this.finalPdfSource);

            document.getElementById('formPdf').setAttribute('hidden', 'hidden');

            document.getElementById('pdfViewer').removeAttribute('hidden');
          }
        });
      console.log('file submit');
    }
  }

  getBase64Image(img) {
    var canvas = document.createElement('canvas');
    canvas.width = 3508;
    canvas.height = 2480;
    var ctx = canvas.getContext('2d');
    // ctx.drawImage(img, 0, 0);
    ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight,     // source rectangle
      0, 0, canvas.width, canvas.height);
    var dataURL = canvas.toDataURL('image/jpeg', 0.8);
    return dataURL;
  }

  ngOnInit(): void {
    this.f;
  }


}
