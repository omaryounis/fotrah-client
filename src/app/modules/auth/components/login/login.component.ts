import { Router } from "@angular/router";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { ButtonModule } from "primeng/button";

import { FormErrorComponent } from "@shared/components/form-error/form-error.component";

import { ERROR_MESSAGES } from "./login.constants";

import { LoginService } from "@shared/services/login/login.service";
import { TranslateModule } from "@ngx-translate/core";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    ButtonModule,
    FormErrorComponent,
    ReactiveFormsModule,
    TranslateModule
  ],
  templateUrl: "./login.component.html",
  styleUrl: "./login.component.scss",
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loginError: string = "";
  errorMessages = ERROR_MESSAGES;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private loginService: LoginService,
  ) { }

  ngOnInit(): void {
    this.buildForm();
  }

  get userName(): FormGroup {
    return this.loginForm.get("username") as FormGroup;
  }

  get password(): FormGroup {
    return this.loginForm.get("password") as FormGroup;
  }

  buildForm() {
    this.loginForm = this.formBuilder.group({
      username: ["", Validators.required],
      password: ["", Validators.required],
    });
  }

  onLogin() {
    if (this.loginForm.valid) {
      const credentials = this.loginForm.value;
       
      this.loginService.login(credentials).subscribe({
        next: (response) => {
          this.router.navigate(["/dashboard"]);
        },
      });
    }
  }

  handelForgotPasswordClick() {
    this.router.navigate(["/auth/forgot-password"]);
  }
}
