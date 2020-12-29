import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-upload-convert',
  templateUrl: './upload-convert.component.html',
  styleUrls: ['./upload-convert.component.scss']
})
export class UploadConvertComponent implements OnInit {
  images = [];
  myForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    file: new FormControl('', [Validators.required]),
    fileSource: new FormControl('', [Validators.required])
  });

  constructor(private http: HttpClient) {
  }

  get f() {
    return this.myForm.controls;
  }

  onFileChange(event) {
    if (event.target.files && event.target.files[0]) {
      var filesAmount = event.target.files.length;
      for (let i = 0; i < filesAmount; i++) {
        var reader = new FileReader();

        reader.onload = (event: any) => {
          console.log(event.target.result);
          this.images.push(event.target.result);

          this.myForm.patchValue({
            fileSource: this.images
          });
        };

        reader.readAsDataURL(event.target.files[i]);
      }
    }
  }

  submit() {
    let doc = new jsPDF();
    console.log(this.images.length);
    for (var i = 0; i < this.images.length; i++) {
      let imageData = this.getBase64Image(document.getElementById('img' + i));
      console.log(imageData);
      doc.addImage(imageData, 'JPG', 10, (i + 1) * 10, 180, 150);
      doc.addPage();
    }
    doc.save('Test.pdf');
  }

  getBase64Image(img) {
    var canvas = document.createElement("canvas");
    console.log("image");
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    var dataURL = canvas.toDataURL("image/png");
    return dataURL;
  }

  ngOnInit(): void {
    this.f;
  }

}
