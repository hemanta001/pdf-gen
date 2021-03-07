import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Store} from '@ngxs/store';
import {AddIdCard} from './store/id-card.actions';
import {IdCardStateModel} from './store/id-card.state';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Component({
  selector: 'app-add-user-info',
  templateUrl: './add-user-info.component.html',
  styleUrls: ['./add-user-info.component.scss']
})
export class AddUserInfoComponent implements OnInit {
  idCardForm: FormGroup;
  selectedFile;

  constructor(private fb: FormBuilder, private store: Store, private http: HttpClient) {

  }

  ngOnInit(): void {
    this.buildUserInfoForm();
  }

  buildUserInfoForm() {
    this.idCardForm = this.fb.group({
      id: [],
      fullName: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      gender: ['', Validators.required],
      email: ['', Validators.required],
      website: ['', Validators.required],
      profilePicture: ['', Validators.required],
      qrCode: ['', Validators.required],
      position: ['', Validators.required],
      expiryDate: ['', Validators.required],
      employeeNumber: ['', Validators.required]
    });
  }

  submitIdCardForm() {
    if (!this.idCardForm.valid) {
      alert('please fill all the fields');
      return
    }
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
      (this.idCardForm.get('profilePicture') as FormControl).setValue(data.url);
    });
  }

}
