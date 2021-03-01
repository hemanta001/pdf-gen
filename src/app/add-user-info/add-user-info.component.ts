import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Component({
  selector: 'app-add-user-info',
  templateUrl: './add-user-info.component.html',
  styleUrls: ['./add-user-info.component.scss']
})
export class AddUserInfoComponent implements OnInit {
  idCardInfoForm: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient) {
  }

  ngOnInit(): void {
    this.buildUserInfoForm();
  }

  buildUserInfoForm() {
    this.idCardInfoForm = this.fb.group({
      fullName: [],
      phoneNo: []
    });
  }

  submitUserInfo() {
    console.log(this.idCardInfoForm.value)
    this.http.post<{ fullName: string, phoneNo: number }>('http://localhost:8080/saveIdCardInfo', this.idCardInfoForm.value).subscribe(res => {
      console.log(res);
      alert("id card info saved successfully")
    });
  }

}
