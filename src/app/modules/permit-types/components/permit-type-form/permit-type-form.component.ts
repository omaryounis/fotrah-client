import { Component, Input, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { DropdownModule } from "primeng/dropdown";
import { InputTextModule } from "primeng/inputtext";
import { DynamicDialogConfig } from "primeng/dynamicdialog";

import { TFormModes, IPermitTypes } from "../../permit-types.model";
import { LanguageService } from "@shared/services/language/language.service";
import { TranslateModule } from "@ngx-translate/core";
import { MunicipalsService } from "@shared/services/main-data-management/municipals/municipals.service";
import { ClassificationLevelsService } from "@shared/services/loockups/classification-levels.service";
import { RegionsService } from "@shared/services/loockups/regions.service";
import { PermitTypesService } from "@shared/services/permit-types/permit-types.service";
import { CommonModule } from "@angular/common";
import { InputTextareaModule } from "primeng/inputtextarea";

@Component({
  selector: "app-permit-type-form",
  standalone: true,
  imports: [FormsModule, DropdownModule, InputTextModule , TranslateModule , CommonModule,InputTextareaModule],
  templateUrl: "./permit-type-form.component.html",
  styleUrl: "./permit-type-form.component.scss",
})
export class PermitTypeFormComponent implements OnInit {
  @Input() permitTypeData: IPermitTypes = {
    nameAr: "",
    nameEn: "",
    code: "",
    validityBillPaymentPeriodInDays : undefined,
  };
  area!: any[];
  selectedArea: any;
  classification!: any[];
  selectedClass: any;
  mode: TFormModes = "add";
  labelConfirmation: string = "";

  constructor(private dynamicDialogConfig: DynamicDialogConfig, private permitTypeService :PermitTypesService, private langService : LanguageService, private classifcationsService : ClassificationLevelsService, private regionsService : RegionsService) {}

  ngOnInit(): void {
   
    this.regionsService.getRegions().subscribe(
      res => this.area = res.data.regions
    )
    this.classifcationsService.getClassificationLevels().subscribe(
      res => this.classification = res.data.classifications
    )
  
    // this.classification = this.prepareClasses();
    this.mode = this.dynamicDialogConfig.data.mode || "add";
    this.permitTypeData = this.dynamicDialogConfig.data.permitTypeData;
    this.labelConfirmation =  this.permitTypeData.status == true ? 'sure-to-deactivate-this-record' : 'sure-to-activate-this-record';

    this.permitTypeData.formValidation =  this.mode == "edit" ? true : false;

    // if (this.mode !== "add") {
    // }
  }

  prepareClasses() : any[] {
    const numbers: number[] = Array.from({ length: 6 }, (_, i) => i + 1);
    let classes = numbers.map((a, index) => ({
      code : index + 1,
      name : this.langService.getInstantTranslation('class.' + (index + 1))
    }))
    return classes;
  }

  getFormValidation = (invalid: boolean) => {
    this.permitTypeData.formValidation = !invalid;
    this.permitTypeService.rowData.set(this.permitTypeData);
  };

}
