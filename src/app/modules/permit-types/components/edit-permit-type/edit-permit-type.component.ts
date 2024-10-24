import { Component, Input, OnInit } from "@angular/core";
import { IPermitTypes } from "../../permit-types.model";
import { MunicipalsService } from "@shared/services/main-data-management/municipals/municipals.service";
import { CrudModalFooterComponent } from "@shared/components/crud-modal-footer/crud-modal-footer.component";
import { LanguageService } from "@shared/services/language/language.service";
import { MessageService } from "primeng/api";
import { DynamicDialogRef, DialogService } from "primeng/dynamicdialog";
import { take } from "rxjs";
import { PermitTypeFormComponent } from "../permit-type-form/permit-type-form.component";
import { ButtonModule } from "primeng/button";
import { MessagesResponse } from "@shared/enums/messages-response.enum";
import { PermitTypesService } from "@shared/services/permit-types/permit-types.service";
import { CanComponent } from "@shared/components/can/can.component";

@Component({
  selector: "app-edit-permit-type",
  standalone: true,
  imports: [ButtonModule, PermitTypeFormComponent ,CanComponent],
  templateUrl: "./edit-permit-type.component.html",
  styleUrls: ["./edit-permit-type.component.scss"],
})
export class EditPermitTypeComponent implements OnInit {
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
      header: this.langService.getInstantTranslation("update-permit-type"),
      styleClass: "crud-modal",
      data: {
        permitTypeData: this.rowData,
        mode: "edit",
        footer: {
          formValidation: this.formValidation,
          submitLabel: "edit",
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
    this.rowData = this.permitTypeData;
    if (!this.rowData.formValidation) {
      this.messageService.add({
        severity: "error",
        summary: this.langService.getInstantTranslation("sorry"),
        detail: this.langService.getInstantTranslation("sure-etenred-data"),
      });
      return;
    }
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
