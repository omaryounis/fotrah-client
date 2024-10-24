import { Component, Input, OnInit } from '@angular/core';
import { IExcavationType, TFormModes } from '../../excavation-type.model';
import { ExcavationTypeService } from '@shared/services/main-data-management/excavation-type/excavation-type.service';
import { LanguageService } from '@shared/services/language/language.service';
import { EconomicClassificationsService } from '@shared/services/main-data-management/economic-classifications/economic-classifications.service';
import { ModalService } from '@shared/services/modal/modal.service';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { CrudModalFooterComponent } from '@shared/components/crud-modal-footer/crud-modal-footer.component';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ActivatedRoute } from '@angular/router';
import { ExcavationRoute } from '@shared/enums/excavation-route.enum';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-excavation-type-form',
  standalone : true,
  imports: [
    FormsModule,
    InputTextModule,
    InputTextareaModule,
    TranslateModule,
    DropdownModule,
    CrudModalFooterComponent,
    CommonModule
  ],
  templateUrl: './excavation-type-form.component.html',
  styleUrls: ['./excavation-type-form.component.scss']
})
export class ExcavationTypeFormComponent implements OnInit {

  showModalService: ModalService = new ModalService();
  // @ViewChild(CrudModalFooterComponent) child?: CrudModalFooterComponent;
  excavationTypeData: IExcavationType = {
    nameAr: "",
    nameEn: "",
    code: "",
    
  };

  formValidation: boolean = false;
  mode: TFormModes = "add";
  selected_gfs: number = 0;
  @Input() excavationRoute: any;
  prefexLabel: string = "";
  labelConfirmation: string = '';
  constructor(
    private dynamicDialogConfig: DynamicDialogConfig,
    private ecService: EconomicClassificationsService,
    private excavationTypeService: ExcavationTypeService,
    public langService :LanguageService,
  ) {
    ecService.getEconomicClassifications().subscribe();
    this.excavationRoute = this.dynamicDialogConfig.data.excavationRoute;
    this.prefexLabel =this.excavationRoute  == ExcavationRoute.EXCAVATIONTYPE ?  'excavation-type' : 'excavation-path'
  }

  ngOnInit(): void {
    this.excavationTypeData = this.dynamicDialogConfig.data.excavationTypeData;
    this.labelConfirmation =  this.excavationTypeData.status == true ? 'sure-to-deactivate-this-record' : 'sure-to-activate-this-record';
    this.mode = this.dynamicDialogConfig.data.mode || "edit";
    this.excavationTypeData.formValidation = this.mode == "edit" ? true : false;
  
  }
  get gfs_list() {
    return this.ecService.entities();
  }
  
  getFormValidation = (invalid: boolean) => {
    this.excavationTypeData.formValidation = !invalid;
    this.excavationTypeService.rowData.set(this.excavationTypeData);
  }

}
