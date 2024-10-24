import { Component, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { InputTextModule } from "primeng/inputtext";
import { DynamicDialogConfig } from "primeng/dynamicdialog";

import {
  IEconomicClassification,
  TFormModes,
} from "../../economic-classifications.model";
import { TranslateModule } from "@ngx-translate/core";
import { EconomicClassificationsService } from "@shared/services/main-data-management/economic-classifications/economic-classifications.service";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-economic-classification-form",
  standalone: true,
  imports: [FormsModule, InputTextModule, TranslateModule ,CommonModule],
  templateUrl: "./economic-classification-form.component.html",
  styleUrl: "./economic-classification-form.component.scss",
})
export class EconomicClassificationFormComponent implements OnInit {
  economicClassification: IEconomicClassification = {
    name: "",
    code: "",
    beneficiaryAgencyId : 0,
  };
  mode: TFormModes = "add";
  labelConfirmation: string = "";

  constructor(private dynamicDialogConfig: DynamicDialogConfig ,private ecService :EconomicClassificationsService) {}

  ngOnInit(): void {
    this.mode = this.dynamicDialogConfig.data.mode || "edit";
    this.economicClassification.formValidation = this.mode == "edit" ? true : false;
    if (this.mode !== "add") {
      this.economicClassification =  this.dynamicDialogConfig.data.economicClassification;
      this.labelConfirmation =  this.economicClassification.status == true ? 'sure-to-deactivate-this-record' : 'sure-to-activate-this-record';
    }

  }
  getFormValidation = (invalid: boolean) => {
    this.economicClassification.formValidation = !invalid;
    this.ecService.rowData.set(this.economicClassification);
  }
}
