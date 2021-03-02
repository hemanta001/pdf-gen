import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {FormBuilder, FormGroup} from "@angular/forms";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-modal-organization',
  templateUrl: './modal-organization.component.html',
  styleUrls: ['./modal-organization.component.scss']
})
export class ModalOrganizationComponent implements OnInit {
  organizationForm : FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient, private matDialogRef:MatDialogRef<ModalOrganizationComponent>) { }

  ngOnInit(): void {
    this.buildOrganizationForm();
  }

  buildOrganizationForm() {
    this.organizationForm = this.fb.group({
      name: ""
    });
  }

  submitOrganization() {
    this.http.post('http://localhost:8080/addOrganization', this.organizationForm.value).subscribe(data=> {
      data["selected"] = true;
      this.matDialogRef.close(data);
      console.log(data)
    });
  }

}
