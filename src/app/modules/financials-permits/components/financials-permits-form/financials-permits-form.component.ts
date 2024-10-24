import { Component, OnInit, signal } from '@angular/core';
import { IFinancialsPermits, TFormModes } from '../../financials-permits.model';
import { ExcavationTypeService } from '@shared/services/main-data-management/excavation-type/excavation-type.service';
import { FinancialItemsService } from '@shared/services/main-data-management/financial-items/financial-items.service';
import { ExcavationRoute } from '@shared/enums/excavation-route.enum';
import { LanguageService } from '@shared/services/language/language.service';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { FinancialsPermitsService } from '@shared/services/main-data-management/financials-permits/financials-permits.service';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-financials-permits-form',
  standalone : true,
  imports : [DropdownModule , FormsModule,TranslateModule ,InputTextModule],
  templateUrl: './financials-permits-form.component.html',
  styleUrls: ['./financials-permits-form.component.scss']
})
export class FinancialsPermitsFormComponent implements OnInit {
  financialData: IFinancialsPermits = { };
  mode: TFormModes = "add";
  activities: any[] = [];

  excTypes!: any[];
  excPathTypes!: any[];
  // selectedExcPathType: any;
  selectedExcType = signal<number>(0);
  selectedExcPathType = signal<number>(0);


  constructor(
    private dynamicDialogConfig: DynamicDialogConfig,
    private excavationService: ExcavationTypeService,
    public langService: LanguageService,
    private financialService :  FinancialsPermitsService
  ) {}



  ngOnInit(): void {
    // if (this.mode !== "add") {
    // }
    
    this.financialData = this.dynamicDialogConfig.data.financialData;
    this.mode = this.dynamicDialogConfig.data.mode || "edit";
    this.financialData.formValidation = this.mode == "edit" ? true : false;
    this.excavationService
      .getExcavationTypes(ExcavationRoute.EXCAVATIONTYPE)
      .subscribe((res) => (this.excTypes = res.data.excavationTypes.filter((a:any) => a.status != false)));
    this.excavationService
      .getExcavationTypes(ExcavationRoute.EXCAVATIONPATHTYPE)
      .subscribe((res) => (this.excPathTypes = res.data.excavationPathTypes.filter((a:any) => a.status != false)));
  
    if (this.mode == "show" || this.mode == "edit") {
      this.selectedExcType.set( this.financialData.excavationTypeId!);
      this.selectedExcPathType.set(this.financialData.excavationPathTypeId!);
    }
  
  }


  setData() {
    this.financialData.excavationPathTypeId = this.selectedExcPathType();
    this.financialData.excavationTypeId = this.selectedExcType();
  }
  getFormValidation = (invalid: boolean) => {
    this.financialData.formValidation = !invalid;
    this.financialService.rowData.set(this.financialData);
  };

  getName() {
   return this.langService.browserLang == 'ar' ? this.financialData.excavationPathTypeNameAr + "/" + this.financialData.excavationTypeNameAr : this.financialData.excavationPathTypeNameEn + "/" + this.financialData.excavationTypeNameEn;  
  }
}
