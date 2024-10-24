import { Component, Input, OnInit } from '@angular/core';
import { IMunicipalities } from '../../municipalities.model';
import { MunicipalsService } from '@shared/services/main-data-management/municipals/municipals.service';
import { CrudModalFooterComponent } from '@shared/components/crud-modal-footer/crud-modal-footer.component';
import { LanguageService } from '@shared/services/language/language.service';
import { MessageService } from 'primeng/api';
import { DynamicDialogRef, DialogService } from 'primeng/dynamicdialog';
import { take } from 'rxjs';
import { MunicipalityFormComponent } from '../municipality-form/municipality-form.component';
import { ButtonModule } from 'primeng/button';
import { MessagesResponse } from '@shared/enums/messages-response.enum';
import { CanComponent } from '@shared/components/can/can.component';

@Component({
  selector: 'app-edit-municipality',
  standalone : true,
  imports: [ButtonModule,MunicipalityFormComponent ,CanComponent],
  templateUrl: './edit-municipality.component.html',
  styleUrls: ['./edit-municipality.component.scss']
})
export class EditMunicipalityComponent implements OnInit {

  @Input() btnIcon!: string;
  @Input() btnLabel!: string;
  @Input() rowData: IMunicipalities = {
    id : 0,
    nameAr: "",
    nameEn: "",
    regionId: 0,
    classificationId:0,
    code: 0,
  };

  ref!: DynamicDialogRef;
  formValidation: boolean = false;
  get municipalityData() {
    return this.municipalityService.rowData()
  }
  constructor(private dialogService: DialogService, private langService:LanguageService,private municipalityService:MunicipalsService , private messageService : MessageService) {}
  ngOnInit(): void {}

  openEditModal(event: any) {
    this.ref = this.dialogService.open(MunicipalityFormComponent, {
      header: this.langService.getInstantTranslation('update-municipality'),
      styleClass: "crud-modal",
      data: {
        municipalityData: this.rowData,
        mode: "edit",
        footer: {
          formValidation: this.formValidation,
          submitLabel: "edit",
          cancelLabel: "cancel",
          onSubmit: () => {
            this.updateMuIMunicipalities();
          },
          onCancel: () => {
            this.ref?.close();
          },
        },
      },
      templates: {
        footer: CrudModalFooterComponent,
      },
    });
  }
  updateMuIMunicipalities() {
    this.rowData = this.municipalityData;
    if(!this.rowData.formValidation || !this.municipalityData.classificationId || !this.municipalityData.regionId  ){
      this.messageService.add({ severity: 'error', summary: this.langService.getInstantTranslation('sorry'), detail: this.langService.getInstantTranslation('sure-etenred-data') });
      return;
    }
    this.municipalityService.updateMunicipals(this.rowData).pipe(take(1))
    .subscribe((res) => {
      // this.rowData.id = -1;
      if (res.message == MessagesResponse.SUCCESS) {
        this.messageService.add({ severity: 'success', summary: this.langService.getInstantTranslation('done'), detail: this.langService.getInstantTranslation('data-updated-success') });
        this.municipalityService.getMunicipals().subscribe();
        this.ref?.close();
      } else {
        this.messageService.add({ severity: 'error', summary: this.langService.getInstantTranslation('error'), detail: res.message});
         
      }
    });
  }
}
