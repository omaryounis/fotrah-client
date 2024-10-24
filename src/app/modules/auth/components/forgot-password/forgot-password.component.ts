import { Router } from "@angular/router";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { ButtonModule } from "primeng/button";

import { FormErrorComponent } from "@shared/components/form-error/form-error.component";

import { ERROR_MESSAGES } from "./forgot-password.constants";

import { LoginService } from "@shared/services/login/login.service";

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    ButtonModule,
    FormErrorComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent implements OnInit {
  forgotPassword!: FormGroup;
  forgotPasswordError: string = "";
  errorMessages = ERROR_MESSAGES;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private loginService: LoginService,
  ) { }

  ngOnInit(): void {
    this.buildForm();
  }

  get email(): FormGroup {
    return this.forgotPassword.get("email") as FormGroup;
  }

  buildForm() {
    this.forgotPassword = this.formBuilder.group({
      email: ["", Validators.required],
    });
  }

  onLogin() {
    if (this.forgotPassword.valid) {
      const credentials = this.forgotPassword.value;
    }
  }
}
