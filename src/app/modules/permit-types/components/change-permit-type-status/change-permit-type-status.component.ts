import { Component, Input } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CrudModalFooterComponent } from "@shared/components/crud-modal-footer/crud-modal-footer.component";
import { MessagesResponse } from "@shared/enums/messages-response.enum";
import { LanguageService } from "@shared/services/language/language.service";
import { PermitTypesService } from "@shared/services/permit-types/permit-types.service";
import { MessageService } from "primeng/api";
import { DynamicDialogRef, DialogService } from "primeng/dynamicdialog";

import { InputSwitchModule } from "primeng/inputswitch";
import { take } from "rxjs";
import { IPermitTypes } from "../../permit-types.model";
import { PermitTypeFormComponent } from "../permit-type-form/permit-type-form.component";
import { TranslateModule } from "@ngx-translate/core";
import { CanComponent } from "@shared/components/can/can.component";

@Component({
  selector: "app-change-permit-type-status",
  standalone: true,
  imports: [FormsModule, InputSwitchModule,TranslateModule , CanComponent],
  templateUrl: "./change-permit-type-status.component.html",
  styleUrl: "./change-permit-type-status.component.scss",
})
export class ChangePermitTypeStatusComponent {
  @Input() btnIcon!: string;
  @Input() btnLabel!: string;
  @Input() rowData: IPermitTypes = {
    nameAr: "",
    nameEn: "",
    validityBillPaymentPeriodInDays: 0,
    code: "",
  };

  ref!: DynamicDialogRef;
  formValidation: boolean = false;
  get permitTypeData() {
    return this.permitTypeService.rowData();
  }
  constructor(
    private dialogService: DialogService,
    private langService: LanguageService,
    private permitTypeService: PermitTypesService,
    private messageService: MessageService
  ) {}
  ngOnInit(): void {}

  openEditModal(event: any) {
    this.ref = this.dialogService.open(PermitTypeFormComponent, {
      header: this.langService.getInstantTranslation("activation-deactivation"),
      styleClass: "crud-modal",
      data: {
        permitTypeData: this.rowData,
        mode: "toggleActivation",
        footer: {
          formValidation: this.formValidation,
          submitLabel: "confirm",
          cancelLabel: "cancel",
          onSubmit: () => {
            this.updatePermitType();
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
  updatePermitType() {
    this.rowData.status = !this.rowData.status;
  
    this.permitTypeService
      .updatePermitType(this.rowData)
      .pipe(take(1))
      .subscribe((res) => {
        // this.rowData.id = -1;
        if (res.message == MessagesResponse.SUCCESS) {
          this.messageService.add({
            severity: "success",
            summary: this.langService.getInstantTranslation("done"),
            detail: this.langService.getInstantTranslation(
              "data-updated-success"
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
