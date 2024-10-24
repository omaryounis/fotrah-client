import { Component } from "@angular/core";

import { ButtonModule } from "primeng/button";
import { DialogService, DynamicDialogRef } from "primeng/dynamicdialog";

import { PermitTypeFormComponent } from "../permit-type-form/permit-type-form.component";
import { CrudModalFooterComponent } from "@shared/components/crud-modal-footer/crud-modal-footer.component";
import { TranslateModule } from "@ngx-translate/core";
import { LanguageService } from "@shared/services/language/language.service";
import { take } from "rxjs";
import { MessageService } from "primeng/api";
import { MessagesResponse } from "@shared/enums/messages-response.enum";
import { IPermitTypes } from "../../permit-types.model";
import { PermitTypesService } from "@shared/services/permit-types/permit-types.service";
import { CanComponent } from "@shared/components/can/can.component";

@Component({
  selector: "app-create-permit-type",
  standalone: true,
  imports: [ButtonModule, PermitTypeFormComponent, TranslateModule ,CanComponent],
  templateUrl: "./create-permit-type.component.html",
  styleUrl: "./create-permit-type.component.scss",
})
export class CreatePermitTypeComponent {
  ref: DynamicDialogRef | undefined;
  permitTypeData: IPermitTypes = {
    nameAr: "",
    nameEn: "",
    validityBillPaymentPeriodInDays: 0,
    code: "",
  };
  constructor(
    public dialogService: DialogService,
    private langService: LanguageService,
    private permitTypeService: PermitTypesService,
    private messageService: MessageService
  ) {}

  onClickAddPermitTypeButton(event: any) {
    this.permitTypeData = { } as IPermitTypes;
    event.stopPropagation();
    this.ref = this.dialogService.open(PermitTypeFormComponent, {
      header: this.langService.getInstantTranslation("add-permit-type"),
      styleClass: "crud-modal",
      data: {
        permitTypeData: this.permitTypeData,
        footer: {
          submitLabel: "add",
          cancelLabel: "cancel",
          onSubmit: () => {
            this.addPermitType();
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
  addPermitType() {
    if (!this.permitTypeData.formValidation) {
      this.messageService.add({
        severity: "error",
        summary: this.langService.getInstantTranslation("sorry"),
        detail: this.langService.getInstantTranslation("sure-etenred-data"),
      });
      return;
    }
    this.permitTypeService
      .createPermitType(this.permitTypeData)
      .pipe(take(1))
      .subscribe((res) => {
        // this.permitTypeData.id = -1;
        if (res.message == MessagesResponse.SUCCESS) {
          this.messageService.add({
            severity: "success",
            summary: this.langService.getInstantTranslation("done"),
            detail: this.langService.getInstantTranslation(
              "data-added-successfully"
            ),
          });
          this.permitTypeService.getPermitTypes().subscribe();
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
