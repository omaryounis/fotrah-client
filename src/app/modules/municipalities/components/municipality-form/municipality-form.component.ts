import { Component, Input, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { DropdownModule } from "primeng/dropdown";
import { InputTextModule } from "primeng/inputtext";
import { DynamicDialogConfig } from "primeng/dynamicdialog";

import { TFormModes, IMunicipalities } from "../../municipalities.model";
import { LanguageService } from "@shared/services/language/language.service";
import { TranslateModule } from "@ngx-translate/core";
import { MunicipalsService } from "@shared/services/main-data-management/municipals/municipals.service";
import { ClassificationLevelsService } from "@shared/services/loockups/classification-levels.service";
import { RegionsService } from "@shared/services/loockups/regions.service";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-municipality-form",
  standalone: true,
  imports: [FormsModule, DropdownModule, InputTextModule, TranslateModule,CommonModule],
  templateUrl: "./municipality-form.component.html",
  styleUrl: "./municipality-form.component.scss",
})
export class MunicipalityFormComponent implements OnInit {
  @Input() municipalityData: IMunicipalities = {
    nameAr: "",
    nameEn: "",
    regionId: 0,
    classificationId: 0,
    code: 0,
  };
  area!: any[];
  selectedArea: any;
  classification!: any[];
  selectedClass: any;
  mode: TFormModes = "add";
  labelConfirmation: string = "";

  constructor(
    private dynamicDialogConfig: DynamicDialogConfig,
    public langService: LanguageService,
    private classifcationsService: ClassificationLevelsService,
    private regionsService: RegionsService,
    private municipalityService:MunicipalsService
  ) {}

  setData() {
    this.municipalityData.classificationId = parseInt(this.selectedClass);
    this.municipalityData.regionId = parseInt(this.selectedArea);
  }

  ngOnInit(): void {
    this.regionsService
      .getRegions()
      .subscribe((res) => (this.area = res.data.regions));
    this.classifcationsService
      .getClassificationLevels()
      .subscribe((res) => (this.classification = res.data.classifications));

    // this.classification = this.prepareClasses();
    this.mode = this.dynamicDialogConfig.data.mode || "add";
    this.municipalityData = this.dynamicDialogConfig.data.municipalityData;
    this.labelConfirmation =  this.municipalityData.status == true ? 'sure-to-deactivate-this-record' : 'sure-to-activate-this-record';

    this.municipalityData.formValidation = this.mode == "edit" ? true : false;

   
    if (this.mode == "show" || this.mode == "edit") {
      this.selectedClass = this.municipalityData.classificationId;
      this.selectedArea = this.municipalityData.regionId;
    }
 
  }

  getFormValidation = (invalid: boolean) => {
    this.municipalityData.formValidation = !invalid;
    this.municipalityService.rowData.set(this.municipalityData);
  };
}
