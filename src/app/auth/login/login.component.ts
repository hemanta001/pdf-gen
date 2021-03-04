import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private router: Router) {
  }

  ngOnInit(): void {
    this.buildLoginForm();
  }

  buildLoginForm() {
    this.loginForm = this.formBuilder.group(
      {
        "username": ["", Validators.required],
        "password": ["", Validators.required]
      }
    )
  }

  login() {
    const username = this.loginForm.value.username;
    const password = this.loginForm.value.password;
    if (username === "admin" && password === "admin") {
      localStorage.setItem("token", "dummy_token");
      this.router.navigate(["/"]);
    } else {
      alert("Invalid username or password");
    }

  }

}
