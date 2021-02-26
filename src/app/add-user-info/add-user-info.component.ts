import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-add-user-info',
  templateUrl: './add-user-info.component.html',
  styleUrls: ['./add-user-info.component.scss']
})
export class AddUserInfoComponent implements OnInit {
  userInfoForm: FormGroup;

  constructor(private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.buildUserInfoForm();
  }

  buildUserInfoForm() {
    this.userInfoForm = this.fb.group({
      fullName: [],
      phoneNo: []
    });
  }

  submitUserInfo() {
    console.log('form submitted')
  }

}
