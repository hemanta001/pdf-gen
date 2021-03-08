import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {UploadConvertService} from './upload-convert.service';
import jsPDF from 'jspdf';
import {PDFDocumentProxy, PDFProgressData, PDFSource} from "../pdf-viewer/pdf-viewer.module";
import {PdfViewerComponent} from "../pdf-viewer/pdf-viewer.component";
import {MatDialog} from "@angular/material/dialog";
import {ModalOrganizationComponent} from "../modals/modal-organization/modal-organization.component";
import {OrganizationService} from "../organization/service/organization.service";
import {Router} from "@angular/router";
import {environment} from "../../environments/environment";

declare var $: any;

@Component({
  selector: 'app-upload-convert',
  templateUrl: './upload-convert.component.html',
  styleUrls: ['./upload-convert.component.scss']
})


export class UploadConvertComponent implements OnInit {
  @ViewChild('abc', {static: false}) viewer: ElementRef;
  totalPages: number;
  pdfSrc: string | PDFSource | ArrayBuffer = './assets/abc.pdf';
  @ViewChild('pdfPage') div: ElementRef;
  rtime: any;
  timeout = false;
  delta = 200;
  pdfFieldElements: any = [];
  dragPosition = {x: 0, y: 0};
  name = 'Angular';
  fields: { title: string, type: string }[];
  organizationFields: { id: number, name: string, selected: boolean }[];
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
  pdfSource: string = 'https://secureid.blob.core.windows.net/documents/1614585679625.pdf';
  myForm = new FormGroup({
    file: new FormControl('', [Validators.required]),
    fileSource: new FormControl('', [Validators.required])
  });

  constructor(private http: HttpClient, private _uploadFileService: UploadConvertService, private matDialog: MatDialog,
              private organizationService: OrganizationService, private router: Router) {
  }

  get f() {
    return this.myForm.controls;
  }

  next() {
    if (this.page < this.totalPages) {
      this.page = this.page + 1;
      this.divAdd();
    }
  }

  divAdd() {
    let i = 0;
    for (const pdfFieldElement of this.pdfFieldElements) {
      if (pdfFieldElement.pageNum === this.page) {
        const windowX = this.getWindowX();
        const windowY = this.getWindowY();
        this.insertFieldToPdf(pdfFieldElement, i, windowX, windowY);
      } else {
        document.getElementsByClassName("page" + pdfFieldElement.pageNum)[0].remove();
      }
      i++;
    }

  }

  prev() {
    if (this.page > 1) {
      this.page = this.page - 1;
      this.divAdd();
    }
  }

  resetDragPosition($event) {
    this.dragPosition = {x: 0, y: 0};
  }

  checkIfDropExistsInPdfView(boundingClientRect: any) {
    if (
      boundingClientRect.top >= 0 &&
      boundingClientRect.left >= 0 &&
      boundingClientRect.right <= (document.getElementById('pdfPage').clientWidth) &&
      boundingClientRect.bottom <= (document.getElementById('pdfPage').clientHeight)
    ) {
      console.log('----In the pdf View!-----proceed for drop----');
      return true;
    } else {
      console.log('----out of the pdf View!-----abort drop----');
      return false;
    }
  }

  drop(event, item, i) {
    const element = event.source.getRootElement();
    const boundingClientRect = element.getBoundingClientRect();
    event.source.element.nativeElement.style.transform = 'none';// visually reset element to its origin
    const source: any = event.source;
    source._passiveTransform = {x: 0, y: 0};
    if (!this.checkIfDropExistsInPdfView(boundingClientRect)) {
      return;
    }
    const windowX = this.getWindowX();
    const windowY = this.getWindowY();
    const scrollTop = window.pageYOffset || (document.documentElement || document.body.parentNode || document.body)['scrollTop']
    const pdfFieldElement = this.setPdfFieldElements(boundingClientRect, windowX, windowY, scrollTop, item);
    this.insertFieldToPdf(pdfFieldElement, i, windowX, windowY, item.shape);
  };

  getWindowX() {
    return (document.getElementsByClassName('textLayer')[0]['offsetWidth']);
  }

  getWindowY() {
    return (document.getElementsByClassName('textLayer')[0]['offsetHeight']);
  }

