import { Component, Input, OnInit } from "@angular/core";
import { AbstractControl } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";

@Component({
  selector: "app-form-error",
  standalone: true,
  imports: [TranslateModule],
  templateUrl: "./form-error.component.html",
  styleUrl: "./form-error.component.scss",
})
export class FormErrorComponent implements OnInit {
  @Input({ required: true }) inputFormControl!: AbstractControl;
  @Input({ required: true }) errorMessages: Record<string, string> = {};

  validationRules: string[] = [];

  ngOnInit(): void {
    this.validationRules = Object.keys(this.errorMessages);
  }
}
