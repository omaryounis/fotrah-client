import { Component, Input } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CrudModalFooterComponent } from "@shared/components/crud-modal-footer/crud-modal-footer.component";
import { MessagesResponse } from "@shared/enums/messages-response.enum";
import { LanguageService } from "@shared/services/language/language.service";
import { FinancialItemsService } from "@shared/services/main-data-management/financial-items/financial-items.service";
import { MessageService } from "primeng/api";
import { DynamicDialogRef, DialogService } from "primeng/dynamicdialog";

import { InputSwitchModule } from "primeng/inputswitch";
import { take } from "rxjs";
import { IFinancial } from "../../financials.model";
import { FinancialFormComponent } from "../financials-form/financials-form.component";
import { TranslateModule } from "@ngx-translate/core";
import { CanComponent } from "@shared/components/can/can.component";

@Component({
  selector: "app-change-status-activity",
  standalone: true,
  imports: [FormsModule, InputSwitchModule ,TranslateModule, CanComponent] ,
  templateUrl: "./change-financial-status.component.html",
  styleUrl: "./change-financial-status.component.scss",
})
export class ChangeFinancialStatus {
  @Input() btnIcon!: string;
  @Input() btnLabel!: string;
  @Input() rowData: IFinancial = {

  };
 
  ref!: DynamicDialogRef;

  constructor(private dialogService: DialogService, private financialItemsService : FinancialItemsService, private langService : LanguageService , private messageService : MessageService) {}

  openModal(event: any) {
    this.ref = this.dialogService.open(FinancialFormComponent, {
      header: this.langService.getInstantTranslation('activation-deactivation'),
      styleClass: "crud-modal",
      data: {
        financialData: this.rowData,
        mode: "toggleActivation",
        footer: {
          submitLabel: "confirm",
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
    this.rowData.status = !this.rowData.status;
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
