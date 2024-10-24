import { Component } from "@angular/core";

import { ButtonModule } from "primeng/button";
import { DialogService, DynamicDialogRef } from "primeng/dynamicdialog";

import { CrudModalFooterComponent } from "@shared/components/crud-modal-footer/crud-modal-footer.component";
import { EconomicClassificationFormComponent } from "../economic-classification-form/economic-classification-form.component";
import { IEconomicClassification } from "../../economic-classifications.model";
import { LanguageService } from "@shared/services/language/language.service";
import { TranslateModule } from "@ngx-translate/core";
import { EconomicClassificationsService } from "@shared/services/main-data-management/economic-classifications/economic-classifications.service";
import { MessageService } from "primeng/api";
import { take } from "rxjs";
import { MessagesResponse } from "@shared/enums/messages-response.enum";
import { CanComponent } from "@shared/components/can/can.component";

@Component({
  selector: "app-create-economic-classifications",
  standalone: true,
  imports: [ButtonModule, EconomicClassificationFormComponent, TranslateModule,CanComponent],
  templateUrl: "./create-economic-classifications.component.html",
  styleUrl: "./create-economic-classifications.component.scss",
})
export class CreateEconomicClassificationsComponent {
  ref: DynamicDialogRef | undefined;
  economicClassification: IEconomicClassification = {
    name: "",
    code: "",
    beneficiaryAgencyId : 1,
  };
  constructor(public dialogService: DialogService,private langService :LanguageService ,private ecService:EconomicClassificationsService , private messageService : MessageService) {}

  onClickAddClassificationButton(event: any) {
    this.economicClassification = { beneficiaryAgencyId : 1} as IEconomicClassification;
    
    event.stopPropagation();
    this.ref = this.dialogService.open(EconomicClassificationFormComponent, {
      header: this.langService.getInstantTranslation('add-e-class'),
      styleClass: "crud-modal",
      data: {
        economicClassification : this.economicClassification,
        footer: {
          submitLabel: "add",
          cancelLabel: "cancel",
          onSubmit: () => {
            this.addClassification();
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
  addClassification() {
    if(!this.economicClassification.formValidation  ){
      this.messageService.add({ severity: 'error', summary: this.langService.getInstantTranslation('sorry'), detail: this.langService.getInstantTranslation('sure-etenred-data') });
      return;
    }
 
    this.ecService.createEconomicClassification(this.economicClassification).pipe(take(1))
    .subscribe((res) => {
      // this.activityData.id = -1;
      if (res.message == MessagesResponse.SUCCESS) {
        this.messageService.add({ severity: 'success', summary: this.langService.getInstantTranslation('done'), detail: this.langService.getInstantTranslation('data-added-successfully') });
        this.ecService.getEconomicClassifications().subscribe();
        this.ref?.close();
      }else {
        this.messageService.add({ severity: 'error', summary: this.langService.getInstantTranslation('error'), detail: res.message});
      }
    });
  }
}
