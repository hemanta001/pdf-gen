import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Store} from '@ngxs/store';
import {AddIdCard} from './store/id-card.actions';
import {IdCardStateModel} from './store/id-card.state';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {IMyDpOptions} from 'mydatepicker';
import {ImageCroppedEvent} from "ngx-image-cropper";

@Component({
  selector: 'app-add-user-info',
  templateUrl: './add-user-info.component.html',
  styleUrls: ['./add-user-info.component.scss']
})
export class AddUserInfoComponent implements OnInit {
  public myDatePickerOptions: IMyDpOptions = {
    dateFormat: 'dd-mm-yyyy',
  };
  imageChangedEvent: any = '';
  croppedImage: any = '';
  idCardForm: FormGroup;
  selectedFile;

  constructor(private fb: FormBuilder, private store: Store, private http: HttpClient) {

  }

  ngOnInit(): void {
    this.buildUserInfoForm();
  }

  buildUserInfoForm() {
    this.idCardForm = this.fb.group({
      fullName: ['', Validators.required],
      dateOfBirth: [null, Validators.required],
      gender: ['', Validators.required],
      email: ['', Validators.required],
      website: ['', Validators.required],
      profilePicture: ['', Validators.required],
      position: ['', Validators.required],
      expiryDate: [null, Validators.required],
      employeeNumber: ['', Validators.required]
    });
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
    this.selectedFile = this.dataURItoFile(this.croppedImage);
  }

  private dataURItoFile(dataURI) {
    const arr = dataURI.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], 'profileImage.png', {type: mime});
  }

  imageLoaded() {
    // show cropper
  }

  cropperReady() {
    // cropper ready
  }

  loadImageFailed() {
    // show message
  }

  submitIdCardForm() {
    if (!this.idCardForm.valid) {
      alert('please fill all the fields');
      return
    }

    this.idCardForm.patchValue({dateOfBirth: this.idCardForm.get('dateOfBirth').value.formatted})
    this.idCardForm.patchValue({expiryDate: this.idCardForm.get('expiryDate').value.formatted})

    this.store.dispatch(new AddIdCard(this.idCardForm.value)).subscribe((result: { idCards: IdCardStateModel }) => {
      alert(`Id card info saved successfully !!! Please note your unique id which will be used to generate your id card !!!
      Your unique id is ${result.idCards.savedIdCard.id}`);
      this.idCardForm.reset();
    });
  }

  onFileSelect(event) {
    const fileList = event.target.files;
    if (fileList.length > 0)
      this.selectedFile = fileList[0];
  }

  onUploadFile() {
    const formData = new FormData();
    formData.append('file', this.selectedFile);
    this.http.post(environment.baseUrl + 'upload-file-to-azure', formData).subscribe((data: { url: string }) => {
      (this.idCardForm.patchValue({profilePicture: data.url}));
    });
  }

}