  setPdfFieldElements(boundingClientRect: any, windowX: any, windowY: any, scrollTop: any, item: any) {
    const xcoordinate = boundingClientRect.x / windowX;
    const ycoordinate = (boundingClientRect.y + boundingClientRect.height + scrollTop) / windowY;
    const heightCoordinate = boundingClientRect.height / windowY;
    const widthCoordinate = boundingClientRect.width / windowX;
    const pdfFieldElement = {
      "xcoordinate": xcoordinate,
      "ycoordinate": ycoordinate,
      "height": heightCoordinate,
      "width": widthCoordinate,
      "isDeleted": false,
      "pageNum": this.page,
      "fieldName": item.title,
      "fieldType":item.type,
      "transparent": false
    };
    this.pdfFieldElements.push(pdfFieldElement);
    return pdfFieldElement;
  }

  getDroppedDiv(pdfFieldElement: any, windowX: any, windowY: any, index: any, shape?: any) {
    if (shape === 'circle') {
      const $elementCircleDiv = $(`<div></div>`);
      // $elementCircleDiv[0].classList.add('page' + this.page);
      // $elementCircleDiv[0].style.position = 'absolute';
      $elementCircleDiv[0].style.marginLeft = '200px';
      $elementCircleDiv[0].style.marginTop = '200px';

      // $elementCircleDiv[0].style.height = (pdfFieldElement.height * windowY) + 'px';
      $elementCircleDiv[0].style.width = '200px';
      $elementCircleDiv[0].style.height = '200px';
      $elementCircleDiv[0].style.marginLeft = (pdfFieldElement.xcoordinate * windowX) + 'px';
      $elementCircleDiv[0].style.marginTop = ((pdfFieldElement.ycoordinate - pdfFieldElement.height) * windowY) - document.getElementById("pdfPage").offsetHeight + 'px';
      $elementCircleDiv[0].style.backgroundColor = '#bbb';

      $elementCircleDiv[0].style.borderRadius = '50%';
      $elementCircleDiv[0].style.display = 'inline-block';
      $elementCircleDiv[0].style.position = 'absolute';
      $elementCircleDiv[0].style.height = (pdfFieldElement.height * windowY) + 'px';
      $elementCircleDiv[0].style.width = (pdfFieldElement.width * windowX) + 'px';
      return $elementCircleDiv;
    }
    let opaqueSelected = `<option value="Opaque">Opaque</option>`;
    let transparentSelected = `<option value="Transparent">Transparent</option>`;
    if (pdfFieldElement.transparent) {
      transparentSelected = `<option value="Transparent" selected>Transparent</option>`;
    } else {
      opaqueSelected = `<option value="Opaque" selected>Opaque</option>`;
    }
    const $element = $(`<div class="row dropped-field">
       <div class="col-10">
         <div class="row">
           <div class="col-7">
             ${pdfFieldElement.fieldName}
           </div>
           <div class="col-5 hide-it">
             <select name="transparencyType" id='transparencyType-${index}'>
               ${opaqueSelected}${transparentSelected}
             </select>
           </div>
         </div>
       </div>
       <div class="col-2 close-btn h1 text-danger font-weight-bold hide-it"
            style="cursor: pointer; margin-left: -15px; margin-top: -15px">
         &times;
       </div>
     </div>`);
    $element[0].classList.add('drag-and-resize-div');
    $element[0].classList.add('page' + this.page);
    $element[0].style.position = 'absolute';
    $element[0].style.marginLeft = (pdfFieldElement.xcoordinate * windowX) + 'px';
    $element[0].style.marginTop = ((pdfFieldElement.ycoordinate - pdfFieldElement.height) * windowY) - document.getElementById("pdfPage").offsetHeight + 'px';
    $element[0].style.border = "2px solid";
    $element[0].style.height = (pdfFieldElement.height * windowY) + 'px';
    $element[0].style.width = (pdfFieldElement.width * windowX) + 'px';
    $element[0].setAttribute("index", index);
    if (pdfFieldElement['isDeleted']) {
      $element[0].style.visibility = 'hidden';
    }
    return $element;
  }

  updateTransparency(index, transparent) {
    this.pdfFieldElements[index]['transparent'] = transparent;
  }

  openOrganizationModal() {
    const dialogRef = this.matDialog.open(ModalOrganizationComponent, {
      width: '650px',
      height: '550px',
    });
    dialogRef.afterClosed().subscribe(data => {
      if (data != undefined) this.organizationFields.push(data);
    })
  }

