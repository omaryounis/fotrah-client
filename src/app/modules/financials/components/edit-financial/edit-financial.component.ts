import { Component, Input } from "@angular/core";

import { ButtonModule } from "primeng/button";
import { DialogService, DynamicDialogRef } from "primeng/dynamicdialog";

import { FinancialFormComponent } from "./../financials-form/financials-form.component";

import { CrudModalFooterComponent } from "@shared/components/crud-modal-footer/crud-modal-footer.component";

import { IFinancial } from "../../financials.model";
import { LanguageService } from "@shared/services/language/language.service";
import { FinancialItemsService } from "@shared/services/main-data-management/financial-items/financial-items.service";
import { MessageService } from "primeng/api";
import { take } from "rxjs";
import { MessagesResponse } from "@shared/enums/messages-response.enum";
import { CanComponent } from "@shared/components/can/can.component";

@Component({
  selector: "app-edit-financial",
  standalone: true,
  imports: [ButtonModule, FinancialFormComponent  ,CanComponent],
  templateUrl: "./edit-financial.component.html",
  styleUrl: "./edit-financial.component.scss",
})
export class EditFinancialComponent {
  @Input() btnIcon!: string;
  @Input() btnLabel!: string;
  @Input() rowData: IFinancial = {
    nameAr: "",
    nameEn: "",
    code: "",
    categoryId: 0,
    activityId : 0,
    amount : 0,
    gfsId : 0
  };
  get financialData() {
    return this.financialItemsService.rowData()
  }
  ref!: DynamicDialogRef;

  constructor(private dialogService: DialogService, private financialItemsService : FinancialItemsService, private langService : LanguageService , private messageService : MessageService) {}

  openEditModal(event: any) {
    this.ref = this.dialogService.open(FinancialFormComponent, {
      header: this.langService.getInstantTranslation('update-financial-item'),
      styleClass: "crud-modal",
      data: {
        financialData: this.rowData,
        mode: "edit",
        footer: {
          submitLabel: "edit",
          cancelLabel: "cancel",
          onSubmit: () => {
            this.updateItem();
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
  updateItem() {
    this.rowData = this.financialData;
    if(!this.rowData.formValidation || !this.rowData.gfsId || !this.rowData.categoryId || !this.rowData.activityId ){
      this.messageService.add({ severity: 'error', summary: this.langService.getInstantTranslation('sorry'), detail: this.langService.getInstantTranslation('sure-etenred-data') });
      return;
    }
    this.financialItemsService.updateFinancial(this.rowData).pipe(take(1))
    .subscribe((res) => {
      // this.municipalityData.id = -1;
      if (res.message === MessagesResponse.SUCCESS) {
        this.messageService.add({ severity: 'success', summary: this.langService.getInstantTranslation('done'), detail: this.langService.getInstantTranslation('data-updated-success') });
        this.financialItemsService.getFinancials().subscribe();
        this.ref?.close();
      } else {
        this.messageService.add({ severity: 'error', summary: this.langService.getInstantTranslation('error'), detail: res.message });
      }
    });
  }
}
