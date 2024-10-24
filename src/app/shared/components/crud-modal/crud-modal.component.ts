import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import { TFormModes } from "@root/src/app/modules/user-managment/user-managment.model";
import { ModalService } from "@shared/services/modal/modal.service";

import { ButtonModule } from "primeng/button";
import { DialogModule } from "primeng/dialog";
import { Subscription } from "rxjs";

export interface ICrudModLInputs {
  title: string;
  visible: boolean;
  submitLable?: string;
  cancelLabel?: string;
  disableButton?: boolean;
}

@Component({
  selector: "app-crud-modal",
  standalone: true,
  imports: [ButtonModule, DialogModule ,TranslateModule],
  templateUrl: "./crud-modal.component.html",
  styleUrl: "./crud-modal.component.scss",
})
export class CrudModalComponent  {

 
  @Input() mode: string = "show";
  @Input() config: ICrudModLInputs = {
    title: "",
    visible: false,
    submitLable: "",
    cancelLabel: "",
  };
  @Output() onSubmit: EventEmitter<void> = new EventEmitter<void>();
  @Output() onCancel: EventEmitter<void> = new EventEmitter<void>();

  submitLabel: string = this.config.submitLable!;
  cancelLabel: string = this.config.cancelLabel!;

  handleSubmitClick() {
    this.onSubmit.emit();
  }

  handelCancelClick() {
    this.onCancel.emit();
  }
}
