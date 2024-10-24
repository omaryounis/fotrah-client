import { Component, Input } from "@angular/core";

import { ButtonModule } from "primeng/button";
import { DialogService, DynamicDialogRef } from "primeng/dynamicdialog";

import { FinancialFormComponent } from "../financials-form/financials-form.component";
import { CrudModalFooterComponent } from "@shared/components/crud-modal-footer/crud-modal-footer.component";

import { IFinancial } from "../../financials.model";
import { LanguageService } from "@shared/services/language/language.service";

@Component({
  selector: "app-show-financial",
  standalone: true,
  imports: [ButtonModule, FinancialFormComponent],
  templateUrl: "./show-financial.component.html",
  styleUrl: "./show-financial.component.scss",
})
export class ShowFinancialComponent {
  @Input() btnIcon!: string;
  @Input() btnLabel!: string;
  @Input() rowData: IFinancial = {
    nameAr: "مخالفة الطرق والشوارع",
    nameEn: "violation ",
    code: "7886",
    categoryId: 0,
    activityId : 0,
    amount : 0,
    gfsId : 0
  };

  ref!: DynamicDialogRef;

  constructor(private dialogService: DialogService, private langService : LanguageService) {}

  openShowModal(event: any) {
    this.ref = this.dialogService.open(FinancialFormComponent, {
      header: this.langService.getInstantTranslation('show-financial-item'),
      styleClass: "crud-modal",
      data: {
        financialData: this.rowData,
        mode: "show",
        footer: {
          showSubmit: false,
          cancelLabel: "cancel",
          onSubmit: () => {
            this.ref?.close();
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
}
