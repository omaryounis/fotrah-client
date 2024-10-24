import { Component } from "@angular/core";

import { ButtonModule } from "primeng/button";
import { DialogService, DynamicDialogRef } from "primeng/dynamicdialog";

import { FinancialFormComponent } from "../financials-form/financials-form.component";
import { CrudModalFooterComponent } from "@shared/components/crud-modal-footer/crud-modal-footer.component";
import { TranslateModule } from "@ngx-translate/core";
import { LanguageService } from "@shared/services/language/language.service";
import { IFinancial } from "../../financials.model";
import { FinancialItemsService } from "@shared/services/main-data-management/financial-items/financial-items.service";
import { take } from "rxjs";
import { MessageService } from "primeng/api";
import { MessagesResponse } from "@shared/enums/messages-response.enum";
import { CanComponent } from "@shared/components/can/can.component";

@Component({
  selector: "app-create-financial",
  standalone: true,
  imports: [
    ButtonModule,
    FinancialFormComponent,
    TranslateModule,
    CanComponent,
  ],
  templateUrl: "./create-financial.component.html",
  styleUrl: "./create-financial.component.scss",
})
export class CreateFinancialComponent {
  ref: DynamicDialogRef | undefined;
  financialData: IFinancial = {};
  constructor(
    public dialogService: DialogService,
    private financialItemsService: FinancialItemsService,
    private langService: LanguageService,
    private messageService: MessageService
  ) {}

  onClickAddUserButton(event: any) {
    this.financialData = {
      nameAr: "",
      nameEn: "",
      code: "",
      isRecurring: true,
    } as IFinancial;
    event.stopPropagation();
    this.ref = this.dialogService.open(FinancialFormComponent, {
      header: this.langService.getInstantTranslation("add-financial-item"),
      styleClass: "crud-modal",
      data: {
        financialData: this.financialData,
        footer: {
          submitLabel: "add",
          cancelLabel: "cancel",
          onSubmit: () => {
            this.addItem();
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
  addItem() {
    if (
      !this.financialData.formValidation ||
      !this.financialData.gfsId ||
      !this.financialData.categoryId ||
      !this.financialData.activityId
    ) {
      this.messageService.add({
        severity: "error",
        summary: this.langService.getInstantTranslation("sorry"),
        detail: this.langService.getInstantTranslation("sure-etenred-data"),
      });
      return;
    }

    this.financialItemsService
      .createFinancial(this.financialData)
      .pipe(take(1))
      .subscribe((res) => {
        // this.municipalityData.id = -1;
        if (res.message === MessagesResponse.SUCCESS) {
          this.messageService.add({
            severity: "success",
            summary: this.langService.getInstantTranslation("done"),
            detail: this.langService.getInstantTranslation(
              "data-added-successfully"
            ),
          });
          this.financialItemsService.getFinancials().subscribe();
          this.ref?.close();
        } else {
          this.messageService.add({
            severity: "error",
            summary: this.langService.getInstantTranslation("error"),
            detail: res.message,
          });
        }
      });
  }
}
