import { Component, Input } from "@angular/core";

import { ButtonModule } from "primeng/button";
import { DialogService, DynamicDialogRef } from "primeng/dynamicdialog";

import { CrudModalFooterComponent } from "@shared/components/crud-modal-footer/crud-modal-footer.component";
import { EconomicClassificationFormComponent } from "../economic-classification-form/economic-classification-form.component";

import { IEconomicClassification } from "../../economic-classifications.model";
import { LanguageService } from "@shared/services/language/language.service";
import { EconomicClassificationsService } from "@shared/services/main-data-management/economic-classifications/economic-classifications.service";
import { MessageService } from "primeng/api";
import { take } from "rxjs";
import { MessagesResponse } from "@shared/enums/messages-response.enum";
import { CanComponent } from "@shared/components/can/can.component";

@Component({
  selector: "app-edit-economic-classifications",
  standalone: true,
  imports: [ButtonModule, EconomicClassificationFormComponent ,CanComponent],
  templateUrl: "./edit-economic-classifications.component.html",
  styleUrl: "./edit-economic-classifications.component.scss",
})
export class EditEconomicClassificationsComponent {
  @Input() btnIcon!: string;
  @Input() btnLabel!: string;
  @Input() rowData: IEconomicClassification = {
    name: "",
    code: "",
    beneficiaryAgencyId : 0,
  };
  get ecData() {
    return this.ecService.rowData()
  }
  ref!: DynamicDialogRef;

  constructor(private dialogService: DialogService,  private langService:LanguageService , private ecService:EconomicClassificationsService , private messageService : MessageService) {}

  openEditModal(event: any) {
    this.ref = this.dialogService.open(EconomicClassificationFormComponent, {
      header: this.langService.getInstantTranslation("update-e-class"),
      styleClass: "crud-modal",
      data: {
        economicClassification: this.rowData,
        mode: "edit",
        footer: {
          submitLabel: "edit",
          cancelLabel: "cancel",
          onSubmit: () => {
            this.updateClassification();
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
  updateClassification() {
    this.rowData = this.ecData;
    if(!this.rowData.formValidation  ){
      this.messageService.add({ severity: 'error', summary: this.langService.getInstantTranslation('sorry'), detail: this.langService.getInstantTranslation('sure-etenred-data') });
      return;
    }
    
    this.ecService.updateEconomicClassification(this.rowData).pipe(take(1))
    .subscribe((res) => {
      // this.activityData.id = -1;
      if (res.message === MessagesResponse.SUCCESS) {
        this.messageService.add({ severity: 'success', summary: this.langService.getInstantTranslation('done'), detail: this.langService.getInstantTranslation('data-updated-success') });
        this.ecService.getEconomicClassifications().subscribe();
        this.ref?.close();
      } else {
        this.messageService.add({ severity: 'error', summary: this.langService.getInstantTranslation('error'), detail: res.message });
        
      }
    });
  }
}
