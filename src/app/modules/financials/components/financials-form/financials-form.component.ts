import { Component, OnInit, Signal, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { ButtonModule } from "primeng/button";
import { DropdownModule } from "primeng/dropdown";
import { InputTextModule } from "primeng/inputtext";
import { FileUploadModule } from "primeng/fileupload";
import { InputTextareaModule } from "primeng/inputtextarea";
import { DynamicDialogConfig } from "primeng/dynamicdialog";

import { IFinancial, TFormModes } from "./../../financials.model";
import { TranslateModule } from "@ngx-translate/core";
import { ActivitiesService } from "@shared/services/main-data-management/activities/activities.service";
import { EconomicClassificationsService } from "@shared/services/main-data-management/economic-classifications/economic-classifications.service";
import { IActivity } from "../../../activities/activities.model";
import { LanguageService } from "@shared/services/language/language.service";
import { CommonModule, CurrencyPipe } from "@angular/common";
import { FinancialItemsService } from "@shared/services/main-data-management/financial-items/financial-items.service";
import { RadioButtonModule } from "primeng/radiobutton";

@Component({
  selector: "app-activity-form",
  standalone: true,
  imports: [
    FormsModule,
    ButtonModule,
    DropdownModule,
    InputTextModule,
    FileUploadModule,
    InputTextareaModule,
    TranslateModule,
    CurrencyPipe,
    RadioButtonModule,
    CommonModule
  ],
  templateUrl: "./financials-form.component.html",
  styleUrl: "./financials-form.component.scss",
})
export class FinancialFormComponent implements OnInit {
  financialData: IFinancial = {
    nameAr: "",
    nameEn: " ",
    code: "",
    isRecurring: true,
    categoryId: 0,
    activityId: 0,
    amount: 0,
    gfsId: 0,
  };
  mode: TFormModes = "add";
  activities: any[] = [];
  selectedActivity: any;
  classification!: any[];
  selectedClassification: any;
  gfsList!: any[];
  selectedGfs = signal<number>(0);
  selectedFiles: File[] = [];
  selectedFilesString: string = "";
  labelConfirmation: string = "";

  constructor(
    private dynamicDialogConfig: DynamicDialogConfig,
    private activitiesService: ActivitiesService,
    private gfsService: EconomicClassificationsService,
    public langService: LanguageService,
    private financialService :  FinancialItemsService
  ) {
    
  }

  onFileSelect(event: any) {
    this.selectedFiles = event.target.files;
    this.updateSelectedFilesString();
  }

  updateSelectedFilesString() {
    this.selectedFilesString = "";
    if (this.selectedFiles.length > 0) {
      for (let file of this.selectedFiles) {
        this.selectedFilesString += file.name + ", ";
      }
      this.selectedFilesString = this.selectedFilesString.slice(0, -2); // remove trailing comma and space
    }
  }

  ngOnInit(): void {
    // if (this.mode !== "add") {
    // }
     
    this.financialData = this.dynamicDialogConfig.data.financialData;
    this.labelConfirmation =  this.financialData.status == true ? 'sure-to-deactivate-this-record' : 'sure-to-activate-this-record';

    this.mode = this.dynamicDialogConfig.data.mode || "edit";
    this.financialData.formValidation = this.mode == "edit" ? true : false;

    this.activitiesService
      .getActivities()
      .subscribe((res) => (this.activities = res.data.activities.filter((a:any) => a.status != false)));
    this.gfsService
      .getEconomicClassifications()
      .subscribe((res) => (this.gfsList = res.data.gfsDetails.filter((a:any) => a.status != false)));
    if (this.mode == "show" || this.mode == "edit") {
      this.selectedGfs.set(this.financialData.gfsId!);
      this.selectedActivity = this.financialData.activityId;
      this.selectedClassification = this.financialData.categoryId;
    }
    this.classification = [
      { name: this.langService.getInstantTranslation("serious"), code: 1 },
      { name: this.langService.getInstantTranslation("not-serious"), code: 2 },
    ];
  }

  get filteredActivities() {
    this.setData();
    return this.activities.length > 0
      ? this.activities.filter((a: IActivity) => a.gfSsId == this.selectedGfs() && a.status != false)
      : this.activities;
  }
  setData() {
    this.financialData.activityId = parseInt(this.selectedActivity);
    this.financialData.gfsId = this.selectedGfs();
    this.financialData.categoryId = this.selectedClassification;
  }
  getFormValidation = (invalid: boolean) => {
    this.financialData.formValidation = !invalid;
    this.financialService.rowData.set(this.financialData);
  };
}
