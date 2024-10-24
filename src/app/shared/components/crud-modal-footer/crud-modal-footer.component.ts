import { AsyncPipe } from "@angular/common";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import { ModalService } from "@shared/services/modal/modal.service";

import { ButtonModule } from "primeng/button";
import { DynamicDialogConfig } from "primeng/dynamicdialog";
import { Subscription } from "rxjs";

@Component({
  selector: "app-crud-modal-footer",
  standalone: true,
  imports: [ButtonModule, TranslateModule ,AsyncPipe],
  templateUrl: "./crud-modal-footer.component.html",
  styleUrl: "./crud-modal-footer.component.scss",
})
export class CrudModalFooterComponent implements OnInit, OnDestroy {
  modalService: ModalService = new ModalService();
  isDisabled = false;
  modalServiceSubscription? : Subscription;
  submitLabel: string = "";
  cancelLabel: string = "";
  showSubmit: boolean = true;
  @Input() formValidation: boolean = true;

  constructor(public dynamicDialogConfig: DynamicDialogConfig) { 
    this.formValidation = this.dynamicDialogConfig.data!.footer.formValidation || false;
    if (this.modalServiceSubscription) {
      this.modalServiceSubscription.unsubscribe();
    }
    this.modalServiceSubscription = this.modalService.disableButton$.subscribe(
     isVisable => {
       this.isDisabled = isVisable;
      }
    );
   
  }
  ngOnDestroy(): void {
    if (this.modalServiceSubscription) {
      this.modalServiceSubscription.unsubscribe();
    }
  }

  handleSubmitClick() {
    this.dynamicDialogConfig.data.footer.onSubmit();
  }

  handelCancelClick() {
    this.dynamicDialogConfig.data.footer.onCancel();
  }

  ngOnInit(): void {
    this.submitLabel = this.dynamicDialogConfig.data.footer.submitLabel;
    this.cancelLabel = this.dynamicDialogConfig.data.footer.cancelLabel;
    this.showSubmit =
      this.dynamicDialogConfig.data.footer.showSubmit === undefined
        ? true
        : this.dynamicDialogConfig.data.footer.showSubmit;
    
  }

  updateVlidation = (value : boolean) => { this.isDisabled = value }
}
