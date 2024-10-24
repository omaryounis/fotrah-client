import { Component } from "@angular/core";

import { ButtonModule } from "primeng/button";
import { DialogService, DynamicDialogRef } from "primeng/dynamicdialog";

import { MunicipalityFormComponent } from "../municipality-form/municipality-form.component";
import { CrudModalFooterComponent } from "@shared/components/crud-modal-footer/crud-modal-footer.component";
import { TranslateModule } from "@ngx-translate/core";
import { LanguageService } from "@shared/services/language/language.service";
import { MunicipalsService } from "@shared/services/main-data-management/municipals/municipals.service";
import { IMunicipalities } from "../../municipalities.model";
import { take } from "rxjs";
import { MessageService } from "primeng/api";
import { MessagesResponse } from "@shared/enums/messages-response.enum";
import { CanComponent } from "@shared/components/can/can.component";

@Component({
  selector: "app-create-municipality",
  standalone: true,
  imports: [ButtonModule, MunicipalityFormComponent , TranslateModule,CanComponent],
  templateUrl: "./create-municipality.component.html",
  styleUrl: "./create-municipality.component.scss",
})
export class CreateMunicipalityComponent {
  ref: DynamicDialogRef | undefined;
  municipalityData: IMunicipalities = {
    nameAr: "",
    nameEn: "",
  };
  constructor(public dialogService: DialogService, private langService : LanguageService , private municipalityService:MunicipalsService , private messageService :MessageService) {}

  onClickAddMunicipalityButton(event: any) {
    this.municipalityData = {} as IMunicipalities;
    event.stopPropagation();
    this.ref = this.dialogService.open(MunicipalityFormComponent, {
      header: this.langService.getInstantTranslation('add-municipality'),
      styleClass: "crud-modal",
      data: {
        municipalityData : this.municipalityData,
        footer: {
          submitLabel: "add",
          cancelLabel: "cancel",
          onSubmit: () => {
           this.addMunicipality();
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
  addMunicipality() {
    if(!this.municipalityData.formValidation || !this.municipalityData.classificationId || !this.municipalityData.regionId ){
      this.messageService.add({ severity: 'error', summary: this.langService.getInstantTranslation('sorry'), detail: this.langService.getInstantTranslation('sure-etenred-data') });
      return;
    }
    this.municipalityService.createMunicipals(this.municipalityData).pipe(take(1))
    .subscribe((res) => {
      // this.municipalityData.id = -1;
      if (res.message == MessagesResponse.SUCCESS) {
        this.messageService.add({ severity: 'success', summary: this.langService.getInstantTranslation('done'), detail: this.langService.getInstantTranslation('data-added-successfully') });
        this.municipalityService.getMunicipals().subscribe();
        this.ref?.close();
      } else {
        this.messageService.add({ severity: 'error', summary: this.langService.getInstantTranslation('error'), detail: res.message});
      }
 
    });
  }
}
