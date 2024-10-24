import { Component, Input, NgModule, OnInit, ViewChild, input } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { InputTextModule } from "primeng/inputtext";
import { InputTextareaModule } from "primeng/inputtextarea";
import { DynamicDialogConfig } from "primeng/dynamicdialog";

import { IActivity, TFormModes } from "../../activities.model";
import { TranslateModule } from "@ngx-translate/core";
import { IEconomicClassification } from "../../../economic-classifications/economic-classifications.model";
import { DropdownModule } from "primeng/dropdown";
import { EconomicClassificationsService } from "@shared/services/main-data-management/economic-classifications/economic-classifications.service";
import { ModalService } from "@shared/services/modal/modal.service";
import { Subscription } from "rxjs";
import { CrudModalFooterComponent } from "@shared/components/crud-modal-footer/crud-modal-footer.component";
import { ActivitiesService } from "@shared/services/main-data-management/activities/activities.service";
import { LanguageService } from "@shared/services/language/language.service";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-activity-form",
  standalone: true,
  imports: [

    FormsModule,
    InputTextModule,
    InputTextareaModule,
    TranslateModule,
    DropdownModule,
    CrudModalFooterComponent,
    CommonModule
  ],
  templateUrl: "./activity-form.component.html",
  styleUrl: "./activity-form.component.scss",
})
export class ActivityFormComponent implements OnInit {
  showModalService: ModalService = new ModalService();
  // @ViewChild(CrudModalFooterComponent) child?: CrudModalFooterComponent;
  activityData: IActivity = {
    nameAr: "",
    nameEn: "",
    code: "",
    sector: "",
    description: "",
    gfSsId: 0,
  };
  labelConfirmation :string = "";
  formValidation: boolean = false;
  mode: TFormModes = "add";
  selected_gfs: number = 0;
  constructor(
    private dynamicDialogConfig: DynamicDialogConfig,
    private ecService: EconomicClassificationsService,
    private activityService: ActivitiesService,
    public langService :LanguageService
  ) {
        ecService.getEconomicClassifications().subscribe();
  }

  ngOnInit(): void {
    this.activityData = this.dynamicDialogConfig.data.activityData;
    this.labelConfirmation =  this.activityData.status == true ? 'sure-to-deactivate-this-record' : 'sure-to-activate-this-record';
    this.mode = this.dynamicDialogConfig.data.mode || "edit";
    this.activityData.formValidation = this.mode == "edit" ? true : false;

    if (this.mode == "edit" || this.mode == "show") {
      this.selected_gfs = this.activityData.gfSsId!;
    }
  }
  get gfs_list() {
    return this.ecService.entities().filter((a:any) => a.status != false);
  }
  setData() {
    this.activityData.gfSsId = this.selected_gfs;
  }
  getFormValidation = (invalid: boolean) => {
    this.activityData.formValidation = !invalid;
    this.activityService.rowData.set(this.activityData);
  }
}
