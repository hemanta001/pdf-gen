import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {BaseEncodedData} from './encoded-data.model';
import {UploadConvertService} from './upload-convert.service';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-upload-convert',
  templateUrl: './upload-convert.component.html',
  styleUrls: ['./upload-convert.component.scss']
})


export class UploadConvertComponent implements OnInit {
  images = [];
  docFile = File;
  currentFileUpload: File;
  fileToUpload: any;
  corsString = 'https://cors-anywhere.herokuapp.com/';
  pdfSource: string;
  finalPdfSource: string;
  baseEncodedDatas: Array<BaseEncodedData> = [];
  myForm = new FormGroup({
    file: new FormControl('', [Validators.required]),
    fileSource: new FormControl('', [Validators.required])
  });

  constructor(private http: HttpClient, private _uploadFileService: UploadConvertService) {
  }

  get f() {
    return this.myForm.controls;
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
      if (event.target.files[0].type === 'application/msword' ||
        event.target.files[0].type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        console.log('doc aayexa');
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
          // if (event instanceof HttpResponse) {
          //   this.pdfSource = (event.body as string);
          //   this.finalPdfSource = this.corsString + this.pdfSource;
          //   console.log(this.finalPdfSource);
          //   document.getElementById('pdfViewer').removeAttribute('hidden');
          // }
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
