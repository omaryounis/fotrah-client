import { Component, Input } from "@angular/core";

import { ButtonModule } from "primeng/button";
import { DialogService, DynamicDialogRef } from "primeng/dynamicdialog";

import { PermitTypeFormComponent } from "../permit-type-form/permit-type-form.component";
import { CrudModalFooterComponent } from "@shared/components/crud-modal-footer/crud-modal-footer.component";

import { IPermitTypes } from "../../permit-types.model";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-show-permit-type",
  standalone: true,
  imports: [ButtonModule, PermitTypeFormComponent],
  templateUrl: "./show-permit-type.component.html",
  styleUrl: "./show-permit-type.component.scss",
})
export class ShowPermitTypeComponent {
  @Input() btnIcon!: string;
  @Input() btnLabel!: string;
  @Input() rowData: IPermitTypes = {
    nameAr: "",
    nameEn: "",
    code: "",
  };

  ref!: DynamicDialogRef;

  constructor(private dialogService: DialogService , private translateService: TranslateService) {}

  openShowModal(event: any) {
    this.ref = this.dialogService.open(PermitTypeFormComponent, {
      header:this.translateService.instant('show-permit-type'),
      styleClass: "crud-modal",
      data: {
        permitTypeData: this.rowData,
        mode: "show",
        footer: {
          showSubmit: false,
          cancelLabel: this.translateService.instant('cancel'),
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