  updateForm(event, index) {
    const boundingClientRect = event.getBoundingClientRect();
    const scrollTop = window.pageYOffset || (document.documentElement || document.body.parentNode || document.body)['scrollTop']
    const windowX = (document.getElementsByClassName('textLayer')[0]['offsetWidth']);
    const windowY = (document.getElementsByClassName('textLayer')[0]['offsetHeight']);
    if (!this.checkIfDropExistsInPdfView(boundingClientRect)) {
      event.remove();
      this.insertFieldToPdf(this.pdfFieldElements[index], windowX, windowY, index);
      return;
    }
    const xcoordinate = boundingClientRect.x / windowX;
    const ycoordinate = (boundingClientRect.y + boundingClientRect.height + scrollTop) / windowY
    const heightCoordinate = boundingClientRect.height / windowY;
    const widthCoordinate = boundingClientRect.width / windowX;
    this.pdfFieldElements[index] = {
      "xcoordinate": xcoordinate,
      "ycoordinate": ycoordinate,
      "height": heightCoordinate,
      "width": widthCoordinate,
      "pageNum": this.page,
      "transparent": this.pdfFieldElements[index].transparent,
      "fieldName": this.pdfFieldElements[index].fieldName
    };
  }

  closeButton() {
    $('.close-btn').on('click', (e) => {
      const divToRemove = e.target.closest(".drag-and-resize-div");
      this.pdfFieldElements[divToRemove.getAttribute("index")]['isDeleted'] = true;
      divToRemove.style.visibility = "hidden";
    });
  }

  selectOnChange() {
    $('select').on('change', (e) => {
      const index = e.target.id.split('-')[1];
      console.log(index);
      if (!index) {
        return;
      }
      const value = e.target.value;
      let transparent = false;
      if (value === 'Transparent') {
        transparent = true;
      }
      this.updateTransparency(index, transparent);
    });

  }

  resizableDiv($element: any) {
    $element.resizable({handles: 'all', cancel: '.ui-dialog-content',}).bind('resizestop', (e) => {
      const index = e.target.getAttribute("index");
      this.updateForm(e.target, index)
    });
  }

  draggableDiv($element: any) {
    $element.draggable().bind('dragstop', (e) => {
      const index = e.target.getAttribute("index");
      this.updateForm(e.target, index)
    });
  }

  onsubmit() {
    this.processing = true;
    const formdata: FormData = new FormData();
    formdata.append('file', this.fileToUpload);
    this.pdfFieldElements = this.pdfFieldElements.filter((pdfElem) => {
      if (!pdfElem.isDeleted) {
        return delete pdfElem['isDeleted'];
      }
    });
    formdata.append("pdfFieldElementsList", JSON.stringify(this.pdfFieldElements));
    this.http.post(`${environment.baseUrl}api/securedid/secured/pdf/update/${$('#orgName').val()}/${$('#document-type').val()}`, formdata).subscribe(data => {
      this.processing = false;
      alert(data["response"])
      location.reload();
    });
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
    this.http.get<{ title: string, type: string }[]>(`${environment.baseUrl}getProperties?documentType=IdCard`)
      .subscribe(data => {
          this.fields = data;
        }
      );

    this.organizationService.getOrganizations().subscribe(data => {
        data["selected"] = false;
        this.organizationFields = data;
      }
    );
  }

  reload() {
    this.rtime = new Date();
    if (this.timeout === false) {
      this.timeout = true;
      setTimeout(() => {                           //<<<---using ()=> syntax
        this.resizeend();
      }, this.delta);
    }
  }

  resizeend() {
    $('.page' + this.page).remove();
    const date: any = new Date();
    if ((date - this.rtime) < this.delta) {
      setTimeout(() => {                           //<<<---using ()=> syntax
        this.resizeend();
      }, this.delta);
    } else {
      this.timeout = false;
    }
    this.patchValues();

  }

  patchValues() {
    let i = 0;
    const windowX = this.getWindowX();
    const windowY = this.getWindowY();
    for (const pdfFieldElement of this.pdfFieldElements) {
      if (pdfFieldElement.pageNum === this.page) {
        this.insertFieldToPdf(pdfFieldElement, i, windowX, windowY);
      }
      i++;
    }
  }

  insertFieldToPdf(pdfFieldElement: any, index: any, windowX: any, windowY: any, shape?: any) {
    const $element = this.getDroppedDiv(pdfFieldElement, windowX, windowY, index, shape);
    $('#pdfPage').append($element);
    this.draggableDiv($element);
    this.resizableDiv($element);
    this.closeButton();
    this.selectOnChange();
  }

  logout() {
    localStorage.removeItem("token");
    this.router.navigate(["/login"]);
  }

}
