import { Component, Input } from "@angular/core";

import { ButtonModule } from "primeng/button";
import { DialogService, DynamicDialogRef } from "primeng/dynamicdialog";

import { CrudModalFooterComponent } from "@shared/components/crud-modal-footer/crud-modal-footer.component";
import { EconomicClassificationFormComponent } from "../economic-classification-form/economic-classification-form.component";

import { IEconomicClassification } from "../../economic-classifications.model";
import { LanguageService } from "@shared/services/language/language.service";

@Component({
  selector: "app-show-economic-classifications",
  standalone: true,
  imports: [ButtonModule, EconomicClassificationFormComponent],
  templateUrl: "./show-economic-classifications.component.html",
  styleUrl: "./show-economic-classifications.component.scss",
})
export class ShowEconomicClassificationsComponent {
  @Input() btnIcon!: string;
  @Input() btnLabel!: string;
  @Input() rowData: IEconomicClassification = {
      name: "",
      code: "",
      beneficiaryAgencyId : 0,
  };

  ref!: DynamicDialogRef;

  constructor(private dialogService: DialogService, private langService:LanguageService) {}

  openShowModal(event: any) {
    this.ref = this.dialogService.open(EconomicClassificationFormComponent, {
      header: this.langService.getInstantTranslation("show-e-class"),
      styleClass: "crud-modal",
      data: {
        economicClassification: this.rowData,
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
